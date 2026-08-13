'use client';

import { useEffect, useState } from 'react';

import { Lock, Menu, Search, X } from 'lucide-react';

import { content } from '@/data/content';

import styles from './Topbar.module.css';

export function Topbar({ onLock, onMenu }: {
  onLock: () => void;
  onMenu: () => void;
}) {
  const [query, setQuery] = useState('');
  useEffect(() => {
    const handleClear = () => setQuery('');
    const handleFocus = () => document.getElementById('dashboard-top-search')?.focus();
    window.addEventListener('skelpass-clear-top-search', handleClear);
    window.addEventListener('skelpass-focus-top-search', handleFocus);
    return () => {
      window.removeEventListener('skelpass-clear-top-search', handleClear);
      window.removeEventListener('skelpass-focus-top-search', handleFocus);
    };
  }, []);
  function updateQuery(value: string) {
    setQuery(value);
    window.dispatchEvent(new CustomEvent('skelpass-search-passwords', { detail: value }));
  }
  return (<header className={styles.topbar}>
    <button className={styles.mobileMenu} onClick={onMenu} aria-label={content.dashboard.mobileMenu}>
      <Menu size={19} />
    </button>
    <div className={styles.searchWrap}>
      <Search size={17} />
      <input id="dashboard-top-search" value={query} onChange={(e) => updateQuery(e.target.value)} placeholder={content.dashboard.searchPlaceholder} aria-label={content.dashboard.searchPlaceholder} />
      {query ? (<button className={styles.clearSearch} onClick={() => updateQuery('')} aria-label={content.common.clearSearch}>
        <X size={15} />
      </button>) : (<kbd>⌘ K</kbd>)}
    </div>
    <button className={styles.lock} onClick={onLock}>
      <Lock size={16} />
      {content.dashboard.lock}
    </button>
  </header>);
}
