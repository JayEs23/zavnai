import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FormInput({ label, error, className = '', ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-slate-300">{label}</label>}
      <input
        className={`w-full bg-slate-800 border-none p-4 rounded-xl text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary outline-none ${className}`}
        {...props}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

