/**
 * 拼图工具SDK
 * 提供拼图和切割功能的JavaScript SDK
 */

import { calculateBestLayout } from '../core/layout.js';
import { generateResultImage, generateAlphaImage, generatePositionData, canvasToBlob, loadImage } from '../core/image.js';
import { processCutImage } from '../core/cut.js';
import { isValidImageSource, isValidPositionData, formatError } from '../core/utils.js';

/**
 * 拼图工具SDK
 */
const PuzzleToolSDK = {
    /**
     * 合并多张图片为拼图
     * @param {Array} images - 图片源数组（File、Blob或DataURL）
     * @returns {Promise<Object>} - 包含拼图、Alpha图和位置信息的对象
     */
    async merge(images) {
        try {
            // 验证输入
            if (!Array.isArray(images) || images.length === 0) {
                throw new Error('Images array is required and must not be empty');
            }
            
            // 验证每张图片
            for (const imageSource of images) {
                if (!isValidImageSource(imageSource)) {
                    throw new Error('Invalid image source');
                }
            }
            
            // 加载所有图片
            const loadedImages = await Promise.all(
                images.map(async (imageSource, index) => {
                    const img = await loadImage(imageSource);
                    return {
                        file: imageSource instanceof File ? imageSource : null,
                        image: img,
                        name: imageSource instanceof File ? imageSource.name : `image_${index}.png`
                    };
                })
            );
            
            // 计算最佳布局
            const { width, height, layout } = calculateBestLayout(loadedImages);
            
            // 生成拼图
            const resultCanvas = generateResultImage(width, height, layout);
            const resultBlob = await canvasToBlob(resultCanvas);
            
            // 生成Alpha通道图
            const alphaCanvas = generateAlphaImage(width, height, layout);
            const alphaBlob = await canvasToBlob(alphaCanvas);
            
            // 生成位置信息
            const positionData = generatePositionData(width, height, layout);
            
            // 返回结果
            return {
                mergedImage: resultBlob,
                alphaImage: alphaBlob,
                positionData: positionData
            };
        } catch (error) {
            throw new Error(`Merge failed: ${formatError(error)}`);
        }
    },
    
    /**
     * 切割拼图为多张原始图片
     * @param {File|Blob|string} mergedImage - 拼图图片
     * @param {File|Blob|string} alphaImage - Alpha通道图（可选）
     * @param {Object} positionData - 位置信息
     * @returns {Promise<Array>} - 切割后的图片数组
     */
    async split(mergedImage, positionData) {
        try {
            // 验证输入
            if (!isValidImageSource(mergedImage)) {
                throw new Error('Invalid merged image source');
            }
            
            if (!isValidPositionData(positionData)) {
                throw new Error('Invalid position data');
            }
            
            // 加载拼图图片
            const img = await loadImage(mergedImage);
            
            // 处理切割
            const cutImages = await processCutImage(img, positionData);
            
            // 转换为Blob
            const cutBlobs = await Promise.all(
                cutImages.map(async (item) => {
                    const blob = await canvasToBlob(item.canvas);
                    return {
                        filename: item.filename,
                        image: blob
                    };
                })
            );
            
            return cutBlobs;
        } catch (error) {
            throw new Error(`Split failed: ${formatError(error)}`);
        }
    }
};

// 导出SDK
if (typeof module !== 'undefined' && module.exports) {
    // CommonJS
    module.exports = PuzzleToolSDK;
} else if (typeof window !== 'undefined') {
    // 浏览器全局变量
    window.PuzzleTool = PuzzleToolSDK;
} else if (typeof self !== 'undefined') {
    // Web Worker
    self.PuzzleTool = PuzzleToolSDK;
}

// ES模块导出
export default PuzzleToolSDK;
export { PuzzleToolSDK };
