import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, basename, extname } from 'path';

const dirs = ['public/garments', 'public/models'];

let totalBefore = 0, totalAfter = 0;

for (const dir of dirs) {
  const files = (await readdir(dir)).filter(f => /\.(png|jpg|jpeg)$/i.test(f));
  for (const file of files) {
    const input = join(dir, file);
    const output = join(dir, basename(file, extname(file)) + '.webp');
    const before = (await stat(input)).size;
    await sharp(input).webp({ quality: 85 }).toFile(output);
    const after = (await stat(output)).size;
    const pct = Math.round((1 - after / before) * 100);
    console.log(`${file.padEnd(30)} ${(before/1024).toFixed(0).padStart(6)}KB → ${(after/1024).toFixed(0).padStart(5)}KB  (${pct}% smaller)`);
    totalBefore += before;
    totalAfter += after;
  }
}

const saved = totalBefore - totalAfter;
console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)}MB → ${(totalAfter/1024/1024).toFixed(1)}MB  (saved ${(saved/1024/1024).toFixed(1)}MB)`);
