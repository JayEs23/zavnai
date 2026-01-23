import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function FormTextarea({ label, error, className = '', ...props }: FormTextareaProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-slate-300">{label}</label>}
      <textarea
        className={`w-full bg-slate-800 border-none p-4 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary outline-none resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

