'use client';

import { useEffect, useMemo, useState } from 'react';

import { ArrowRight, Camera, Check, ShieldCheck } from 'lucide-react';

import { createClient } from '@/lib/supabase/client';
import { createVaultMaterial } from '@/lib/crypto/vault';

import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';

import { content } from '@/data/content';

import styles from './OnboardingFlow.module.css';

export function OnboardingFlow({ userId, email }: {
  userId: string;
  email?: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [step, setStep] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [vaultPassword, setVaultPassword] = useState('');
  const [vaultConfirm, setVaultConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);
  async function finish(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (vaultPassword.length < 12)
        throw new Error(content.common.minVaultPassword);
      if (vaultPassword !== vaultConfirm)
        throw new Error(content.common.vaultPasswordMismatch);
      let avatarUrl: string | null = null;
      if (avatarFile) {
        if (avatarFile.size > 2 * 1024 * 1024)
          throw new Error('Profile photo must be smaller than 2 MB.');
        if (!avatarFile.type.startsWith('image/'))
          throw new Error('Profile photo must be an image.');
        const extension = avatarFile.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${userId}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: false });
        if (uploadError)
          throw uploadError;
        avatarUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
      }
      const material = await createVaultMaterial(vaultPassword);
      const { error: profileError } = await supabase.from('profiles').upsert({
        userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim().toLowerCase(),
        avatarUrl,
        onboardingCompleted: true,
      });
      if (profileError)
        throw profileError;
      const { error: vaultError } = await supabase.from('vaultSettings').upsert({
        userId,
        kdfSalt: material.kdfSalt,
        passwordVerifier: material.passwordVerifier,
        verifierIv: material.verifierIv,
        kdfIterations: material.kdfIterations,
      });
      if (vaultError)
        throw vaultError;
      window.location.replace('/dashboard');
    }
    catch (caught) {
      setError(caught instanceof Error ? caught.message : content.auth.error);
    }
    finally {
      setBusy(false);
    }
  }
  function next() {
    setError('');
    if (!firstName.trim() || !lastName.trim())
      return setError('Enter your first and last name.');
    if (!/^[a-zA-Z0-9_]{3,24}$/.test(username.trim()))
      return setError('Username must be 3–24 characters using letters, numbers or underscores.');
    setStep(1);
  }
  return (<div className={styles.shell}>
    <div className={styles.header}>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">{content.onboarding.eyebrow}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-[-.04em] text-slate-950">{content.onboarding.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{content.onboarding.description}</p>
      </div>
      <div className="hidden items-center gap-2 text-xs font-semibold text-slate-500 sm:flex">
        {[0, 1].map((item) => <span key={item} className={`grid size-8 place-items-center rounded-full ${step === item ? 'bg-indigo-600 text-white' : item < step ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>{item < step ? <Check size={15} /> : item + 1}</span>)}
      </div>
    </div>

    <form onSubmit={finish} className="mt-7 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
      {step === 0 ? (<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <label className="relative grid size-20 shrink-0 cursor-pointer place-items-center overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 text-slate-400">
            {avatarPreview ? <img src={avatarPreview} alt="Profile preview" className="size-full object-cover" /> : <Camera size={24} />}
            <input type="file" accept="image/*" className="sr-only" onChange={(event) => setAvatarFile(event.target.files?.[0] ?? null)} />
          </label>
          <div><p className="font-bold text-slate-900">{content.onboarding.profilePhoto}</p><p className="mt-1 text-xs leading-5 text-slate-500">{content.onboarding.profilePhotoHint}</p></div>
        </div>

        <div className="mt-7 grid gap-5 sm:grid-cols-2">
          <Input label={content.onboarding.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required />
          <Input label={content.onboarding.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required />
        </div>
        <div className="mt-5"><Input label={content.onboarding.username} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" autoComplete="username" required /></div>
        {email ? <p className="mt-4 text-xs text-slate-400">Account: {email}</p> : null}
        {error ? <p className="mt-5 text-sm font-medium text-rose-600">{error}</p> : null}
        <Button type="button" className="mt-6 w-full" onClick={next}>Continue <ArrowRight size={16} /></Button>
      </div>) : (<div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><ShieldCheck size={22} /></div>
        <h2 className="mt-5 text-2xl font-bold tracking-[-.03em] text-slate-950">{content.onboarding.vaultTitle}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">{content.onboarding.vaultDescription}</p>
        <div className="mt-7 space-y-5">
          <Input label={content.vaultSetup.password} type="password" value={vaultPassword} onChange={(e) => setVaultPassword(e.target.value)} autoComplete="new-password" required />
          <Input label={content.vaultSetup.confirm} type="password" value={vaultConfirm} onChange={(e) => setVaultConfirm(e.target.value)} autoComplete="new-password" required />
        </div>
        {error ? <p className="mt-5 text-sm font-medium text-rose-600">{error}</p> : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" variant="secondary" className="sm:flex-1" onClick={() => setStep(0)}>Back</Button>
          <Button type="submit" className="sm:flex-[2]" disabled={busy}>{busy ? 'Preparing your vault…' : content.onboarding.finish}<ArrowRight size={16} /></Button>
        </div>
        <p className="mt-5 rounded-2xl bg-amber-50 p-4 text-xs leading-5 text-amber-800">{content.vaultSetup.note}</p>
      </div>)}

      <aside className="rounded-[28px] border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">SkelPass setup</p>
        <h3 className="mt-3 text-xl font-bold tracking-[-.03em] text-slate-950">{content.onboarding.sideTitle}</h3>
        <div className="mt-6 space-y-4">
          {content.onboarding.checklist.map((item) => <div key={item} className="flex gap-3"><span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white text-indigo-600 shadow-sm"><Check size={14} /></span><p className="text-sm leading-6 text-slate-600">{item}</p></div>)}
        </div>
      </aside>
    </form>
  </div>);
}
