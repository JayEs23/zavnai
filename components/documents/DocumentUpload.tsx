'use client';

import React, { useState, useRef } from 'react';
import { documentsApi, type Document, type UploadProgress } from '@/services/documentsApi';
import { MdCloudUpload, MdCheckCircle, MdError, MdClose, MdInsertDriveFile, MdImage } from 'react-icons/md';
import { toast } from 'react-hot-toast';

interface DocumentUploadProps {
  commitmentId?: string;
  goalId?: string;
  onUploadComplete?: (document: Document) => void;
  onClose?: () => void;
  maxFileSizeMB?: number;
}

export function DocumentUpload({
  commitmentId,
  goalId,
  onUploadComplete,
  onClose,
  maxFileSizeMB = 10,
}: DocumentUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size
    const maxSize = maxFileSizeMB * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError(`File size must be less than ${maxFileSizeMB}MB`);
      return;
    }

    // Validate file type
    if (!documentsApi.isSupportedFileType(selectedFile)) {
      setError('Unsupported file type. Please upload an image or PDF.');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      // Trigger file selection with the dropped file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(droppedFile);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({ target: fileInputRef.current } as any);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      setProgress({ loaded: 0, total: file.size, percentage: 0 });

      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const document = await documentsApi.uploadDocument(
        {
          file,
          commitment_id: commitmentId,
          goal_id: goalId,
          description: description || undefined,
          tags: tagsArray.length > 0 ? tagsArray : undefined,
        },
        (progressData) => {
          setProgress(progressData);
        }
      );

      toast.success('Document uploaded successfully!');
      onUploadComplete?.(document);
      
      // Reset form
      setFile(null);
      setDescription('');
      setTags('');
      setProgress(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error: any) {
      setError(error.message || 'Failed to upload document');
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const isImage = file?.type.startsWith('image/');

  return (
    <div className="bg-card-bg border border-border-subtle rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Upload Document</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <MdClose size={20} className="text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          file
            ? 'border-green-500 bg-green-500/5'
            : 'border-border-subtle hover:border-brand-primary bg-muted/30'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          id="file-upload"
        />

        {!file ? (
          <>
            <MdCloudUpload size={48} className="mx-auto text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">
              Drop file here or click to upload
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Supports images, PDFs, and documents up to {maxFileSizeMB}MB
            </p>
            <label
              htmlFor="file-upload"
              className="inline-block px-6 py-3 bg-brand-primary text-white rounded-lg cursor-pointer hover:bg-brand-primary-hover transition-colors"
            >
              Choose File
            </label>
          </>
        ) : (
          <>
            {isImage ? (
              <MdImage size={48} className="mx-auto text-green-500 mb-4" />
            ) : (
              <MdInsertDriveFile size={48} className="mx-auto text-green-500 mb-4" />
            )}
            <h4 className="text-lg font-medium text-foreground mb-2">{file.name}</h4>
            <p className="text-sm text-muted-foreground mb-4">
              {documentsApi.formatFileSize(file.size)}
            </p>
            <button
              onClick={() => {
                setFile(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              className="text-sm text-red-500 hover:underline"
            >
              Remove file
            </button>
          </>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
          <MdError className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Metadata Form */}
      {file && !uploading && (
        <div className="mt-6 space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this document prove?"
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none"
              rows={3}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="proof, receipt, screenshot (comma-separated)"
              className="w-full px-4 py-3 bg-background border border-border-subtle rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {progress && uploading && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Uploading...</span>
            <span className="text-sm text-muted-foreground">{progress.percentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary transition-all duration-300"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      {file && !uploading && (
        <div className="mt-6 flex gap-3">
          {onClose && (
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-muted text-foreground rounded-lg hover:bg-muted-hover transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="flex-1 px-4 py-3 bg-brand-primary text-white rounded-lg hover:bg-brand-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <MdCloudUpload size={20} />
            Upload Document
          </button>
        </div>
      )}

      {/* Success State */}
      {!file && progress?.percentage === 100 && !uploading && (
        <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
          <MdCheckCircle className="text-green-500" size={20} />
          <p className="text-sm text-green-500">Upload complete!</p>
        </div>
      )}
    </div>
  );
}

