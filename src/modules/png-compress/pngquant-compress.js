const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

async function compressWithPngquant(file, quality) {
  try {
    const buffer = await file.arrayBuffer();
    const compressedBuffer = await imagemin.buffer(Buffer.from(buffer), {
      plugins: [
        imageminPngquant({
          quality: [quality / 100, 0.95],
          speed: 4
        })
      ]
    });

    const blob = new Blob([compressedBuffer], { type: 'image/png' });
    const compressedSize = compressedBuffer.length;
    const originalSize = file.size;
    const rate = (1 - compressedSize / originalSize) * 100;
    const rateString = `${rate.toFixed(1)}%`;

    return {
      success: true,
      blob,
      compressedSize,
      rateString
    };
  } catch (error) {
    console.error('PNGQuant compress error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  compress: compressWithPngquant
};
