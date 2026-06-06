export type GarmentId =
  | 'shirt'
  | 'kurta'
  | 'sherwani'
  | 'nehru-coat'
  | 'blazer'
  | 'casual-dress'
  | 'jumpsuit'
  | 'anarkali'
  | 'saree'
  | 'lehenga';

export type Gender = 'male' | 'female';

export interface Garment {
  id: GarmentId;
  label: string;
  gender: Gender;
  floatSrc: string;
  compositeSrc: string;
  placeholderColor: string;
}

export const GARMENTS: Garment[] = [
  // Male (5)
  {
    id: 'shirt',
    label: 'Shirt',
    gender: 'male',
    floatSrc: '/garments/shirt.webp',
    compositeSrc: '/models/male-shirt.webp',
    placeholderColor: '#dbeafe',
  },
  {
    id: 'kurta',
    label: 'Kurta',
    gender: 'male',
    floatSrc: '/garments/kurta.webp',
    compositeSrc: '/models/male-kurta.webp',
    placeholderColor: '#fef3c7',
  },
  {
    id: 'sherwani',
    label: 'Sherwani',
    gender: 'male',
    floatSrc: '/garments/sherwani.webp',
    compositeSrc: '/models/male-sherwani.webp',
    placeholderColor: '#ede9fe',
  },
  {
    id: 'nehru-coat',
    label: 'Nehru Coat',
    gender: 'male',
    floatSrc: '/garments/nehru-coat.webp',
    compositeSrc: '/models/male-nehru-coat.webp',
    placeholderColor: '#d1fae5',
  },
  {
    id: 'blazer',
    label: 'Blazer',
    gender: 'male',
    floatSrc: '/garments/blazer.webp',
    compositeSrc: '/models/male-blazer.webp',
    placeholderColor: '#fee2e2',
  },
  // Female (5)
  {
    id: 'casual-dress',
    label: 'Casual Dress',
    gender: 'female',
    floatSrc: '/garments/casual-dress.webp',
    compositeSrc: '/models/female-casual-dress.webp',
    placeholderColor: '#fce7f3',
  },
  {
    id: 'jumpsuit',
    label: 'Jumpsuit',
    gender: 'female',
    floatSrc: '/garments/jumpsuit.webp',
    compositeSrc: '/models/female-jumpsuit.webp',
    placeholderColor: '#ffedd5',
  },
  {
    id: 'anarkali',
    label: 'Anarkali',
    gender: 'female',
    floatSrc: '/garments/anarkali.webp',
    compositeSrc: '/models/female-anarkali.webp',
    placeholderColor: '#f0fdf4',
  },
  {
    id: 'saree',
    label: 'Saree',
    gender: 'female',
    floatSrc: '/garments/saree.webp',
    compositeSrc: '/models/female-saree.webp',
    placeholderColor: '#fdf4ff',
  },
  {
    id: 'lehenga',
    label: 'Lehenga',
    gender: 'female',
    floatSrc: '/garments/lehenga.webp',
    compositeSrc: '/models/female-lehenga.webp',
    placeholderColor: '#ffe4e6',
  },
];

// Fixed positions and animation params for each garment in the hero (% of viewport)
// Male garments: far left (x: 5–28%), clear of male model body
// Female garments: middle gap (x: 38–58%), clear of center text and the woman on the right
export const GARMENT_LAYOUT: Record<
  GarmentId,
  { x: number; y: number; rotation: number; floatDuration: number }
> = {
  // Male — 1 above model, 4 zig-zag on left edge (x=2 / x=10)
  shirt:          { x: 18, y: 6,  rotation: -8,  floatDuration: 3.8 },  // above male model
  kurta:          { x: 2,  y: 24, rotation: 10,  floatDuration: 4.2 },
  sherwani:       { x: 10, y: 40, rotation: -5,  floatDuration: 3.3 },
  'nehru-coat':   { x: 2,  y: 57, rotation: 12,  floatDuration: 4.7 },
  blazer:         { x: 10, y: 74, rotation: -10, floatDuration: 3.6 },
  // Female — 1 above model, 4 zig-zag on right edge
  'casual-dress': { x: 72, y: 6,  rotation: 8,   floatDuration: 4.1 },  // above female model
  jumpsuit:       { x: 86, y: 24, rotation: -12, floatDuration: 3.5 },
  anarkali:       { x: 78, y: 40, rotation: 6,   floatDuration: 4.4 },
  saree:          { x: 86, y: 57, rotation: -7,  floatDuration: 3.9 },
  lehenga:        { x: 78, y: 74, rotation: 9,   floatDuration: 4.6 },
};

export const BASE_MODELS: Record<Gender, string> = {
  male: '/models/male-base.webp',
  female: '/models/female-base.webp',
};
