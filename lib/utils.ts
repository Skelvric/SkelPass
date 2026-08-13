import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function hostnameFromUrl(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  }
  catch {
    return url.replace(/^https?:\/\//, '').split('/')[0] || 'website';
  }
}
