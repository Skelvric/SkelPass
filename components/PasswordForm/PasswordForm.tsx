'use client';

import { useMemo, useState } from 'react';
import { Eye, EyeOff, KeyRound, RefreshCw } from 'lucide-react';

import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';

import { content } from '@/data/content';

import { generatePassword } from '@/lib/crypto/vault';

import type { PasswordItem } from '@/types/vault';

import styles from './PasswordForm.module.css';

export function PasswordForm({ initial, onSave, onCancel, saving }: {
  initial?: PasswordItem;
  onSave: (item: PasswordItem) => Promise<void>;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<PasswordItem>({ title: initial?.title ?? '', username: initial?.username ?? '', password: initial?.password ?? '', url: initial?.url ?? '', notes: initial?.notes ?? '' });
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const title = initial?.id ? content.password.editTitle : content.password.newTitle;
  const canSubmit = useMemo(() => form.title.trim() && form.password, [form.title, form.password]);
  function update<K extends keyof PasswordItem>(key: K, value: PasswordItem[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.title.trim() || !form.password) {
      setError(content.password.required);
      return;
    }
    setError('');
    await onSave({ ...form, id: initial?.id });
  }
  return (<form onSubmit={submit} className="space-y-5">
    <div className="grid gap-5 sm:grid-cols-2">
      <Input label={content.password.title} value={form.title} onChange={e => update('title', e.target.value)} placeholder="GitHub" autoFocus />
      <Input label={content.password.username} value={form.username} onChange={e => update('username', e.target.value)} placeholder="you@example.com" />
    </div>
    <div>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{content.password.password}</span>
      <div className="flex gap-2">
        <div className="relative flex-1"><input className={styles.input} type={show ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} autoComplete="new-password" aria-label={content.password.password} /><button type="button" onClick={() => setShow(v => !v)} className={styles.trailingButton} aria-label={show ? content.password.hide : content.password.reveal}>{show ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
        <Button type="button" variant="secondary" onClick={() => update('password', generatePassword())}><RefreshCw size={16} />{content.password.generate}</Button>
      </div>
    </div>
    <Input label={content.password.url} value={form.url} onChange={e => update('url', e.target.value)} placeholder="https://github.com" type="url" />
    <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{content.password.notes}</span><textarea className={styles.textarea} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder={content.common.optionalNotes} rows={4} /></label>
    {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
    <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-5"><Button type="button" variant="ghost" onClick={onCancel}>{content.password.cancel}</Button><Button type="submit" disabled={!canSubmit || saving}><KeyRound size={16} />{saving ? content.common.saving : initial?.id ? content.password.update : content.password.save}</Button></div>
  </form>);
}
