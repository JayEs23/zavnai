import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function FormInput({ label, error, className = '', ...props }: FormInputProps) {
  return (
    <div className="space-y-2.5 w-full">
      {label && (
        <label className="label">
          {label}
        </label>
      )}
      <input
        className={`input-field ${className}`}
        {...props}
      />
      {error && <p className="text-sm font-medium text-red-500 ml-1">{error}</p>}
    </div>
  );
}

