import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')                   // Normalize to decomposed form
    .replace(/[\u0300-\u036f]/g, '')    // Remove accent marks
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/đ/g, 'd')                 // Vietnamese
    .replace(/ß/g, 'ss')                // German
    .replace(/æ/g, 'ae')                // Danish, Norwegian...
    .replace(/ø/g, 'o')                 // Scandinavian
    .replace(/å/g, 'a')                 // Scandinavian
    .replace(/ł/g, 'l')                 // Polish
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}
