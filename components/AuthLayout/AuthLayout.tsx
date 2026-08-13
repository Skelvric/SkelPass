import Link from 'next/link';

import { Container } from '@/components/Container/Container';
import { content } from '@/data/content';

import styles from './AuthLayout.module.css';

export function AuthLayout({ title, description, children, footer }: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (<main className={styles.page}>
    <div className={styles.shapeOne} /><div className={styles.shapeTwo} />
    <Container className="relative z-10 py-8"><Link href="/" className="text-xs font-semibold text-slate-400 hover:text-slate-700">{content.common.backToHome}</Link></Container>
    <div className="relative z-10 grid min-h-[calc(100vh-96px)] place-items-center px-5 pb-14">
      <div className="w-full max-w-md">
        <div className="mb-7"><h1 className="mt-6 text-4xl font-bold tracking-[-.05em] text-slate-950">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p></div>
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_28px_90px_rgba(34,31,80,.10)] sm:p-8">{children}</div>
        <div className="mt-5 text-center text-sm text-slate-500">{footer}</div>
      </div>
    </div>
  </main>);
}
