import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function FormTextarea({ label, error, className = '', ...props }: FormTextareaProps) {
  return (
    <div className="space-y-2.5 w-full">
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <textarea
        className={`form-input resize-y min-h-[100px] ${className}`}
        {...props}
      />
      {error && <p className="text-sm font-medium text-[var(--error)] ml-1">{error}</p>}
    </div>
  );
}

