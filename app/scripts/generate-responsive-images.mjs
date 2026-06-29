import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.resolve(__dirname, '../public/images');
const WIDTHS = [480, 800, 1200];

const TARGETS = [
  'szalon-1.jpeg',
  'szalon-2.jpeg',
  'szalon-3.jpeg',
  'szalon-4.jpeg',
  'edina.jpeg',
  'professional-products.jpeg',
  'organo-kave.jpeg',
  'organo-zoldtea.jpeg',
  'indiai-fejmasszazs.jpeg',
  'kineziologia.jpeg',
  'ultrahangos-zsirbontas.jpeg',
  'bemer-1.jpeg',
  'bemer-2.jpeg',
  'bemer-3.jpeg',
  'arany-before-1.jpeg',
  'arany-after-1.jpeg',
  'arany-before-2.jpeg',
  'arany-after-2.jpeg',
];

let generated = 0;

for (const file of TARGETS) {
  const input = path.join(imagesDir, file);
  if (!fs.existsSync(input)) {
    console.warn(`Skip missing: ${file}`);
    continue;
  }

  const meta = await sharp(input).metadata();
  const base = file.replace(/\.[^.]+$/, '');

  for (const width of WIDTHS) {
    if ((meta.width ?? 0) < width * 0.75) continue;

    const resized = sharp(input).resize({ width, withoutEnlargement: true });

    const webpOut = path.join(imagesDir, `${base}-${width}w.webp`);
    await resized.clone().webp({ quality: 72, effort: 6 }).toFile(webpOut);

    const jpegOut = path.join(imagesDir, `${base}-${width}w.jpeg`);
    await resized.clone().jpeg({ quality: 78, mozjpeg: true }).toFile(jpegOut);

    generated += 2;
  }
}

const logoInput = path.join(imagesDir, 'logo.png');
if (fs.existsSync(logoInput)) {
  for (const width of [96, 128, 192]) {
    await sharp(logoInput)
      .resize({ width, height: width, fit: 'cover' })
      .webp({ quality: 80 })
      .toFile(path.join(imagesDir, `logo-${width}w.webp`));
    await sharp(logoInput)
      .resize({ width, height: width, fit: 'cover' })
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(path.join(imagesDir, `logo-${width}w.png`));
    generated += 2;
  }
}

console.log(`Generated ${generated} responsive image variants.`);