'use client';

import { CheckCircle2, X } from 'lucide-react';

import styles from './Toast.module.css';

export function Toast({ message, onClose }: {
  message: string;
  onClose: () => void;
}) {
  return (<div className={styles.toast} role="status">
    <CheckCircle2 size={18} className="text-emerald-500" />
    <span>{message}</span>
    <button onClick={onClose} aria-label="Close notification" className="ml-auto text-slate-400 hover:text-slate-700"><X size={17} /></button>
  </div>);
}
