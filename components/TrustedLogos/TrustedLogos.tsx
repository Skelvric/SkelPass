import { Container } from '@/components/Container/Container';

import { content } from '@/data/content';

export function TrustedLogos() {
  return (<section className="border-y border-slate-100 bg-white py-8">
    <Container>
      <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{content.trusted.label}</p>
        <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-sm font-semibold text-slate-400">
          {content.trusted.items.map(item => <span key={item}>{item}</span>)}
        </div>
      </div>
    </Container>
  </section>);
}
