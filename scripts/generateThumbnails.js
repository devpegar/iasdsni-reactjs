/* eslint-env node */

import fs from "fs";
import path from "path";
import sizeOf from "image-size";
import sharp from "sharp";

const GALLERY_DIR = path.join(process.cwd(), "public/assets/images/gallery");
const THUMBS_DIR = path.join(GALLERY_DIR, "thumbs");
const OUTPUT_FILE = path.join(
  process.cwd(),
  "src/pages/Home/data/galleryData.json"
);

async function generateGalleryData() {
  console.log("📸 Generando miniaturas y datos de galería...");

  if (!fs.existsSync(THUMBS_DIR)) {
    fs.mkdirSync(THUMBS_DIR);
  }

  const files = fs.readdirSync(GALLERY_DIR);

  const images = [];

  for (const file of files) {
    if (!/\.(jpg|jpeg|png)$/i.test(file)) continue;

    const originalPath = path.join(GALLERY_DIR, file);

    // Leer tamaño real
    const buffer = fs.readFileSync(originalPath);
    const dimensions = sizeOf(buffer);

    // Crear nombre del thumbnail
    const thumbName = `thumb_${file}`;
    const thumbPath = path.join(THUMBS_DIR, thumbName);

    // Generar thumbnail de 300px de alto
    await sharp(originalPath).resize({ height: 300 }).toFile(thumbPath);

    console.log(`✔ Miniatura generada: ${thumbName}`);

    images.push({
      id: images.length + 1,
      src: `/assets/images/gallery/${file}`, // imagen grande
      thumbnail: `/assets/images/gallery/thumbs/${thumbName}`, // miniatura
      width: dimensions.width,
      height: dimensions.height,
      description: `Imagen ${images.length + 1}`,
    });
  }

  // Guardar JSON
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(images, null, 2));

  console.log("\n✅ JSON generado en:");
  console.log("➡", OUTPUT_FILE);
}

generateGalleryData();
