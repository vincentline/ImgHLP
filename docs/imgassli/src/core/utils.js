/**
 * 工具函数模块
 * 提供各种辅助功能
 */

/**
 * 生成唯一ID
 * @returns {string} - 唯一ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 深拷贝对象
 * @param {Object} obj - 要拷贝的对象
 * @returns {Object} - 拷贝后的对象
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * 验证图片源是否有效
 * @param {*} imageSource - 图片源
 * @returns {boolean} - 是否有效
 */
export function isValidImageSource(imageSource) {
    return (
        imageSource instanceof File ||
        imageSource instanceof Blob ||
        (typeof imageSource === 'string' && imageSource.startsWith('data:image/'))
    );
}

/**
 * 验证位置信息是否有效
 * @param {Object} positionData - 位置信息
 * @returns {boolean} - 是否有效
 */
export function isValidPositionData(positionData) {
    return (
        positionData &&
        positionData.canvasSize &&
        typeof positionData.canvasSize.width === 'number' &&
        typeof positionData.canvasSize.height === 'number' &&
        Array.isArray(positionData.images) &&
        positionData.images.length > 0
    );
}

/**
 * 格式化错误信息
 * @param {Error} error - 错误对象
 * @returns {string} - 格式化后的错误信息
 */
export function formatError(error) {
    return error.message || 'Unknown error';
}

/**
 * 等待指定时间
 * @param {number} ms - 等待时间（毫秒）
 * @returns {Promise} - 等待完成的Promise
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
