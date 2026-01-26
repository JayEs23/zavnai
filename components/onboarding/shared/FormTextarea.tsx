import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function FormTextarea({ label, error, className = '', ...props }: FormTextareaProps) {
  return (
    <div className="space-y-2.5 w-full">
      {label && (
        <label className="block text-sm font-bold tracking-tight text-slate-700 dark:text-slate-300 ml-1">
          {label}
        </label>
      )}
      <textarea
        className={`w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all dark:bg-white/5 dark:border-white/10 dark:text-white dark:placeholder:text-white/20 dark:focus:ring-primary/20 resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-sm font-medium text-red-500 ml-1">{error}</p>}
    </div>
  );
}

