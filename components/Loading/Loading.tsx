'use client';

import { useEffect, useState } from 'react';

import styles from './Loading.module.css';

export function Loading() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(false);
    }, 2500);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div className={styles.loader}>
      <div className={styles.spinner} />
    </div>
  );
}
