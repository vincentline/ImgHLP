/**
 * 布局计算模块
 * 负责计算最佳拼图布局
 */

/**
 * 计算最佳拼图布局
 * @param {Array} images - 图片数组，每个元素包含image对象
 * @returns {Object} - 包含width、height和layout的对象
 */
export function calculateBestLayout(images) {
    // 计算所有图片的最大宽度
    const margin = 10; // 图片间距
    
    // 首先计算图片在网格排列下的实际尺寸
    let actualWidth = 0;
    let actualHeight = 0;
    let currentX = margin;
    let currentY = margin;
    let rowHeight = 0;
    
    // 计算实际需要的宽度和高度（使用足够大的临时宽度）
    images.forEach(img => {
        const image = img.image;
        
        // 单行排列所有图片，计算实际需要的最大宽度
        currentX += image.width + margin;
        rowHeight = Math.max(rowHeight, image.height);
        
        // 记录最大宽度
        if (currentX > actualWidth) {
            actualWidth = currentX;
        }
    });
    
    // 计算单行排列的高度
    actualHeight = currentY + rowHeight;
    
    // 减去最后一个图片的右侧间距
    actualWidth -= margin;
    
    // 现在重新计算网格排列的实际尺寸
    // 尝试找到最佳的列数，使宽度和高度更加合理
    let optimalCols = 1;
    let optimalGridWidth = actualWidth;
    let optimalGridHeight = actualHeight;
    let minEmptySpace = Infinity;
    
    // 尝试不同的列数，找到最佳排列
    for (let cols = 1; cols <= images.length; cols++) {
        let gridWidth = 0;
        let gridHeight = margin;
        let rowX = margin;
        let rowMaxHeight = 0;
        
        images.forEach((img, index) => {
            const image = img.image;
            
            // 换行逻辑
            if (index > 0 && index % cols === 0) {
                gridWidth = Math.max(gridWidth, rowX - margin);
                gridHeight += rowMaxHeight + margin;
                rowX = margin;
                rowMaxHeight = 0;
            }
            
            rowX += image.width + margin;
            rowMaxHeight = Math.max(rowMaxHeight, image.height);
        });
        
        // 处理最后一行
        gridWidth = Math.max(gridWidth, rowX - margin);
        gridHeight += rowMaxHeight;
        
        // 计算当前排列的空白空间
        const totalArea = gridWidth * gridHeight;
        const totalImageArea = images.reduce((sum, img) => sum + (img.image.width * img.image.height), 0);
        const emptySpace = totalArea - totalImageArea;
        
        // 找到空白空间最小的排列
        if (emptySpace < minEmptySpace) {
            minEmptySpace = emptySpace;
            optimalCols = cols;
            optimalGridWidth = gridWidth;
            optimalGridHeight = gridHeight;
        }
    }
    
    // 对于两张图片的特殊情况，优先选择水平排列
    if (images.length === 2) {
        const horizontalWidth = images[0].image.width + images[1].image.width + margin * 3;
        const horizontalHeight = Math.max(images[0].image.height, images[1].image.height) + margin * 2;
        const horizontalArea = horizontalWidth * horizontalHeight;
        const horizontalEmptySpace = horizontalArea - (images[0].image.width * images[0].image.height + images[1].image.width * images[1].image.height);
        
        const verticalWidth = Math.max(images[0].image.width, images[1].image.width) + margin * 2;
        const verticalHeight = images[0].image.height + images[1].image.height + margin * 3;
        const verticalArea = verticalWidth * verticalHeight;
        const verticalEmptySpace = verticalArea - (images[0].image.width * images[0].image.height + images[1].image.width * images[1].image.height);
        
        // 如果水平排列的空白空间不大于垂直排列的空白空间，选择水平排列
        if (horizontalEmptySpace <= verticalEmptySpace) {
            optimalCols = 2;
            optimalGridWidth = horizontalWidth - margin;
            optimalGridHeight = horizontalHeight - margin;
        }
    }
    
    // 基于最佳网格尺寸，计算符合1:1、4:3或16:9比例的尺寸
    const aspectRatios = [
        { width: 1, height: 1, name: '1:1' },
        { width: 4, height: 3, name: '4:3' },
        { width: 16, height: 9, name: '16:9' }
    ];
    
    // 找出最适合的比例和尺寸
    let bestRatio = null;
    let bestWidth = 0;
    let bestHeight = 0;
    let minArea = Infinity;
    
    // 计算每种比例下的最佳尺寸
    aspectRatios.forEach(ratio => {
        // 计算基于实际尺寸的比例适配
        let width, height;
        
        // 两种方式计算，选择较小的面积
        // 方式1：基于宽度适配
        width = Math.ceil(optimalGridWidth);
        height = Math.ceil(width * ratio.height / ratio.width);
        
        // 确保高度足够
        if (height < optimalGridHeight) {
            height = Math.ceil(optimalGridHeight);
            width = Math.ceil(height * ratio.width / ratio.height);
        }
        
        // 计算面积
        const area1 = width * height;
        
        // 方式2：基于高度适配
        height = Math.ceil(optimalGridHeight);
        width = Math.ceil(height * ratio.width / ratio.height);
        
        // 确保宽度足够
        if (width < optimalGridWidth) {
            width = Math.ceil(optimalGridWidth);
            height = Math.ceil(width * ratio.height / ratio.width);
        }
        
        // 计算面积
        const area2 = width * height;
        
        // 选择较小的面积
        const area = Math.min(area1, area2);
        
        // 选择面积最小的比例
        if (area < minArea) {
            minArea = area;
            bestRatio = ratio;
            bestWidth = (area === area1) ? Math.ceil(optimalGridWidth) : Math.ceil(height * ratio.width / ratio.height);
            bestHeight = Math.ceil(bestWidth * ratio.height / ratio.width);
        }
    });
    
    // 确保生成的尺寸严格符合比例
    // 重新计算，确保精确符合比例
    bestWidth = Math.ceil(bestWidth / bestRatio.width) * bestRatio.width;
    bestHeight = Math.ceil(bestWidth * bestRatio.height / bestRatio.width);
    
    // 确保尺寸足够容纳所有图片
    if (bestWidth < optimalGridWidth) {
        bestWidth = Math.ceil(optimalGridWidth / bestRatio.width) * bestRatio.width;
        bestHeight = Math.ceil(bestWidth * bestRatio.height / bestRatio.width);
    }
    
    if (bestHeight < optimalGridHeight) {
        bestHeight = Math.ceil(optimalGridHeight / bestRatio.height) * bestRatio.height;
        bestWidth = Math.ceil(bestHeight * bestRatio.width / bestRatio.height);
    }
    
    // 限制最大尺寸不超过4096
    const maxSize = 4096;
    if (bestWidth > maxSize || bestHeight > maxSize) {
        // 计算缩放比例
        const scale = Math.min(maxSize / bestWidth, maxSize / bestHeight);
        
        // 按比例缩小宽度和高度，确保符合比例
        bestWidth = Math.ceil(bestWidth * scale / bestRatio.width) * bestRatio.width;
        bestHeight = Math.ceil(bestWidth * bestRatio.height / bestRatio.width);
        
        // 确保缩小后的尺寸仍能容纳所有图片
        // 如果缩小后无法容纳，需要重新调整列数和排列方式
        // 这里简化处理，确保最小尺寸至少容纳单张图片
        const minRequiredWidth = images.reduce((max, img) => Math.max(max, img.image.width), 0) + margin * 2;
        const minRequiredHeight = images.reduce((max, img) => Math.max(max, img.image.height), 0) + margin * 2;
        
        bestWidth = Math.max(bestWidth, minRequiredWidth);
        bestHeight = Math.max(bestHeight, minRequiredHeight);
        
        // 确保最终严格符合比例
        bestHeight = Math.ceil(bestWidth * bestRatio.height / bestRatio.width);
    }
    
    // 确保bestWidth至少等于optimalGridWidth，以容纳所有图片
    if (bestWidth < optimalGridWidth) {
        bestWidth = Math.ceil(optimalGridWidth / bestRatio.width) * bestRatio.width;
        bestHeight = Math.ceil(bestWidth * bestRatio.height / bestRatio.width);
    }
    
    // 确保bestHeight至少等于optimalGridHeight，以容纳所有图片
    if (bestHeight < optimalGridHeight) {
        bestHeight = Math.ceil(optimalGridHeight / bestRatio.height) * bestRatio.height;
        bestWidth = Math.ceil(bestHeight * bestRatio.width / bestRatio.height);
    }
    
    // 最终确保严格符合比例
    bestHeight = Math.ceil(bestWidth * bestRatio.height / bestRatio.width);
    
    // 计算最终的网格排列位置
    const layout = [];
    currentX = margin;
    currentY = margin;
    rowHeight = 0;
    let itemsPerRow = 0;
    
    // 对于两张图片的特殊情况，强制设置为水平排列
    if (images.length === 2) {
        itemsPerRow = 2;
    } else {
        // 计算最佳每行显示数量
        for (let i = 1; i <= images.length; i++) {
            const testWidth = images.slice(0, i).reduce((sum, img) => sum + img.image.width, 0) + margin * (i + 1);
            if (testWidth <= bestWidth) {
                itemsPerRow = i;
            } else {
                break;
            }
        }
    }
    
    // 重新排列图片
    images.forEach((img, index) => {
        const image = img.image;
        
        // 换行逻辑
        if (index > 0 && index % itemsPerRow === 0) {
            currentY += rowHeight + margin;
            currentX = margin;
            rowHeight = 0;
        }
        
        // 记录位置
        layout.push({
            image: img,
            x: currentX,
            y: currentY,
            width: image.width,
            height: image.height
        });
        
        // 更新当前行信息
        currentX += image.width + margin;
        rowHeight = Math.max(rowHeight, image.height);
    });
    
    return {
        width: bestWidth,
        height: bestHeight,
        layout: layout
    };
}
