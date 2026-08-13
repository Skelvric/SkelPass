import Link from 'next/link';

import styles from './Brand.module.css';

export function Brand({ light = false }: {
  light?: boolean;
}) {
  return (<Link href="/" className={`${styles.brand} ${light ? styles.light : ''}`} aria-label="SkelPass home">
    <span className={styles.mark}><span /></span>
    <span>SkelPass</span>
  </Link>);
}
