// 拼图工具JavaScript逻辑

// 全局变量
let droppedFiles = [];
let loadedImages = [];
let resultCanvas = null;
let alphaCanvas = null;
let positionData = [];

// 切割功能相关变量
let cutFiles = [];
let cutImages = [];
let cutResultImages = [];
let cutCanvas = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

/**
 * 初始化应用
 */
function initApp() {
    // 初始化主题
    initTheme();
    
    // 初始化拖放功能
    initDragAndDrop();
    
    // 初始化浏览文件功能
    initBrowseFiles();
    
    // 初始化下载按钮
    initDownloadButtons();
    
    // 初始化切割功能
    initCutFunctionality();
    
    // 初始化Canvas
    resultCanvas = document.getElementById('resultCanvas');
    alphaCanvas = document.getElementById('alphaCanvas');
}

/**
 * 初始化主题切换
 */
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // 应用保存的主题
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    // 绑定主题切换事件
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    });
}

/**
 * 初始化拖放功能
 */
function initDragAndDrop() {
    const dropContainer = document.getElementById('dropContainer');
    const fileInput = document.getElementById('fileInput');
    
    // 拖放事件处理
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropContainer.addEventListener(eventName, preventDefaults, false);
    });
    
    // 高亮效果
    ['dragenter', 'dragover'].forEach(eventName => {
        dropContainer.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropContainer.addEventListener(eventName, unhighlight, false);
    });
    
    // 处理放置的文件
    dropContainer.addEventListener('drop', handleDrop, false);
    
    // 点击拖放区域也可以选择文件
    dropContainer.addEventListener('click', function() {
        fileInput.click();
    });
}

/**
 * 初始化浏览文件功能
 */
function initBrowseFiles() {
    const browseBtn = document.getElementById('browseBtn');
    const fileInput = document.getElementById('fileInput');
    
    browseBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleFiles(Array.from(this.files));
        }
    });
}

/**
 * 阻止默认拖放行为
 */
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

/**
 * 高亮拖放区域
 */
function highlight() {
    const dropContainer = document.getElementById('dropContainer');
    dropContainer.classList.add('drag-over');
}

/**
 * 取消高亮拖放区域
 */
function unhighlight() {
    const dropContainer = document.getElementById('dropContainer');
    dropContainer.classList.remove('drag-over');
}

/**
 * 处理拖放的文件
 */
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = Array.from(dt.files);
    handleFiles(files);
}

/**
 * 处理选择的文件
 */
function handleFiles(files) {
    // 过滤出PNG文件
    const pngFiles = files.filter(file => file.type === 'image/png');
    
    if (pngFiles.length === 0) {
        showToast('请选择PNG文件');
        return;
    }
    
    droppedFiles = pngFiles;
    loadImages(pngFiles);
}

/**
 * 加载图片文件
 */
function loadImages(files) {
    loadedImages = [];
    let loadedCount = 0;
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                loadedImages.push({
                    file: file,
                    image: img,
                    name: file.name
                });
                
                loadedCount++;
                if (loadedCount === files.length) {
                    // 所有图片加载完成，开始拼接
                    processImages();
                }
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * 处理图片，生成拼接图、Alpha通道图和位置信息
 */
function processImages() {
    if (loadedImages.length === 0) return;
    
    // 计算最佳拼接尺寸
    const { width, height, layout } = calculateBestLayout(loadedImages);
    
    // 生成拼接图
    generateResultImage(width, height, layout);
    
    // 生成Alpha通道图
    generateAlphaImage(width, height, layout);
    
    // 生成位置信息
    generatePositionData(width, height, layout);
    
    // 显示预览和下载区域
    showPreviewAndDownload();
    
    showToast(`成功处理 ${loadedImages.length} 张图片`);
}

/**
 * 计算最佳雪碧图布局
 */
function calculateBestLayout(images) {
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

/**
 * 生成拼接图
 */
function generateResultImage(width, height, layout) {
    const ctx = resultCanvas.getContext('2d');
    
    // 设置Canvas尺寸
    resultCanvas.width = width;
    resultCanvas.height = height;
    
    // 清空Canvas
    ctx.clearRect(0, 0, width, height);
    
    // 填充透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制每张图片
    layout.forEach(item => {
        ctx.drawImage(item.image.image, item.x, item.y, item.width, item.height);
    });
}

/**
 * 生成Alpha通道图
 */
function generateAlphaImage(width, height, layout) {
    const ctx = alphaCanvas.getContext('2d');
    
    // 设置Canvas尺寸
    alphaCanvas.width = width;
    alphaCanvas.height = height;
    
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
}

/**
 * 生成位置信息
 */
function generatePositionData(width, height, layout) {
    positionData = {
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
 * 显示预览和下载区域
 */
function showPreviewAndDownload() {
    const previewSection = document.getElementById('previewSection');
    const downloadSection = document.getElementById('downloadSection');
    const cutSection = document.getElementById('cutSection');
    
    previewSection.style.display = 'block';
    downloadSection.style.display = 'block';
    cutSection.style.display = 'block';
}

/**
 * 初始化下载按钮
 */
function initDownloadButtons() {
    const downloadResultBtn = document.getElementById('downloadResultBtn');
    const downloadAlphaBtn = document.getElementById('downloadAlphaBtn');
    const downloadPosBtn = document.getElementById('downloadPosBtn');
    
    downloadResultBtn.addEventListener('click', function() {
        downloadCanvasAsImage(resultCanvas, '拼接图.png');
    });
    
    downloadAlphaBtn.addEventListener('click', function() {
        downloadCanvasAsImage(alphaCanvas, 'Alpha通道图.png');
    });
    
    downloadPosBtn.addEventListener('click', function() {
        downloadPositionData();
    });
}

/**
 * 下载Canvas为图片
 */
function downloadCanvasAsImage(canvas, filename) {
    // 将Canvas转换为Blob
    canvas.toBlob(function(blob) {
        if (blob) {
            // 创建下载链接
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast(`已下载 ${filename}`);
        }
    });
}

/**
 * 下载位置信息
 */
function downloadPositionData() {
    const dataStr = JSON.stringify(positionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '位置信息.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('已下载位置信息.json');
}

/**
 * 显示Toast提示
 */
function showToast(message) {
    const toastContainer = document.getElementById('toastContainer');
    
    // 创建Toast元素
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    
    // 添加到容器
    toastContainer.appendChild(toast);
    
    // 3秒后自动移除
    setTimeout(function() {
        toast.remove();
    }, 3000);
}

/**
 * 初始化切割功能
 */
function initCutFunctionality() {
    // 初始化切割拖放区域
    initCutDragAndDrop();
    
    // 初始化切割浏览文件功能
    initCutBrowseFiles();
    
    // 初始化切割下载按钮
    initCutDownloadButtons();
    
    // 初始化切割Canvas
    cutCanvas = document.createElement('canvas');
}

/**
 * 初始化切割拖放功能
 */
function initCutDragAndDrop() {
    const cutDropContainer = document.getElementById('cutDropContainer');
    const cutFileInput = document.getElementById('cutFileInput');
    
    // 拖放事件处理
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        cutDropContainer.addEventListener(eventName, preventDefaults, false);
    });
    
    // 高亮效果
    ['dragenter', 'dragover'].forEach(eventName => {
        cutDropContainer.addEventListener(eventName, function() {
            cutDropContainer.classList.add('drag-over');
        }, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        cutDropContainer.addEventListener(eventName, function() {
            cutDropContainer.classList.remove('drag-over');
        }, false);
    });
    
    // 处理放置的文件
    cutDropContainer.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = Array.from(dt.files);
        handleCutFiles(files);
    }, false);
    
    // 点击拖放区域也可以选择文件
    cutDropContainer.addEventListener('click', function() {
        cutFileInput.click();
    });
}

/**
 * 初始化切割浏览文件功能
 */
function initCutBrowseFiles() {
    const cutBrowseBtn = document.getElementById('cutBrowseBtn');
    const cutFileInput = document.getElementById('cutFileInput');
    
    cutBrowseBtn.addEventListener('click', function() {
        cutFileInput.click();
    });
    
    cutFileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            handleCutFiles(Array.from(this.files));
        }
    });
}

/**
 * 处理切割选择的文件
 */
function handleCutFiles(files) {
    // 过滤出PNG文件
    const pngFiles = files.filter(file => file.type === 'image/png');
    
    if (pngFiles.length === 0) {
        showToast('请选择PNG文件');
        return;
    }
    
    cutFiles = pngFiles;
    loadCutImages(pngFiles);
}

/**
 * 加载切割图片文件
 */
function loadCutImages(files) {
    cutImages = [];
    let loadedCount = 0;
    
    files.forEach((file, index) => {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                cutImages.push({
                    file: file,
                    image: img,
                    name: file.name
                });
                
                loadedCount++;
                if (loadedCount === files.length) {
                    // 所有图片加载完成，开始切割
                    processCutImage();
                }
            };
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    });
}

/**
 * 处理切割图片
 */
function processCutImage() {
    if (cutImages.length === 0 || !positionData || !positionData.canvasSize) {
        showToast('请先生成拼接图和位置信息');
        return;
    }
    
    const cutImage = cutImages[0].image;
    const originalWidth = positionData.canvasSize.width;
    const originalHeight = positionData.canvasSize.height;
    
    // 验证比例是否一致
    const cutRatio = cutImage.width / cutImage.height;
    const originalRatio = originalWidth / originalHeight;
    
    if (Math.abs(cutRatio - originalRatio) > 0.01) {
        showToast('图片比例与原始拼接图不一致');
        return;
    }
    
    // 扣除底色（返回Canvas）
    const processedCanvas = removeBackground(cutImage);
    
    // 缩放图片到原始拼接图大小
    const scaledCanvas = scaleImage(processedCanvas, originalWidth, originalHeight);
    
    // 按照位置信息切割图片
    cutImagesByPosition(scaledCanvas);
    
    // 显示切割结果
    showCutResult();
    
    showToast('图片切割完成');
}

/**
 * 扣除底色
 */
function removeBackground(image) {
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
    
    // 直接返回处理后的Canvas，避免异步加载问题
    return tempCanvas;
}

/**
 * 缩放图片
 */
function scaleImage(canvas, targetWidth, targetHeight) {
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
 */
function cutImagesByPosition(canvas) {
    const ctx = canvas.getContext('2d');
    cutResultImages = [];
    
    // 遍历位置信息，切割图片
    positionData.images.forEach((item, index) => {
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
}

/**
 * 显示切割结果
 */
function showCutResult() {
    const cutResult = document.getElementById('cutResult');
    cutResult.style.display = 'block';
}

/**
 * 初始化切割下载按钮
 */
function initCutDownloadButtons() {
    const downloadCutBtn = document.getElementById('downloadCutBtn');
    
    downloadCutBtn.addEventListener('click', function() {
        downloadCutImages();
    });
}

/**
 * 使用JSZip打包下载切割后的图片
 */
function downloadCutImages() {
    if (cutResultImages.length === 0) return;
    
    // 创建JSZip实例
    const zip = new JSZip();
    
    // 添加每张图片到ZIP
    cutResultImages.forEach((item, index) => {
        // 将Canvas转换为Blob
        item.canvas.toBlob(function(blob) {
            if (blob) {
                // 添加到ZIP
                zip.file(item.filename, blob);
                
                // 当所有图片都添加完成后，生成并下载ZIP
                if (index === cutResultImages.length - 1) {
                    zip.generateAsync({type: 'blob'})
                        .then(function(zipBlob) {
                            // 创建下载链接
                            const url = URL.createObjectURL(zipBlob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = '切割图.zip';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                            
                            showToast(`已下载包含 ${cutResultImages.length} 张图片的压缩包`);
                        })
                        .catch(function(error) {
                            console.error('打包下载失败:', error);
                            showToast('打包下载失败，请重试');
                        });
                }
            }
        }, 'image/png');
    });
}
