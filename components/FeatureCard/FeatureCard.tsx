import { Copy, LockKeyhole, Search, Sparkles } from 'lucide-react';

import { Card } from '@/components/Card/Card';

import styles from './FeatureCard.module.css';

const icons = { search: Search, lock: LockKeyhole, copy: Copy, sparkles: Sparkles };

export function FeatureCard({ title, description, icon }: {
  title: string;
  description: string;
  icon: keyof typeof icons;
}) {
  const Icon = icons[icon];
  return (<Card className="p-6 sm:p-7">
    <div className={styles.icon}><Icon size={20} /></div>
    <h3 className="mt-6 text-xl font-bold tracking-[-.03em] text-slate-950">{title}</h3>
    <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
  </Card>);
}
