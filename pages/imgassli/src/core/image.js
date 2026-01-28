/**
 * 图片处理模块
 * 负责生成拼图、Alpha通道图和位置信息
 */

/**
 * 生成拼接图
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {Array} layout - 布局信息数组
 * @returns {HTMLCanvasElement} - 拼接图Canvas
 */
export function generateResultImage(width, height, layout) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸
    canvas.width = width;
    canvas.height = height;
    
    // 清空Canvas
    ctx.clearRect(0, 0, width, height);
    
    // 填充透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制每张图片
    layout.forEach(item => {
        ctx.drawImage(item.image.image, item.x, item.y, item.width, item.height);
    });
    
    return canvas;
}

/**
 * 生成Alpha通道图
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {Array} layout - 布局信息数组
 * @returns {HTMLCanvasElement} - Alpha通道图Canvas
 */
export function generateAlphaImage(width, height, layout) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 设置Canvas尺寸
    canvas.width = width;
    canvas.height = height;
    
    // 清空Canvas，填充黑色背景
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制每张图片的Alpha通道
    layout.forEach(item => {
        const img = item.image.image;
        
        // 创建临时Canvas来处理Alpha通道
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = img.width;
        tempCanvas.height = img.height;
        
        // 绘制原始图片到临时Canvas
        tempCtx.drawImage(img, 0, 0);
        
        // 获取ImageData
        const imageData = tempCtx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        
        // 处理Alpha通道：不透明部分转为白色，透明部分保持黑色
        for (let i = 0; i < data.length; i += 4) {
            const alpha = data[i + 3];
            if (alpha > 0) {
                // 不透明部分：白色
                data[i] = 255;     // R
                data[i + 1] = 255; // G
                data[i + 2] = 255; // B
                data[i + 3] = 255; // A
            } else {
                // 透明部分：黑色
                data[i] = 0;       // R
                data[i + 1] = 0;   // G
                data[i + 2] = 0;   // B
                data[i + 3] = 255; // A
            }
        }
        
        // 将处理后的ImageData放回临时Canvas
        tempCtx.putImageData(imageData, 0, 0);
        
        // 将临时Canvas绘制到AlphaCanvas
        ctx.drawImage(tempCanvas, item.x, item.y, item.width, item.height);
    });
    
    return canvas;
}

/**
 * 生成位置信息
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {Array} layout - 布局信息数组
 * @returns {Object} - 位置信息对象
 */
export function generatePositionData(width, height, layout) {
    return {
        canvasSize: { width, height },
        images: layout.map(item => ({
            filename: item.image.name,
            position: {
                x: item.x,
                y: item.y
            },
            size: {
                width: item.width,
                height: item.height
            },
            // 相对坐标（0-1范围），便于AI理解
            relativePosition: {
                x: item.x / width,
                y: item.y / height
            },
            relativeSize: {
                width: item.width / width,
                height: item.height / height
            }
        }))
    };
}

/**
 * Canvas转Blob
 * @param {HTMLCanvasElement} canvas - Canvas元素
 * @param {string} type - 图片类型
 * @param {number} quality - 图片质量
 * @returns {Promise<Blob>} - Blob对象
 */
export function canvasToBlob(canvas, type = 'image/png', quality = 1) {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Canvas to blob failed'));
            }
        }, type, quality);
    });
}

/**
 * 加载图片
 * @param {File|Blob|string} imageSource - 图片源（File、Blob或DataURL）
 * @returns {Promise<HTMLImageElement>} - 加载完成的Image元素
 */
export function loadImage(imageSource) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Image load failed'));
        
        if (imageSource instanceof File || imageSource instanceof Blob) {
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('File read failed'));
            reader.readAsDataURL(imageSource);
        } else {
            img.src = imageSource;
        }
    });
}
