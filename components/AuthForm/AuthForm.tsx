'use client';

import { useState } from 'react';
import { ArrowRight, Mail, ShieldCheck } from 'lucide-react';

import { Button } from '@/components/Button/Button';
import { Input } from '@/components/Input/Input';

import { createClient } from '@/lib/supabase/client';

import { content } from '@/data/content';

export function AuthForm({ mode }: {
	mode: 'login' | 'register';
}) {
	const supabase = createClient();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirm, setConfirm] = useState('');
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');
	const [notice, setNotice] = useState('');
	const login = mode === 'login';
	async function submit(event: React.FormEvent) {
		event.preventDefault();
		setBusy(true);
		setError('');
		setNotice('');
		try {
			if (!login) {
				if (password.length < 10)
					throw new Error(content.common.minAccountPassword);
				if (password !== confirm)
					throw new Error(content.common.accountPasswordMismatch);
				const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
				if (signUpError)
					throw signUpError;
				if (!data.session)
					setNotice(content.auth.checkEmail);
				else
					window.location.replace('/onboarding');
				return;
			}
			const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
			if (signInError)
				throw signInError;
			window.location.replace('/dashboard');
		}
		catch (caught) {
			setError(caught instanceof Error ? caught.message : content.auth.error);
		}
		finally {
			setBusy(false);
		}
	}
	return <form onSubmit={submit} className="space-y-5"><div className="mb-2 flex items-center gap-3 rounded-2xl bg-indigo-50 p-4 text-xs font-medium leading-5 text-indigo-800"><ShieldCheck size={18} className="shrink-0" /> Your vault password is separate from your SkelPass account password.</div><Input label={content.auth.email} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /><Input label={content.auth.password} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••" autoComplete={login ? 'current-password' : 'new-password'} required />{!login ? <Input label={content.auth.confirmPassword} type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••••" autoComplete="new-password" required /> : null}{error ? <p className="text-sm font-medium leading-6 text-rose-600">{error}</p> : null}{notice ? <p className="text-sm font-medium leading-6 text-emerald-700">{notice}</p> : null}<Button type="submit" className="w-full" disabled={busy}>{busy ? (login ? content.common.loggingIn : content.common.creating) : (login ? content.auth.loginCta : content.auth.registerCta)}<ArrowRight size={16} /></Button>{login ? <p className="flex items-center justify-center gap-2 text-xs text-slate-400"><Mail size={14} /> Password resets can be wired through Supabase Auth email flows.</p> : null}</form>;
}
