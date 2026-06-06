import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale: string = 'en'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function bloodTypeCompat(patientBlood: string, donorBlood: string): boolean {
  const patient = patientBlood.toUpperCase();
  const donor = donorBlood.toUpperCase();

  const rules: Record<string, string[]> = {
    'AB+': ['O-', 'O+', 'B-', 'B+', 'A-', 'A+', 'AB-', 'AB+'],
    'AB-': ['O-', 'B-', 'A-', 'AB-'],
    'A+': ['O-', 'O+', 'A-', 'A+'],
    'A-': ['O-', 'A-'],
    'B+': ['O-', 'O+', 'B-', 'B+'],
    'B-': ['O-', 'B-'],
    'O+': ['O-', 'O+'],
    'O-': ['O-']
  };

  return rules[patient]?.includes(donor) || false;
}
