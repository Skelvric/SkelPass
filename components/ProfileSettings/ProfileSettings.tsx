'use client';

import { useState } from 'react';

import { Camera, Globe2, Laptop, Save, ShieldCheck, Trash2, UserRound } from 'lucide-react';

import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';
import { Input } from '@/components/Input/Input';

import { content } from '@/data/content';

import { createClient } from '@/lib/supabase/client';
import { getDeviceIdentity } from '@/lib/device';

import type { LoginDevice, Profile } from '@/types/profile';

export function ProfileSettings({ user, profile, devices }: {
  user: {
    id: string;
    email: string;
  };
  profile: Profile;
  devices: LoginDevice[];
}) {
  const supabase = createClient();
  const [form, setForm] = useState(profile);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const current = getDeviceIdentity();
  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      let avatarUrl = form.avatarUrl;
      if (avatarFile) {
        if (avatarFile.size > 2 * 1024 * 1024)
          throw new Error('Profile photo must be smaller than 2 MB.');
        const extension = avatarFile.name.split('.').pop()?.toLowerCase() || 'jpg';
        const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(path, avatarFile);
        if (uploadError)
          throw uploadError;
        avatarUrl = supabase.storage.from('avatars').getPublicUrl(path).data.publicUrl;
      }
      const { data, error: updateError } = await supabase.from('profiles').update({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        username: form.username.trim().toLowerCase(),
        avatarUrl,
        bio: form.bio?.trim() || null,
        location: form.location?.trim() || null,
        website: form.website?.trim() || null,
        phoneNumber: form.phoneNumber?.trim() || null,
      }).eq('userId', user.id).select().single();
      if (updateError)
        throw updateError;
      setForm(data as Profile);
      setAvatarFile(null);
      setMessage('Profile updated.');
    }
    catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to update your profile.');
    }
    finally {
      setSaving(false);
    }
  }
  async function removeDevice(id: string) {
    if (!window.confirm('Remove this device from the account device list?'))
      return;
    await supabase.from('loginDevices').delete().eq('id', id).eq('userId', user.id);
    window.location.reload();
  }
  async function deleteAccount() {
    if (!window.confirm(content.profile.deleteConfirm))
      return;
    const response = await fetch('/api/account/delete', { method: 'POST' });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(body.error || 'Unable to delete account.');
      return;
    }
    window.location.replace('/');
  }
  return (<div className="space-y-8 py-8">
    <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Account</p><h1 className="mt-2 text-3xl font-bold tracking-[-.04em] text-slate-950">{content.profile.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{content.profile.description}</p></div>

    <form onSubmit={save} className="grid gap-6 xl:grid-cols-[1.45fr_.55fr]">
      <Card className="p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="text-lg font-bold text-slate-950">{content.profile.profileTitle}</h2><p className="mt-1 text-sm text-slate-500">{content.profile.profileDescription}</p></div>
          <div className="flex items-center gap-3"><div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-3xl bg-indigo-50 text-xl font-bold text-indigo-700">{form.avatarUrl ? <img src={form.avatarUrl} alt="" className="size-full object-cover" /> : <UserRound size={24} />}</div><label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"><Camera size={14} /> {content.profile.avatar}<input type="file" accept="image/*" className="sr-only" onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)} /></label></div>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2"><Input label={content.profile.firstName} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} /><Input label={content.profile.lastName} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} /><Input label={content.profile.username} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /><Input label="Email" value={user.email} readOnly /><Input label={content.profile.location} value={form.location ?? ''} onChange={e => setForm({ ...form, location: e.target.value })} /><Input label={content.profile.phoneNumber} value={form.phoneNumber ?? ''} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} /><Input label={content.profile.website} value={form.website ?? ''} onChange={e => setForm({ ...form, website: e.target.value })} /><div className="sm:col-span-2"><label className="block text-xs font-bold text-slate-700">{content.profile.bio}</label><textarea className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50" value={form.bio ?? ''} onChange={e => setForm({ ...form, bio: e.target.value })} maxLength={280} /></div></div>
        {error ? <p className="mt-5 text-sm font-medium text-rose-600">{error}</p> : null}
        {message ? <p className="mt-5 text-sm font-medium text-emerald-700">{message}</p> : null}
        <div className="mt-6 flex justify-end"><Button type="submit" disabled={saving}><Save size={16} />{saving ? content.profile.saving : content.profile.save}</Button></div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><ShieldCheck size={19} /></div><div><p className="font-bold text-slate-950">Vault protected</p><p className="mt-1 text-xs text-slate-500">Your master password remains local.</p></div></div></Card>
        <Card className="p-6"><div className="flex items-center gap-3"><div className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><Globe2 size={19} /></div><div><p className="font-bold text-slate-950">{form.location || 'Location not set'}</p><p className="mt-1 text-xs text-slate-500">{form.website || 'Add a personal website to your profile.'}</p></div></div></Card>
      </div>
    </form>

    <Card className="p-6 sm:p-8"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><h2 className="text-lg font-bold text-slate-950">{content.profile.devicesTitle}</h2><p className="mt-1 text-sm text-slate-500">{content.profile.devicesDescription}</p></div><span className="text-xs font-semibold text-slate-400">{devices.length} device{devices.length === 1 ? '' : 's'}</span></div><div className="mt-5 space-y-3">{devices.length ? devices.map(device => <div key={device.id} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="grid size-10 place-items-center rounded-xl bg-white text-slate-600"><Laptop size={18} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{device.deviceName}{current?.deviceId === device.deviceId ? <span className="ml-2 rounded-full bg-indigo-50 px-2 py-1 text-[10px] font-bold text-indigo-600">{content.profile.currentDevice}</span> : null}</p><p className="mt-1 text-xs text-slate-500">{device.browser} · {device.os} · {new Date(device.lastSeenAt).toLocaleString()}</p></div><button type="button" onClick={() => removeDevice(device.id)} className="text-xs font-bold text-slate-400 hover:text-rose-600">{content.profile.revoke}</button></div>) : <p className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-sm text-slate-500">{content.profile.noDevices}</p>}</div></Card>

    <Card className="border-rose-100 p-6 sm:p-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="text-lg font-bold text-slate-950">{content.profile.dangerTitle}</h2><p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500">{content.profile.dangerDescription}</p></div><button type="button" onClick={deleteAccount} className="inline-flex w-fit items-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 hover:bg-rose-100"><Trash2 size={15} /> {content.profile.deleteAccount}</button></div></Card>
  </div>);
}
