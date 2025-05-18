export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  tags: string[];
  description: string;
  experience: string[];
  demographic: string[];
}

export type ThemeMode = 'light' | 'dark';
