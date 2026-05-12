import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, hint, className = '', id, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>
    )}
    <input
      id={id}
      className={`
        w-full px-3 py-2 rounded-lg text-sm
        bg-bg-muted border border-border
        text-text-primary placeholder:text-text-muted
        focus:outline-none focus:border-bg-brand focus:ring-1 focus:ring-bg-brand/30
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-150
        ${error ? 'border-error-strong focus:border-error-strong focus:ring-error-strong/20' : ''}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-xs text-error-strong">{error}</p>}
    {hint && !error && <p className="text-xs text-text-muted">{hint}</p>}
  </div>
);

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', id, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>
    )}
    <textarea
      id={id}
      rows={3}
      className={`
        w-full px-3 py-2 rounded-lg text-sm resize-none
        bg-bg-muted border border-border
        text-text-primary placeholder:text-text-muted
        focus:outline-none focus:border-bg-brand focus:ring-1 focus:ring-bg-brand/30
        transition-colors duration-150
        ${error ? 'border-error-strong' : ''}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-xs text-error-strong">{error}</p>}
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({ label, error, options, placeholder, className = '', id, ...props }) => (
  <div className="flex flex-col gap-1">
    {label && (
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label}
      </label>
    )}
    <select
      id={id}
      className={`
        w-full px-3 py-2 rounded-lg text-sm
        bg-bg-muted border border-border
        text-text-primary
        focus:outline-none focus:border-bg-brand focus:ring-1 focus:ring-bg-brand/30
        transition-colors duration-150
        ${error ? 'border-error-strong' : ''}
        ${className}
      `}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-error-strong">{error}</p>}
  </div>
);
