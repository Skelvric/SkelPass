import type { InputHTMLAttributes } from 'react';

import styles from './Input.module.css';

export function Input({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
}) {
  return (<label className="block">
    <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
    <input className={`${styles.input} ${error ? styles.error : ''}`} {...props} />
    {error ? <span className="mt-1.5 block text-xs font-medium text-rose-600">{error}</span> : null}
  </label>);
}
