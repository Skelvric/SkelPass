'use client';

import { useState } from 'react';

import { Sidebar } from '@/components/Sidebar/Sidebar';
import { Topbar } from '@/components/Topbar/Topbar';

import { createClient } from '@/lib/supabase/client';

import { content } from '@/data/content';

import styles from './DashboardShell.module.css';

export function DashboardShell({ userEmail, children }: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.replace('/login');
  }
  function lock() { window.dispatchEvent(new CustomEvent('skelpass-lock-vault')); }
  return <div className={styles.shell}><Sidebar userEmail={userEmail} onLogout={logout} onLock={lock} />{mobileOpen ? <div className={styles.mobilePanel}><div className="rounded-2xl bg-white p-3"><div className="flex items-center justify-between p-2"><span className="font-bold text-slate-900">{content.common.logo}</span><button onClick={() => setMobileOpen(false)} aria-label={content.dashboard.closeMenu}>×</button></div><div className="mt-3 space-y-1"><button className={styles.mobileNav} onClick={() => setMobileOpen(false)}>{content.dashboard.nav.allPasswords}</button><a href="/profile" className={styles.mobileNav} onClick={() => setMobileOpen(false)}>{content.dashboard.nav.profile}</a><button className={styles.mobileNav} onClick={() => { setMobileOpen(false); lock(); }}>{content.dashboard.lock}</button><button className={styles.mobileNav} onClick={logout}>{content.dashboard.logout}</button></div></div></div> : null}<div className={styles.main}><Topbar onLock={lock} onMenu={() => setMobileOpen(true)} /><main className="mx-auto w-full max-w-[1240px] px-5 pb-12 sm:px-7 lg:px-9">{children}</main></div></div>;
}
