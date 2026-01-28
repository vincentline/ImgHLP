/**
 * 图片切割模块
 * 负责将拼图切割成多张原始图片
 */

/**
 * 扣除底色
 * @param {HTMLImageElement} image - 图片元素
 * @returns {HTMLCanvasElement} - 处理后的Canvas
 */
export function removeBackground(image) {
    // 创建临时Canvas
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = image.width;
    tempCanvas.height = image.height;
    
    // 绘制图片
    tempCtx.drawImage(image, 0, 0);
    
    // 获取ImageData
    const imageData = tempCtx.getImageData(0, 0, image.width, image.height);
    const data = imageData.data;
    
    // 简单的底色扣除逻辑
    // 将接近白色的像素设为透明
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // 如果是接近白色的像素，设为透明
        if (r > 240 && g > 240 && b > 240) {
            data[i + 3] = 0;
        }
    }
    
    // 将处理后的ImageData放回Canvas
    tempCtx.putImageData(imageData, 0, 0);
    
    return tempCanvas;
}

/**
 * 缩放图片
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {number} targetWidth - 目标宽度
 * @param {number} targetHeight - 目标高度
 * @returns {HTMLCanvasElement} - 缩放后的Canvas
 */
export function scaleImage(canvas, targetWidth, targetHeight) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = targetWidth;
    tempCanvas.height = targetHeight;
    
    // 绘制并缩放图片
    tempCtx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
    
    return tempCanvas;
}

/**
 * 按照位置信息切割图片
 * @param {HTMLCanvasElement} canvas - 拼图Canvas
 * @param {Object} positionData - 位置信息
 * @returns {Array} - 切割后的图片数组，每个元素包含filename和canvas
 */
export function cutImagesByPosition(canvas, positionData) {
    const ctx = canvas.getContext('2d');
    const cutResultImages = [];
    
    // 遍历位置信息，切割图片
    positionData.images.forEach((item) => {
        // 创建切割Canvas
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = item.size.width;
        tempCanvas.height = item.size.height;
        
        // 切割图片
        tempCtx.drawImage(
            canvas, 
            item.position.x, item.position.y, 
            item.size.width, item.size.height, 
            0, 0, 
            item.size.width, item.size.height
        );
        
        // 保存切割结果
        cutResultImages.push({
            filename: item.filename,
            canvas: tempCanvas
        });
    });
    
    return cutResultImages;
}

/**
 * 处理切割图片
 * @param {HTMLImageElement} cutImage - 要切割的图片
 * @param {Object} positionData - 位置信息
 * @returns {Promise<Array>} - 切割后的图片数组
 */
export async function processCutImage(cutImage, positionData) {
    if (!positionData || !positionData.canvasSize) {
        throw new Error('Position data is required');
    }
    
    const originalWidth = positionData.canvasSize.width;
    const originalHeight = positionData.canvasSize.height;
    
    // 验证比例是否一致
    const cutRatio = cutImage.width / cutImage.height;
    const originalRatio = originalWidth / originalHeight;
    
    if (Math.abs(cutRatio - originalRatio) > 0.01) {
        throw new Error('Image ratio does not match original');
    }
    
    // 扣除底色（返回Canvas）
    const processedCanvas = removeBackground(cutImage);
    
    // 缩放图片到原始拼接图大小
    const scaledCanvas = scaleImage(processedCanvas, originalWidth, originalHeight);
    
    // 按照位置信息切割图片
    const cutImages = cutImagesByPosition(scaledCanvas, positionData);
    
    return cutImages;
}
