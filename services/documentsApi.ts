/**
 * Documents API Service
 *
 * Handles document upload and verification for commitments
 * Supports images, PDFs, and other proof of completion
 */

import { api } from '@/lib/api';

// ============================================================================
// TYPES
// ============================================================================

export interface Document {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  mime_type: string;
  url: string;
  thumbnail_url?: string;

  // Metadata
  commitment_id?: string;
  goal_id?: string;
  description?: string;
  tags?: string[];

  // Verification
  verified: boolean;
  verification_status: 'pending' | 'approved' | 'rejected';
  verification_notes?: string;
  verified_at?: string;

  // Timestamps
  uploaded_at: string;
  created_by: string;
}

export interface UploadDocumentRequest {
  file: File;
  commitment_id?: string;
  goal_id?: string;
  description?: string;
  tags?: string[];
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface DocumentVerificationRequest {
  document_id: string;
  status: 'approved' | 'rejected';
  notes?: string;
}

// ============================================================================
// API METHODS
// ============================================================================

export const documentsApi = {
  /**
   * Upload a document with progress tracking
   */
  uploadDocument: async (
    request: UploadDocumentRequest,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', request.file);
    if (request.commitment_id) formData.append('commitment_id', request.commitment_id);
    if (request.goal_id) formData.append('goal_id', request.goal_id);
    if (request.description) formData.append('description', request.description);
    if (request.tags) formData.append('tags', JSON.stringify(request.tags));

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100),
          });
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            reject(new Error('Invalid response from server'));
          }
        } else {
          try {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.detail || error.message || 'Upload failed'));
          } catch {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      xhr.open('POST', `${apiUrl}/api/documents/upload`);

      const token = localStorage.getItem('auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  },

  /** Get all documents for the current user */
  async getDocuments(params?: {
    commitment_id?: string;
    goal_id?: string;
    file_type?: string;
    verified?: boolean;
  }): Promise<Document[]> {
    const searchParams = new URLSearchParams();
    if (params?.commitment_id) searchParams.append('commitment_id', params.commitment_id);
    if (params?.goal_id) searchParams.append('goal_id', params.goal_id);
    if (params?.file_type) searchParams.append('file_type', params.file_type);
    if (params?.verified !== undefined) searchParams.append('verified', String(params.verified));
    const res = await api.get<Document[]>(`/api/documents?${searchParams}`);
    if (res.error) throw new Error(res.error.message || 'Failed to get documents');
    return res.data || [];
  },

  /** Get a specific document */
  async getDocument(documentId: string): Promise<Document> {
    const res = await api.get<Document>(`/api/documents/${documentId}`);
    if (res.error) throw new Error(res.error.message || 'Failed to get document');
    return res.data!;
  },

  /** Delete a document */
  async deleteDocument(documentId: string): Promise<{ success: boolean }> {
    const res = await api.delete<{ success: boolean }>(`/api/documents/${documentId}`);
    if (res.error) throw new Error(res.error.message || 'Failed to delete document');
    return res.data!;
  },

  /** Update document metadata */
  async updateDocument(
    documentId: string,
    updates: {
      description?: string;
      tags?: string[];
    }
  ): Promise<Document> {
    const res = await api.patch<Document>(`/api/documents/${documentId}`, updates);
    if (res.error) throw new Error(res.error.message || 'Failed to update document');
    return res.data!;
  },

  /** Verify a document (approve/reject) */
  async verifyDocument(
    request: DocumentVerificationRequest
  ): Promise<Document> {
    const res = await api.post<Document>(
      `/api/documents/${request.document_id}/verify`,
      {
        status: request.status,
        notes: request.notes,
      }
    );
    if (res.error) throw new Error(res.error.message || 'Failed to verify document');
    return res.data!;
  },

  /** Get download URL for a document */
  async getDownloadUrl(documentId: string): Promise<{ url: string }> {
    const res = await api.get<{ url: string }>(`/api/documents/${documentId}/download`);
    if (res.error) throw new Error(res.error.message || 'Failed to get download URL');
    return res.data!;
  },

  /** Get documents for a specific commitment */
  getCommitmentDocuments: async (commitmentId: string): Promise<Document[]> => {
    return documentsApi.getDocuments({ commitment_id: commitmentId });
  },

  /** Get documents for a specific goal */
  getGoalDocuments: async (goalId: string): Promise<Document[]> => {
    return documentsApi.getDocuments({ goal_id: goalId });
  },

  /** Check if file type is supported */
  isSupportedFileType: (file: File): boolean => {
    const supportedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    return supportedTypes.includes(file.type);
  },

  /** Get human-readable file size */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },
};
