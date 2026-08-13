'use client';

import { Copy, ExternalLink, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { hostnameFromUrl } from '@/lib/utils';

import { content } from '@/data/content';

import type { PasswordItem } from '@/types/vault';

import styles from './PasswordCard.module.css';

export function PasswordCard({ item, onEdit, onDelete, onCopy, copying }: {
  item: PasswordItem;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: (value: string) => Promise<void>;
  copying: boolean;
}) {
  const [menu, setMenu] = useState(false);
  const domain = hostnameFromUrl(item.url);
  const initial = item.title.trim().slice(0, 1).toUpperCase() || 'P';
  return (<div className={styles.card}>
    <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 text-base font-extrabold text-indigo-700">{initial}</div>
    <div className="min-w-0 flex-1"><p className="truncate font-bold text-slate-900">{item.title}</p><p className="mt-1 truncate text-xs text-slate-500">{domain} · {item.username || 'No username'}</p></div>
    <button className={styles.copy} disabled={copying} onClick={() => onCopy(item.password)} aria-label={`${content.password.copy} ${item.title}`}>{copying ? '…' : <Copy size={17} />}</button>
    <button className={styles.more} onClick={() => setMenu(v => !v)} aria-label="More actions"><MoreHorizontal size={19} /></button>
    {menu ? <div className={styles.menu}>
      <button onClick={() => { setMenu(false); onEdit(); }}><Pencil size={15} /> {content.common.edit}</button>
      {item.url ? <a href={item.url} target="_blank" rel="noreferrer" onClick={() => setMenu(false)}><ExternalLink size={15} /> {content.common.openWebsite}</a> : null}
      <button onClick={() => { setMenu(false); onDelete(); }} className="!text-rose-600"><Trash2 size={15} /> {content.password.delete}</button>
    </div> : null}
  </div>);
}
