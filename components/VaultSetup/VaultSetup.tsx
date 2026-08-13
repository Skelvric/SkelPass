'use client';

import { useState } from 'react';

import { ShieldCheck } from 'lucide-react';

import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { Input } from '@/components/Input/Input';

import { content } from '@/data/content';

import { createVaultMaterial } from '@/lib/crypto/vault';
import { createClient } from '@/lib/supabase/client';

import type { VaultMetadata } from '@/types/vault';

import styles from './VaultSetup.module.css';

export function VaultSetup({ userId, onCreated }: {
  userId: string;
  onCreated: (key: CryptoKey, vault: VaultMetadata) => void;
}) {
  const supabase = createClient();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (password.length < 12)
      return setError(content.common.minVaultPassword);
    if (password !== confirm)
      return setError(content.common.vaultPasswordMismatch);
    setBusy(true);
    setError('');
    try {
      const material = await createVaultMaterial(password);
      const { data, error } = await supabase.from('vaultSettings').insert({ userId, kdfSalt: material.kdfSalt, passwordVerifier: material.passwordVerifier, verifierIv: material.verifierIv, kdfIterations: material.kdfIterations }).select().single();
      if (error)
        throw error;
      if (!data)
        throw new Error(content.common.unableCreateVault);
      const { unlockVault } = await import('@/lib/crypto/vault');
      const key = await unlockVault(password, { kdfSalt: material.kdfSalt, passwordVerifier: material.passwordVerifier, verifierIv: material.verifierIv, kdfIterations: material.kdfIterations });
      onCreated(key, data as VaultMetadata);
    }
    catch (caught) {
      setError(caught instanceof Error ? caught.message : content.common.unableCreateVault);
    }
    finally {
      setBusy(false);
    }
  }
  return <div className={styles.wrap}><Card className="w-full max-w-lg p-7 sm:p-9"><div className={styles.icon}><ShieldCheck size={22} /></div><h1 className="mt-5 text-3xl font-bold tracking-[-.04em] text-slate-950">{content.vaultSetup.title}</h1><p className="mt-3 text-sm leading-7 text-slate-600">{content.vaultSetup.description}</p><form onSubmit={submit} className="mt-7 space-y-5"><Input label={content.vaultSetup.password} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" /><Input label={content.vaultSetup.confirm} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />{error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}<Button type="submit" className="w-full" disabled={busy}>{busy ? 'Creating…' : content.vaultSetup.cta}</Button></form><p className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">{content.vaultSetup.note}</p></Card></div>;
}
