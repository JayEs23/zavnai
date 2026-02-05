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
  file_type: string; // 'image' | 'pdf' | 'document'
  file_size: number; // bytes
  mime_type: string;
  url: string; // Signed URL for download/preview
  thumbnail_url?: string; // For images
  
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

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100),
          });
        }
      });

      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
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

      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      // Send request
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      xhr.open('POST', `${apiUrl}/api/documents/upload`);
      
      // Add auth token
      const token = localStorage.getItem('auth_token');
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }

      xhr.send(formData);
    });
  },

  /**
   * Get all documents for the current user
   */
  getDocuments: async (params?: {
    commitment_id?: string;
    goal_id?: string;
    file_type?: string;
    verified?: boolean;
  }): Promise<Document[]> => {
    const searchParams = new URLSearchParams();
    if (params?.commitment_id) searchParams.append('commitment_id', params.commitment_id);
    if (params?.goal_id) searchParams.append('goal_id', params.goal_id);
    if (params?.file_type) searchParams.append('file_type', params.file_type);
    if (params?.verified !== undefined) searchParams.append('verified', String(params.verified));
    
    return api.get<Document[]>(`/documents?${searchParams}`);
  },

  /**
   * Get a specific document
   */
  getDocument: async (documentId: string): Promise<Document> => {
    return api.get<Document>(`/documents/${documentId}`);
  },

  /**
   * Delete a document
   */
  deleteDocument: async (documentId: string): Promise<{ success: boolean }> => {
    return api.delete<{ success: boolean }>(`/documents/${documentId}`);
  },

  /**
   * Update document metadata
   */
  updateDocument: async (
    documentId: string,
    updates: {
      description?: string;
      tags?: string[];
    }
  ): Promise<Document> => {
    return api.patch<Document>(`/documents/${documentId}`, updates);
  },

  /**
   * Verify a document (approve/reject)
   */
  verifyDocument: async (
    request: DocumentVerificationRequest
  ): Promise<Document> => {
    return api.post<Document>(
      `/documents/${request.document_id}/verify`,
      {
        status: request.status,
        notes: request.notes,
      }
    );
  },

  /**
   * Get download URL for a document
   */
  getDownloadUrl: async (documentId: string): Promise<{ url: string }> => {
    return api.get<{ url: string }>(`/documents/${documentId}/download`);
  },

  /**
   * Get documents for a specific commitment
   */
  getCommitmentDocuments: async (commitmentId: string): Promise<Document[]> => {
    return documentsApi.getDocuments({ commitment_id: commitmentId });
  },

  /**
   * Get documents for a specific goal
   */
  getGoalDocuments: async (goalId: string): Promise<Document[]> => {
    return documentsApi.getDocuments({ goal_id: goalId });
  },

  /**
   * Check if file type is supported
   */
  isSupportedFileType: (file: File): boolean => {
    const supportedTypes = [
      // Images
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      // Spreadsheets (for data-based goals)
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    return supportedTypes.includes(file.type);
  },

  /**
   * Get human-readable file size
   */
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },
};

