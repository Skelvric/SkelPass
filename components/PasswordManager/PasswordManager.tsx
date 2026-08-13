'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, ShieldCheck, X } from 'lucide-react';

import { PasswordCard } from '@/components/PasswordCard/PasswordCard';
import { PasswordForm } from '@/components/PasswordForm/PasswordForm';
import { Toast } from '@/components/Toast/Toast';
import { VaultLock } from '@/components/VaultLock/VaultLock';
import { VaultSetup } from '@/components/VaultSetup/VaultSetup';
import { Button } from '@/components/Button/Button';
import { Card } from '@/components/Card/Card';

import { content } from '@/data/content';

import { decryptPasswordItem, encryptPasswordItem } from '@/lib/crypto/vault';
import { createClient } from '@/lib/supabase/client';

import type { PasswordItem, PasswordRecord, VaultMetadata } from '@/types/vault';

import styles from './PasswordManager.module.css';

export function PasswordManager({ user }: {
  user: {
    id: string;
    email?: string;
  };
}) {
  const supabase = useMemo(() => createClient(), []);
  const [vault, setVault] = useState<VaultMetadata | null>(null);
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [records, setRecords] = useState<(PasswordRecord & {
    item: PasswordItem;
  })[]>([]);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<PasswordItem | 'new' | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [copying, setCopying] = useState<string | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    supabase.from('vaultSettings').select('*').eq('userId', user.id).maybeSingle().then(({ data }) => {
      setVault(data as VaultMetadata | null);
      setLoading(false);
    });
  }, [supabase, user.id]);
  useEffect(() => {
    const handleLock = () => lock();
    const handleFocus = () => searchRef.current?.focus();
    const handleTopSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setQuery(customEvent.detail ?? '');
      searchRef.current?.focus();
    };
    window.addEventListener('skelpass-lock-vault', handleLock);
    window.addEventListener('skelpass-focus-search', handleFocus);
    window.addEventListener('skelpass-search-passwords', handleTopSearch);
    const handle = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        window.dispatchEvent(new CustomEvent('skelpass-focus-top-search'));
      }
      if (event.key === 'Escape')
        setModal(null);
    };
    window.addEventListener('keydown', handle);
    return () => {
      window.removeEventListener('keydown', handle);
      window.removeEventListener('skelpass-lock-vault', handleLock);
      window.removeEventListener('skelpass-focus-search', handleFocus);
      window.removeEventListener('skelpass-search-passwords', handleTopSearch);
    };
  }, []);
  useEffect(() => {
    if (!key) {
      setRecords([]);
      return;
    }
    let cancelled = false;
    async function loadItems() {
      if (!key) {
        setToast(content.common.unableDecrypt);
        return;
      }

      const { data, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('userId', user.id)
        .order('updatedAt', { ascending: false });

      if (error) {
        setToast(content.common.unableLoad);
        return;
      }

      const decrypted = [] as (PasswordRecord & {
        item: PasswordItem;
      })[];

      for (const record of (data ?? []) as PasswordRecord[]) {
        try {
          decrypted.push({
            ...record,
            item: {
              ...(await decryptPasswordItem(record, key)),
              id: record.id,
            },
          });
        } catch {
          setToast(content.common.unableDecrypt);
        }
      }

      if (!cancelled) {
        setRecords(decrypted);
      }
    }
    void loadItems();
    return () => { cancelled = true; };
  }, [key, supabase, user.id]);
  
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle)
      return records;
    return records.filter(({ item }) => [item.title, item.username, item.url].some(value => value.toLowerCase().includes(needle)));
  }, [query, records]);

  function lock() { setKey(null); setRecords([]); setQuery(''); }

  async function saveItem(item: PasswordItem) {
    if (!key)
      return;
    setSaving(true);
    try {
      const encrypted = await encryptPasswordItem(item, key);
      if (item.id) {
        const { error } = await supabase.from('passwords').update(encrypted).eq('id', item.id).eq('userId', user.id);
        if (error)
          throw error;
        setRecords(current => current.map(record => record.id === item.id ? { ...record, ...encrypted, item } : record));
      }
      else {
        const { data, error } = await supabase.from('passwords').insert({ userId: user.id, ...encrypted }).select().single();
        if (error)
          throw error;
        if (data)
          setRecords(current => [{ ...(data as PasswordRecord), item: { ...item, id: data.id } }, ...current]);
      }
      setModal(null);
      setToast(item.id ? content.common.passwordUpdated : content.common.passwordAdded);
    }
    catch {
      setToast(content.common.unableSave);
    }
    finally {
      setSaving(false);
    }
  }

  async function deleteItem(id: string) {
    if (!window.confirm(content.password.deleteConfirm))
      return;
    const { error } = await supabase.from('passwords').delete().eq('id', id).eq('userId', user.id);
    if (error) {
      setToast(content.common.unableDelete);
      return;
    }
    setRecords(current => current.filter(record => record.id !== id));
    setToast(content.common.passwordDeleted);
  }

  async function copy(value: string, id: string) {
    setCopying(id);
    try {
      await navigator.clipboard.writeText(value);
      setToast(content.password.copied);
    }
    catch {
      setToast(content.common.clipboardBlocked);
    }
    finally {
      setTimeout(() => setCopying(null), 600);
    }
  }
  if (loading)
    return <div className={styles.pageLoading}><div className="size-8 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" /></div>;
  if (!vault)
    return <VaultSetup userId={user.id} onCreated={(nextKey, nextVault) => { setVault(nextVault); setKey(nextKey); }} />;
  if (!key)
    return <VaultLock vault={vault} onUnlocked={setKey} />;
  const recent = [...records].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 3);
  const passwordCountLabel = records.length === 1 ? content.common.passwordOne : content.common.passwordMany;
  const lastUpdated = records[0]?.updatedAt ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(records[0].updatedAt)) : '—';
  const domains = new Set(records.map(({ item }) => {
    try {
      return item.url ? new URL(item.url).hostname.replace(/^www\./, '') : item.title;
    }
    catch {
      return item.title;
    }
  }));
  return <>
    <section id="overview" className="pt-8">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">{content.dashboard.overview}</p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">Everything in one place.</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{content.dashboard.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href="/profile" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">{content.dashboard.nav.profile}</a>
          <Button onClick={() => setModal('new')}><Plus size={16} />{content.dashboard.add}</Button>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="relative overflow-hidden p-5"><div className="absolute -right-8 -top-8 size-24 rounded-full bg-indigo-100/60 blur-2xl" /><p className="relative text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{content.dashboard.totalPasswords}</p><p className="relative mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950">{records.length}</p><p className="relative mt-1 text-xs text-slate-500">Saved {passwordCountLabel}</p></Card>
        <Card className="p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Unique sites</p><p className="mt-3 text-3xl font-black tracking-[-0.04em] text-slate-950">{domains.size}</p><p className="mt-1 text-xs text-slate-500">Domains represented in your vault</p></Card>
        <Card className="p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Last updated</p><p className="mt-3 text-xl font-black tracking-[-0.03em] text-slate-950">{lastUpdated}</p><p className="mt-1 text-xs text-slate-500">Most recent password change</p></Card>
        <Card className="p-5"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Vault status</p><div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700"><span className="size-1.5 rounded-full bg-emerald-500" />{content.dashboard.unlocked}</div><p className="mt-2 text-xs text-slate-500">Encryption key is active in memory.</p></Card>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.45fr_.75fr]">
        <Card className="p-6">
          <div className="flex items-center justify-between gap-4"><div><p className="text-sm font-bold text-slate-950">Recent activity</p><p className="mt-1 text-xs text-slate-500">The latest password records in your vault.</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-500">{recent.length} shown</span></div>
          <div className="mt-5 space-y-3">
            {recent.length ? recent.map(({ item }) => (<div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
              <div className="min-w-0"><p className="truncate text-sm font-bold text-slate-800">{item.title}</p><p className="mt-1 truncate text-xs text-slate-500">{item.username || item.url || 'Password entry'}</p></div>
              <button onClick={() => setQuery(item.title)} className="shrink-0 rounded-lg bg-white px-3 py-2 text-[11px] font-bold text-indigo-700 ring-1 ring-slate-200 hover:bg-indigo-50">Search</button>
            </div>)) : <p className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">No recent activity yet.</p>}
          </div>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-bold text-slate-950">Quick actions</p><p className="mt-1 text-xs text-slate-500">Common actions without leaving the dashboard.</p>
          <div className="mt-5 space-y-2">
            <button onClick={() => setModal('new')} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"><span>Add a password</span><Plus size={15} /></button>
            <a href="/profile" className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs font-bold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"><span>Update your profile</span><span>↗</span></a>
            <button onClick={lock} className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs font-bold text-slate-700 hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"><span>Lock vault</span><span>⌘</span></button>
          </div>
        </Card>
      </div>
    </section>

    <div id="passwords" className="mt-10 scroll-mt-24">
      <div className={styles.toolbar}><div><div className="flex items-center gap-2"><h2 className="text-2xl font-bold tracking-[-.04em] text-slate-950">{content.dashboard.title}</h2><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700"><ShieldCheck size={12} />{content.dashboard.unlocked}</span></div><p className="mt-1 text-sm text-slate-500">Search and manage your encrypted credentials.</p></div><Button onClick={() => setModal('new')}><Plus size={17} />{content.dashboard.add}</Button></div>
      <div className="mt-7 flex items-center gap-3"><div className={styles.search}><Search size={17} /><input ref={searchRef} value={query} onChange={e => setQuery(e.target.value)} placeholder={content.dashboard.searchPlaceholder} aria-label={content.dashboard.searchPlaceholder} />{query ? <button onClick={() => { setQuery(''); window.dispatchEvent(new CustomEvent('skelpass-clear-top-search')); }} aria-label={content.common.clearSearch}><X size={15} /></button> : <kbd>⌘ K</kbd>}</div><div className="hidden text-xs font-semibold text-slate-400 sm:block">{filtered.length} {filtered.length === 1 ? content.common.passwordOne : content.common.passwordMany}</div></div>
      <div className="mt-5 grid gap-3">{filtered.length ? filtered.map(({ item }) => <PasswordCard key={item.id} item={item} onEdit={() => setModal(item)} onDelete={() => deleteItem(item.id!)} onCopy={(value) => copy(value, item.id!)} copying={copying === item.id} />) : <Card className="px-6 py-16 text-center"><div className="mx-auto grid size-14 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><ShieldCheck size={23} /></div><h2 className="mt-5 text-xl font-bold text-slate-950">{query ? content.common.noPasswordsFound : content.dashboard.emptyTitle}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{query ? content.common.noSearchResults : content.dashboard.emptyDescription}</p>{!query ? <Button className="mt-6" onClick={() => setModal('new')}><Plus size={16} />{content.dashboard.add}</Button> : null}</Card>}</div>
    </div>
    {modal ? <div className={styles.overlay} role="dialog" aria-modal="true"><div className={styles.modal}><div className="flex items-center justify-between"><h2 className="text-xl font-bold tracking-[-.03em] text-slate-950">{modal === 'new' ? content.password.newTitle : content.password.editTitle}</h2><button className="grid size-9 place-items-center rounded-full hover:bg-slate-100" onClick={() => setModal(null)} aria-label="Close"><X size={18} /></button></div><div className="mt-6"><PasswordForm initial={modal === 'new' ? undefined : modal} onSave={saveItem} onCancel={() => setModal(null)} saving={saving} /></div></div></div> : null}
    {toast ? <Toast message={toast} onClose={() => setToast('')} /> : null}
  </>;
}
