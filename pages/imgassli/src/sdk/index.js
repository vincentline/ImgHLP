/**
 * 拼图工具SDK
 * 提供拼图和切割功能的JavaScript SDK
 */

import ApiService from './api.js';
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
            
            // 验证登录状态
            if (!ApiService.isLoggedIn()) {
                throw new Error('请先登录');
            }
            
            // 调用云函数合并图片
            const result = await ApiService.merge(images);
            
            // 返回结果
            return result;
        } catch (error) {
            throw new Error(`Merge failed: ${formatError(error)}`);
        }
    },
    
    /**
     * 切割拼图为多张原始图片
     * @param {File|Blob|string} mergedImage - 拼图图片
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
            
            // 验证登录状态
            if (!ApiService.isLoggedIn()) {
                throw new Error('请先登录');
            }
            
            // 调用云函数切割图片
            const result = await ApiService.split(mergedImage, positionData);
            
            return result;
        } catch (error) {
            throw new Error(`Split failed: ${formatError(error)}`);
        }
    },
    
    /**
     * 检查用户是否登录
     * @returns {boolean} - 是否已登录
     */
    isLoggedIn() {
        return ApiService.isLoggedIn();
    },
    
    /**
     * 登出
     */
    logout() {
        ApiService.logout();
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
