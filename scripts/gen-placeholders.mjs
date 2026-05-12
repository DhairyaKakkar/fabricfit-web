import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public');

const garments = [
  { id: 'shirt', label: 'Shirt', gender: 'male', color: '#93c5fd', bg: '#dbeafe' },
  { id: 'kurta', label: 'Kurta', gender: 'male', color: '#fbbf24', bg: '#fef3c7' },
  { id: 'sherwani', label: 'Sherwani', gender: 'male', color: '#a78bfa', bg: '#ede9fe' },
  { id: 'nehru-coat', label: 'Nehru Coat', gender: 'male', color: '#34d399', bg: '#d1fae5' },
  { id: 'blazer', label: 'Blazer', gender: 'male', color: '#f87171', bg: '#fee2e2' },
  { id: 'lehenga', label: 'Lehenga', gender: 'female', color: '#f472b6', bg: '#fce7f3' },
  { id: 'kurti', label: 'Kurti', gender: 'female', color: '#fb923c', bg: '#ffedd5' },
  { id: 'anarkali', label: 'Anarkali', gender: 'female', color: '#4ade80', bg: '#f0fdf4' },
  { id: 'salwar-kameez', label: 'Salwar', gender: 'female', color: '#fcd34d', bg: '#fffbeb' },
  { id: 'saree', label: 'Saree', gender: 'female', color: '#c084fc', bg: '#fdf4ff' },
];

function garmentSVG(label, color, bg, w, h) {
  const fontSize = w < 150 ? 14 : 20;
  const subSize = w < 150 ? 10 : 14;
  const iconSize = w < 150 ? 28 : 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}" rx="12"/>
  <rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="none" stroke="${color}" stroke-width="2" rx="10" stroke-dasharray="8 4"/>
  <text x="${w / 2}" y="${h / 2 - iconSize / 2 - 8}" font-family="sans-serif" font-size="${iconSize}" text-anchor="middle" dominant-baseline="middle">👗</text>
  <text x="${w / 2}" y="${h / 2 + iconSize / 2 + 4}" font-family="sans-serif" font-size="${fontSize}" font-weight="700" fill="${color}" text-anchor="middle" dominant-baseline="middle">${label}</text>
  <text x="${w / 2}" y="${h / 2 + iconSize / 2 + 4 + fontSize + 6}" font-family="sans-serif" font-size="${subSize}" fill="#9ca3af" text-anchor="middle">placeholder</text>
</svg>`;
}

function modelSVG(label, color, bg, garmentLabel) {
  const w = 320, h = 640;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#fef9f0"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)" rx="8"/>
  <rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="none" stroke="${color}" stroke-width="2" rx="6" stroke-dasharray="10 5"/>
  <!-- Stick figure head -->
  <circle cx="${w / 2}" cy="90" r="40" fill="${bg}" stroke="${color}" stroke-width="3"/>
  <!-- Body -->
  <rect x="${w / 2 - 50}" y="135" width="100" height="200" rx="10" fill="${color}" opacity="0.8"/>
  <!-- Legs -->
  <rect x="${w / 2 - 45}" y="335" width="38" height="220" rx="8" fill="${color}" opacity="0.6"/>
  <rect x="${w / 2 + 7}" y="335" width="38" height="220" rx="8" fill="${color}" opacity="0.6"/>
  <!-- Arms -->
  <rect x="${w / 2 - 90}" y="140" width="35" height="160" rx="8" fill="${color}" opacity="0.5"/>
  <rect x="${w / 2 + 55}" y="140" width="35" height="160" rx="8" fill="${color}" opacity="0.5"/>
  <!-- Label -->
  <text x="${w / 2}" y="${h - 50}" font-family="sans-serif" font-size="18" font-weight="700" fill="${color}" text-anchor="middle">${label}</text>
  ${garmentLabel ? `<text x="${w / 2}" y="${h - 28}" font-family="sans-serif" font-size="13" fill="#9ca3af" text-anchor="middle">wearing: ${garmentLabel}</text>` : `<text x="${w / 2}" y="${h - 28}" font-family="sans-serif" font-size="13" fill="#9ca3af" text-anchor="middle">base model</text>`}
</svg>`;
}

// Generate garment float placeholders
const garmentsDir = path.join(publicDir, 'garments');
for (const g of garments) {
  const svg = garmentSVG(g.label, g.color, g.bg, 100, 133);
  fs.writeFileSync(path.join(garmentsDir, `${g.id}.svg`), svg);
  console.log(`Created garments/${g.id}.svg`);
}

// Generate model base placeholders
const modelsDir = path.join(publicDir, 'models');
const maleColor = '#92400e';
const maleBg = '#fef9f0';
const femaleColor = '#be185d';
const femaleBg = '#fff1f2';

fs.writeFileSync(path.join(modelsDir, 'male-base.svg'), modelSVG('Male Model', maleColor, maleBg, null));
fs.writeFileSync(path.join(modelsDir, 'female-base.svg'), modelSVG('Female Model', femaleColor, femaleBg, null));
console.log('Created male-base.svg and female-base.svg');

// Generate composite placeholders (model + garment)
for (const g of garments) {
  if (g.gender === 'male') {
    const svg = modelSVG('Male Model', g.color, g.bg, g.label);
    fs.writeFileSync(path.join(modelsDir, `male-${g.id}.svg`), svg);
    console.log(`Created models/male-${g.id}.svg`);
  } else {
    const svg = modelSVG('Female Model', g.color, g.bg, g.label);
    fs.writeFileSync(path.join(modelsDir, `female-${g.id}.svg`), svg);
    console.log(`Created models/female-${g.id}.svg`);
  }
}

// Generate fabric weave texture SVG
const textureSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">
  <rect width="20" height="20" fill="none"/>
  <path d="M0 10 L10 0 M-2 2 L2 -2 M18 22 L22 18" stroke="#92400e" stroke-width="0.5" opacity="0.5"/>
  <path d="M10 20 L20 10 M-2 18 L2 22 M18 -2 L22 2" stroke="#92400e" stroke-width="0.5" opacity="0.5"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'textures', 'fabric-weave.svg'), textureSVG);
console.log('Created textures/fabric-weave.svg');

console.log('\nAll placeholder assets generated!');
