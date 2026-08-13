import Link from 'next/link';

import { ArrowRight, Check, Download, Github, Instagram, Linkedin, LockKeyhole, Monitor, Search, ShieldCheck, Sparkles, Zap, } from 'lucide-react';

import { Loading } from "@/components/Loading/Loading";

import { Container } from '@/components/Container/Container';
import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { Hero } from '@/components/Hero/Hero';
import { FeatureCard } from '@/components/FeatureCard/FeatureCard';
import { TrustedLogos } from '@/components/TrustedLogos/TrustedLogos';

import { content } from '@/data/content';

export default function MarketingPage() {
  return (
    <main id="Top" className="min-h-screen overflow-x-hidden bg-white">
      <Loading />
      <Header />
      <Hero />
      <TrustedLogos />

      <section id="Features" className="py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">{content.features.eyebrow}</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl">{content.features.title}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{content.features.description}</p>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {content.features.items.map((item) => (<FeatureCard key={item.title} title={item.title} description={item.description} icon={item.icon} />))}
          </div>
        </Container>
      </section>

      <section id="How-It-Works" className="border-y border-slate-100 bg-slate-50/70 py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.75fr_1.25fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">{content.howItWorks.eyebrow}</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl">{content.howItWorks.title}</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">{content.howItWorks.description}</p>
              <Link href="/register" className="focus-ring mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition hover:-translate-y-0.5 hover:bg-indigo-700">
                {content.howItWorks.cta}
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid gap-4">
              {content.howItWorks.steps.map((step, index) => (<div key={step.title} className="group grid gap-5 rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_16px_50px_rgba(15,23,42,.04)] sm:grid-cols-[72px_1fr] sm:p-7">
                <div className="grid size-14 place-items-center rounded-2xl bg-indigo-50 text-sm font-black text-indigo-700 transition group-hover:bg-indigo-600 group-hover:text-white">
                  0{index + 1}
                </div>
                <div>
                  <p className="text-xl font-bold tracking-[-0.025em] text-slate-950">{step.title}</p>
                  <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">{step.description}</p>
                </div>
              </div>))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-indigo-100/80 bg-[#f7f6ff] py-24 sm:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_.9fr]">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
                <Monitor size={14} />
                {content.desktop.eyebrow}
              </div>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl">{content.desktop.title}</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">{content.desktop.description}</p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {content.desktop.points.map((point) => (<div key={point} className="flex items-start gap-3 rounded-2xl border border-white bg-white/85 p-4 shadow-sm">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <ShieldCheck size={15} />
                  </span>
                  <span className="text-sm font-medium leading-6 text-slate-700">{point}</span>
                </div>))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="/downloads/SkelPass-Setup.exe" download className="focus-ring inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700">
                  <Download size={16} />
                  {content.desktop.cta}
                </a>
                <span className="text-xs font-medium text-slate-500">{content.desktop.versionNote}</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-8 rounded-[40px] bg-indigo-200/30 blur-3xl" />
              <div className="relative overflow-hidden rounded-[30px] border border-indigo-100 bg-white shadow-[0_30px_90px_rgba(79,70,229,.14)]">
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-5 py-4">
                  <span className="size-2.5 rounded-full bg-slate-300" />
                  <span className="size-2.5 rounded-full bg-slate-300" />
                  <span className="size-2.5 rounded-full bg-slate-300" />
                  <span className="ml-3 text-xs font-semibold text-slate-500">SkelPass for Windows</span>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-slate-500">Secure vault</p>
                        <p className="mt-1 text-lg font-bold text-slate-950">Ready to protect your passwords</p>
                      </div>
                      <div className="grid size-11 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                        <LockKeyhole size={19} />
                      </div>
                    </div>
                    <div className="mt-5 h-2 rounded-full bg-slate-200">
                      <div className="h-2 w-[78%] rounded-full bg-gradient-to-r from-indigo-600 to-violet-500" />
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500">
                      <span>Encrypted locally</span>
                      <span>78% secure setup</span>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {[['Quick search', Zap], ['One-click copy', Sparkles]].map(([label, Icon]) => {
                      const IconComponent = Icon as typeof Zap;
                      return (<div key={label as string} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="grid size-9 place-items-center rounded-xl bg-indigo-50 text-indigo-600"><IconComponent size={16} /></div>
                        <p className="mt-3 text-sm font-semibold text-slate-800">{label as string}</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">{content.desktop.miniCopy}</p>
                      </div>);
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="Security" className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">{content.security.eyebrow}</p>
              <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl">{content.security.title}</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">{content.security.description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.security.points.map((point, index) => (<div key={point} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(15,23,42,.05)]">
                <div className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600 text-sm font-bold">0{index + 1}</div>
                <p className="mt-5 text-sm font-semibold leading-6 text-slate-800">{point}</p>
              </div>))}
            </div>
          </div>
        </Container>
      </section>

      <section id="FAQ" className="border-y border-slate-100 bg-slate-50/60 py-24 sm:py-32">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-600">{content.faq.eyebrow}</p>
            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] text-slate-950 sm:text-5xl">{content.faq.title}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">{content.faq.description}</p>
          </div>
          <div className="mx-auto mt-12 max-w-4xl space-y-3">
            {content.faq.items.map((item) => (<details key={item.question} className="group rounded-2xl border border-slate-200 bg-white px-6 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-sm font-semibold text-slate-900 [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-indigo-50 text-indigo-700 transition group-open:rotate-45">+</span>
              </summary>
              <p className="max-w-3xl pb-6 pr-12 text-sm leading-7 text-slate-600">{item.answer}</p>
            </details>))}
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-32">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#4f46e5] via-[#6544d8] to-[#7c3aed] px-8 py-12 text-white shadow-[0_32px_100px_rgba(79,70,229,.22)] sm:px-10 sm:py-14">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="relative">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/70">{content.cta.eyebrow}</p>
                <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-[-0.045em] sm:text-5xl">{content.cta.title}</h2>
                <p className="mt-5 max-w-xl text-base leading-7 text-white/80">{content.cta.description}</p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link href="/register" className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-50">
                    {content.hero.primaryCta}<ArrowRight size={16} />
                  </Link>
                  <a href="/downloads/SkelPass-Setup.exe" download className="focus-ring inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/15">
                    <Download size={16} />
                    {content.desktop.ctaShort}
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,.05)] sm:p-10">
              <div className="grid size-12 place-items-center rounded-2xl bg-indigo-50 text-indigo-600"><ShieldCheck size={20} /></div>
              <h3 className="mt-6 text-2xl font-bold tracking-[-0.03em] text-slate-950">{content.finalProof.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-600">{content.finalProof.description}</p>
              <div className="mt-7 space-y-3">
                {content.finalProof.items.map((item) => (<div key={item} className="flex items-start gap-3 text-sm font-medium text-slate-700">
                  <Check size={16} className="mt-0.5 shrink-0 text-emerald-600" />
                  {item}
                </div>))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </main>);
}
