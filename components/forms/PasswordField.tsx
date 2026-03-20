'use client';

import React, { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export type PasswordFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> & {
  /** If omitted, a stable id is generated for label association */
  id?: string;
  label?: React.ReactNode;
  /** Rendered on the same row as the label (e.g. forgot-password link) */
  labelExtra?: React.ReactNode;
};

/**
 * Password input with show/hide toggle (a11y: aria-pressed, aria-label).
 */
export function PasswordField({
  id,
  label,
  labelExtra,
  className = '',
  disabled,
  ...rest
}: PasswordFieldProps) {
  const genId = useId();
  const fieldId = id ?? genId;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      {(label != null || labelExtra != null) && (
        <div className="mb-2 flex items-center justify-between gap-2">
          {label != null ? (
            <label htmlFor={fieldId} className="label mb-0">
              {label}
            </label>
          ) : (
            <span />
          )}
          {labelExtra}
        </div>
      )}
      <div className="relative">
        <input
          id={fieldId}
          type={visible ? 'text' : 'password'}
          disabled={disabled}
          className={`input-field pr-12 ${className}`.trim()}
          {...rest}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          onClick={() => setVisible((v) => !v)}
          disabled={disabled}
          aria-label={visible ? 'Hide password' : 'Show password'}
          aria-pressed={visible}
        >
          {visible ? (
            <EyeOff className="h-5 w-5 shrink-0" aria-hidden />
          ) : (
            <Eye className="h-5 w-5 shrink-0" aria-hidden />
          )}
        </button>
      </div>
    </div>
  );
}
