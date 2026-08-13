import Link from 'next/link';

import { ArrowRight, Check, ShieldCheck, KeyRound, Search } from 'lucide-react';

import { Container } from '@/components/Container/Container';

import { content } from '@/data/content';

import styles from './Hero.module.css';

export function Hero() {
  return (<section className="relative overflow-hidden bg-white py-16 sm:py-24 lg:py-28">
    <div className={styles.glowOne} />
    <div className={styles.glowTwo} />
    <div className="relative z-10">
      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-[.9fr_1.1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              <ShieldCheck size={14} /> {content.hero.badge}
            </div>
            <h1 className="mt-7 whitespace-pre-line text-5xl font-black leading-[.98] tracking-[-0.06em] text-slate-950 sm:text-6xl lg:text-[76px]">{content.hero.title}</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">{content.hero.description}</p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/register" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700">{content.hero.primaryCta}<ArrowRight size={16} /></Link>
              <a href="#Features" className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300">{content.hero.secondaryCta}</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              {['Encrypted in browser', 'Supabase RLS', 'No password analytics'].map((item) => (<span key={item} className="inline-flex items-center gap-2"><Check size={15} className="text-emerald-600" /> {item}</span>))}
            </div>
          </div>
          <div className="relative">
            <div className={`${styles.dashboard} shell-grid`}>
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
                <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><KeyRound size={19} /></span><div><div className="text-xs font-medium text-slate-500">SkelPass</div><div className="text-sm font-bold text-slate-900">Password vault</div></div></div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Unlocked</span>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><Search size={17} className="text-slate-400" /><span className="text-sm text-slate-400">Search passwords...</span><kbd className="ml-auto rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">⌘ K</kbd></div>
                <div className="mt-5 grid gap-3">
                  {[['GitHub', 'github.com', 'shermsql@skelvric.com'], ['Linear', 'linear.app', 'hello@skelvric.com'], ['Vercel', 'vercel.com', 'shermsql@skelvric.com']].map(([name, domain, user], i) => (<div key={name} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm"><div className={`grid size-11 place-items-center rounded-2xl ${i === 1 ? 'bg-violet-50 text-violet-700' : 'bg-indigo-50 text-indigo-700'} font-bold`}>{name.slice(0, 1)}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900">{name}</p><p className="truncate text-xs text-slate-500">{domain} · {user}</p></div><div className="flex -space-x-1"><span className="size-1.5 rounded-full bg-slate-400" /><span className="size-1.5 rounded-full bg-slate-400" /><span className="size-1.5 rounded-full bg-slate-400" /><span className="size-1.5 rounded-full bg-slate-400" /></div></div>))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  </section>);
}
