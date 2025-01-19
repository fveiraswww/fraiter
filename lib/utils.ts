import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseEnumToArray = <T extends object>(_enum: T) => {
  return Object.values(_enum) as string[];
};
