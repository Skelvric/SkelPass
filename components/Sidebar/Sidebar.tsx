'use client';

import Link from 'next/link';

import { KeyRound, LayoutDashboard, LockKeyhole, LogOut, UserRound } from 'lucide-react';

import { Brand } from '@/components/Brand/Brand';

import { content } from '@/data/content';

import styles from './Sidebar.module.css';

export function Sidebar({ userEmail, onLogout, onLock }: {
  userEmail: string;
  onLogout: () => Promise<void>;
  onLock: () => void;
}) {
  return (<aside className={styles.sidebar}>
    <div className="flex h-full flex-col p-5">
      <div className="px-2 py-2"><Brand /></div>
      <div className="mt-10 px-2"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">{content.dashboard.nav.vault}</p></div>
      <nav className="mt-3 space-y-1">
        <Link href="/dashboard#overview" className={styles.navItemActive}><LayoutDashboard size={17} />{content.dashboard.nav.overview}</Link>
        <Link href="/dashboard#passwords" className={styles.navItem}><KeyRound size={17} />{content.dashboard.nav.allPasswords}</Link>
      </nav>
      <div className="mt-6 px-2"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Account</p></div>
      <nav className="mt-3 space-y-1">
        <Link href="/profile" className={styles.navItem}><UserRound size={17} />{content.dashboard.nav.profile}</Link>
      </nav>
      <div className="mt-auto rounded-2xl border border-slate-100 bg-slate-50 p-3">
        <p className="truncate text-xs font-semibold text-slate-700">{userEmail}</p>
        <p className="mt-1 text-[11px] text-slate-400">{content.dashboard.secureAccount}</p>
        <div className="mt-3 grid grid-cols-2 gap-2"><button className={styles.smallButton} onClick={onLock}><LockKeyhole size={14} /> {content.dashboard.lock}</button><button className={styles.smallButton} onClick={onLogout}><LogOut size={14} /> {content.dashboard.logout}</button></div>
      </div>
    </div>
  </aside>);
}
