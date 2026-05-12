export type GarmentId =
  | 'shirt'
  | 'kurta'
  | 'sherwani'
  | 'nehru-coat'
  | 'blazer'
  | 'lehenga'
  | 'kurti'
  | 'anarkali'
  | 'salwar-kameez'
  | 'saree';

export type Gender = 'male' | 'female';

export interface Garment {
  id: GarmentId;
  label: string;
  gender: Gender;
  floatSrc: string;
  compositeSrc: string;
  placeholderColor: string;
}

// Replace .svg with .png once real assets are in public/garments/ and public/models/
export const GARMENTS: Garment[] = [
  {
    id: 'shirt',
    label: 'Shirt',
    gender: 'male',
    floatSrc: '/garments/shirt.svg',
    compositeSrc: '/models/male-shirt.svg',
    placeholderColor: '#dbeafe',
  },
  {
    id: 'kurta',
    label: 'Kurta',
    gender: 'male',
    floatSrc: '/garments/kurta.svg',
    compositeSrc: '/models/male-kurta.svg',
    placeholderColor: '#fef3c7',
  },
  {
    id: 'sherwani',
    label: 'Sherwani',
    gender: 'male',
    floatSrc: '/garments/sherwani.svg',
    compositeSrc: '/models/male-sherwani.svg',
    placeholderColor: '#ede9fe',
  },
  {
    id: 'nehru-coat',
    label: 'Nehru Coat',
    gender: 'male',
    floatSrc: '/garments/nehru-coat.svg',
    compositeSrc: '/models/male-nehru-coat.svg',
    placeholderColor: '#d1fae5',
  },
  {
    id: 'blazer',
    label: 'Blazer',
    gender: 'male',
    floatSrc: '/garments/blazer.svg',
    compositeSrc: '/models/male-blazer.svg',
    placeholderColor: '#fee2e2',
  },
  {
    id: 'lehenga',
    label: 'Lehenga',
    gender: 'female',
    floatSrc: '/garments/lehenga.svg',
    compositeSrc: '/models/female-lehenga.svg',
    placeholderColor: '#fce7f3',
  },
  {
    id: 'kurti',
    label: 'Kurti',
    gender: 'female',
    floatSrc: '/garments/kurti.svg',
    compositeSrc: '/models/female-kurti.svg',
    placeholderColor: '#ffedd5',
  },
  {
    id: 'anarkali',
    label: 'Anarkali',
    gender: 'female',
    floatSrc: '/garments/anarkali.svg',
    compositeSrc: '/models/female-anarkali.svg',
    placeholderColor: '#f0fdf4',
  },
  {
    id: 'salwar-kameez',
    label: 'Salwar Kameez',
    gender: 'female',
    floatSrc: '/garments/salwar-kameez.svg',
    compositeSrc: '/models/female-salwar-kameez.svg',
    placeholderColor: '#fffbeb',
  },
  {
    id: 'saree',
    label: 'Saree',
    gender: 'female',
    floatSrc: '/garments/saree.svg',
    compositeSrc: '/models/female-saree.svg',
    placeholderColor: '#fdf4ff',
  },
];

// Fixed positions and animation params for each garment in the hero (% of viewport)
export const GARMENT_LAYOUT: Record<
  GarmentId,
  { x: number; y: number; rotation: number; floatDuration: number }
> = {
  shirt:          { x: 40, y: 8,  rotation: -8,  floatDuration: 3.8 },
  kurta:          { x: 22, y: 18, rotation: 10,  floatDuration: 4.2 },
  sherwani:       { x: 55, y: 38, rotation: -5,  floatDuration: 3.3 },
  'nehru-coat':   { x: 16, y: 52, rotation: 12,  floatDuration: 4.7 },
  blazer:         { x: 36, y: 70, rotation: -10, floatDuration: 3.6 },
  lehenga:        { x: 62, y: 10, rotation: 8,   floatDuration: 4.1 },
  kurti:          { x: 78, y: 22, rotation: -12, floatDuration: 3.5 },
  anarkali:       { x: 48, y: 28, rotation: 6,   floatDuration: 4.4 },
  'salwar-kameez':{ x: 70, y: 62, rotation: -7,  floatDuration: 3.9 },
  saree:          { x: 56, y: 75, rotation: 9,   floatDuration: 4.6 },
};

export const BASE_MODELS: Record<Gender, string> = {
  male: '/models/male-base.svg',
  female: '/models/female-base.svg',
};
