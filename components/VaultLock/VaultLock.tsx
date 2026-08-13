'use client';

import { useState } from 'react';

import { LockKeyhole } from 'lucide-react';

import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { Input } from '@/components/Input/Input';

import { content } from '@/data/content';

import { unlockVault } from '@/lib/crypto/vault';

import type { VaultMetadata } from '@/types/vault';

import styles from './VaultLock.module.css';

export function VaultLock({ vault, onUnlocked }: {
  vault: VaultMetadata;
  onUnlocked: (key: CryptoKey) => void;
}) {
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      onUnlocked(await unlockVault(password, { kdfSalt: vault.kdfSalt, passwordVerifier: vault.passwordVerifier, verifierIv: vault.verifierIv, kdfIterations: vault.kdfIterations }));
    }
    catch {
      setError(content.vaultLock.wrong);
    }
    finally {
      setBusy(false);
    }
  }
  return <div className={styles.wrap}><Card className="w-full max-w-lg p-7 sm:p-9"><div className={styles.icon}><LockKeyhole size={22} /></div><h1 className="mt-5 text-3xl font-bold tracking-[-.04em] text-slate-950">{content.vaultLock.title}</h1><p className="mt-3 text-sm leading-7 text-slate-600">{content.vaultLock.description}</p><form onSubmit={submit} className="mt-7 space-y-5"><Input label={content.vaultLock.password} type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" autoFocus />{error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}<Button type="submit" className="w-full" disabled={!password || busy}>{busy ? 'Unlocking…' : content.vaultLock.cta}</Button></form></Card></div>;
}
