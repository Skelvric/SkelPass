import Link from 'next/link';

import { ArrowUpRight } from 'lucide-react';

import { Brand } from '@/components/Brand/Brand';
import { Container } from '@/components/Container/Container';

import { content } from '@/data/content';

import styles from './Header.module.css';

export function Header() {
  return (<header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-xl">
    <Container className="flex h-[72px] items-center justify-between gap-6">
      <Brand />

      <nav className="hidden items-center gap-1 rounded-full border border-slate-200 bg-slate-50/80 p-1 md:flex" aria-label="Primary navigation">
        <a className={styles.navItem} href="#Features">{content.nav.features}</a>
        <a className={styles.navItem} href="#How-It-Works">{content.nav.howItWorks}</a>
        <a className={styles.navItem} href="#Security">{content.nav.security}</a>
        <a className={styles.navItem} href="#FAQ">{content.nav.faq}</a>
      </nav>

      <div className="flex items-center gap-4">
        <Link href="/login" className={`${styles.loginLink} hidden sm:inline-flex`}>{content.nav.login}</Link>
        <Link href="/register" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-[#6544d8] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(101,68,216,0.20)] transition hover:-translate-y-0.5 hover:bg-[#5636c7]">
          {content.nav.getStarted}
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </Container>
  </header>);
}
