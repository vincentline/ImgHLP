import { Imagequant } from '../../../docs/png-compress/lib/tinypng_lib_wasm.js';

async function compressWithPngquantWasm(file, quality) {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    URL.revokeObjectURL(img.src);
    
    const iq = new Imagequant();
    iq.set_quality(35, quality);
    iq.set_speed(4);
    
    const iqImage = Imagequant.new_image(data, canvas.width, canvas.height, 0);
    const compressedData = iq.process(iqImage);
    
    iqImage.free();
    iq.free();
    
    const blob = new Blob([compressedData], { type: 'image/png' });
    const compressedSize = compressedData.length;
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
    console.error('PNGQuant WASM compress error:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  compress: compressWithPngquantWasm
};
