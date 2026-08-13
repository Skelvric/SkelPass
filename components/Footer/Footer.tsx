import { ArrowUpRight, Github, Instagram, Linkedin, } from 'lucide-react';

import { Brand } from '@/components/Brand/Brand';
import { Container } from '@/components/Container/Container';

import { content } from '@/data/content';

const contactIcons = {
  github: Github,
  linkedin: Linkedin,
  instagram: Instagram,
} as const;

export function Footer() {
  return (<footer className="border-t border-slate-200/80 bg-white">
    <Container className="py-16 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr] lg:gap-20">
        <div className="max-w-sm">
          <Brand />
          <p className="mt-5 text-sm leading-7 text-slate-500">
            {content.footer.description}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-700">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-violet-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-violet-600" />
            </span>
            {content.footer.status}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-950">
            {content.footer.navigationTitle}
          </h2>

          <nav className="mt-5 flex flex-col items-start gap-3" aria-label="Footer navigation">
            <a href="#Top" className="text-sm text-slate-500 transition-colors hover:text-violet-700">
              {content.footer.navigation.home}
            </a>
            <a href="#Features" className="text-sm text-slate-500 transition-colors hover:text-violet-700">
              {content.footer.navigation.features}
            </a>
            <a href="#How-It-Works" className="text-sm text-slate-500 transition-colors hover:text-violet-700">
              {content.footer.navigation.howItWorks}
            </a>
            <a href="#Security" className="text-sm text-slate-500 transition-colors hover:text-violet-700">
              {content.footer.navigation.security}
            </a>
            <a href="#FAQ" className="text-sm text-slate-500 transition-colors hover:text-violet-700">
              {content.footer.navigation.faq}
            </a>
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-950">
            {content.footer.contactTitle}
          </h2>

          <div className="mt-5 flex flex-col gap-3">
            {content.footer.contact.links.map((link) => {
              const Icon = contactIcons[link.icon];
              return (<a key={link.label} href={link.href} target={link.external ? '_blank' : undefined} rel={link.external ? 'noreferrer' : undefined} className="group inline-flex w-fit items-center gap-3 text-sm text-slate-500 transition-colors hover:text-violet-700">
                <span className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-500 transition-colors group-hover:border-violet-200 group-hover:bg-violet-50 group-hover:text-violet-700">
                  <Icon size={15} />
                </span>
                <span>{link.label}</span>
                {link.external && (<ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />)}
              </a>);
            })}
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col gap-4 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {content.footer.copyright}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {content.footer.tagline}
          </p>
        </div>

        <a href="#Top" className="inline-flex w-fit items-center rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">
          {content.footer.backToTop}
        </a>
      </div>
    </Container>
  </footer>);
}
