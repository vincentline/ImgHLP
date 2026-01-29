/**
 * 导出功能模块
 * 负责将工作区内容导出为图片
 */

class ExportManager {
  constructor(canvasManager) {
    this.canvasManager = canvasManager;
  }

  /**
   * 导出工作区为图片
   * @param {string} format 图片格式 (png, jpeg, webp)
   * @param {number} quality 图片质量 (0-1)
   * @returns {Promise<Blob>} 导出的图片Blob
   */
  async exportImage(format = 'png', quality = 1) {
    const stage = this.canvasManager.getStage();
    const workspace = this.canvasManager.getWorkspaceSize();

    // 创建临时画布，只包含工作区内容
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = workspace.width;
    tempCanvas.height = workspace.height;
    const tempCtx = tempCanvas.getContext('2d');

    // 清除临时画布
    tempCtx.clearRect(0, 0, workspace.width, workspace.height);

    // 获取原始舞台数据URL
    const originalDataUrl = stage.toDataURL({
      format: format,
      quality: quality,
      pixelRatio: 1
    });

    // 加载原始图片
    const originalImage = await this.loadImage(originalDataUrl);

    // 计算偏移量，确保工作区内容居中
    const offsetX = (originalImage.width - workspace.width) / 2;
    const offsetY = (originalImage.height - workspace.height) / 2;

    // 绘制工作区内容到临时画布
    tempCtx.drawImage(
      originalImage,
      offsetX,
      offsetY,
      workspace.width,
      workspace.height,
      0,
      0,
      workspace.width,
      workspace.height
    );

    // 转换临时画布为Blob
    return new Promise((resolve) => {
      tempCanvas.toBlob(resolve, `image/${format}`, quality);
    });
  }

  /**
   * 下载导出的图片
   * @param {Blob} imageBlob 图片Blob
   * @param {string} filename 文件名
   */
  downloadImage(imageBlob, filename = 'export.png') {
    const url = URL.createObjectURL(imageBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * 加载图片
   * @param {string} src 图片源
   * @returns {Promise<HTMLImageElement>} 加载完成的图片
   */
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }

  /**
   * 导出并下载图片
   * @param {string} format 图片格式
   * @param {number} quality 图片质量
   * @param {string} filename 文件名
   */
  async exportAndDownload(format = 'png', quality = 1, filename = `export.${format}`) {
    try {
      const imageBlob = await this.exportImage(format, quality);
      this.downloadImage(imageBlob, filename);
      return true;
    } catch (error) {
      console.error('导出失败:', error);
      return false;
    }
  }
}

export default ExportManager;