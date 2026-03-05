const imageList = [];
let isCompressing = false;

let currentEngine = 'tinypng';
let TinyPNG = null;

const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const imageListEl = document.getElementById('imageList');
const compressAllBtn = document.getElementById('compressAllBtn');
const downloadAllBtn = document.getElementById('downloadAllBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const dropOverlay = document.getElementById('dropOverlay');
const themeToggle = document.getElementById('themeToggle');
const engineSelect = document.getElementById('engineSelect');

function init() {
  initTheme();
  initDragDrop();
  initButtons();
  initEngineSelector();
  loadTinyPNG();
}

function initEngineSelector() {
  engineSelect.addEventListener('change', (e) => {
    currentEngine = e.target.value;
    showToast(`已切换到 ${e.target.options[e.target.selectedIndex].text} 引擎`, 'success');
  });
}

async function loadTinyPNG() {
  try {
    // 加载本地 TinyPNG 库
    const module = await import('./lib/index.js');
    
    // 初始化 WASM 模块
    const wasmLoaded = await module.initWasm();
    if (!wasmLoaded) {
      throw new Error('Failed to initialize WASM module');
    }
    
    // 使用默认导出的 TinyPNG 实例
    TinyPNG = module.default;
    console.log('TinyPNG library loaded successfully from local');
    console.log('TinyPNG methods:', Object.keys(TinyPNG));
    showToast('TinyPNG 库加载成功', 'success');
  } catch (error) {
    console.error('Failed to load TinyPNG library:', error);
    // 降级到 browser-image-compression
    currentEngine = 'browser';
    engineSelect.value = 'browser';
    showToast('TinyPNG 加载失败，已自动切换到浏览器压缩引擎', 'error');
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

function initDragDrop() {
  dropZone.addEventListener('click', () => fileInput.click());
  
  fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
    fileInput.value = '';
  });

  document.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dropOverlay.classList.add('show');
  });

  document.addEventListener('dragleave', (e) => {
    if (e.relatedTarget === null) {
      dropOverlay.classList.remove('show');
    }
  });

  document.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  document.addEventListener('drop', (e) => {
    e.preventDefault();
    dropOverlay.classList.remove('show');
    handleFiles(e.dataTransfer.files);
  });
}

function initButtons() {
  compressAllBtn.addEventListener('click', compressAll);
  downloadAllBtn.addEventListener('click', downloadAll);
  clearAllBtn.addEventListener('click', clearAll);
}

function handleFiles(files) {
  const validFiles = Array.from(files).filter(file => {
    const type = file.type.toLowerCase();
    return type === 'image/png' || type === 'image/jpeg' || type === 'image/webp';
  });

  if (validFiles.length === 0) {
    showToast('请选择有效的图片文件 (PNG/JPG/WEBP)', 'error');
    return;
  }

  validFiles.forEach(file => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    const imageData = {
      id,
      file,
      name: file.name,
      originalSize: file.size,
      compressedSize: 0,
      quality: 80,
      status: 'pending',
      blob: null,
      thumbUrl: null
    };
    
    imageList.push(imageData);
    createImageCard(imageData);
    generateThumbnail(imageData);
  });

  updateStats();
  updateButtons();
  showToast(`已添加 ${validFiles.length} 个文件`, 'success');
}

function generateThumbnail(imageData) {
  const reader = new FileReader();
  reader.onload = (e) => {
    imageData.thumbUrl = e.target.result;
    const thumbEl = document.querySelector(`[data-id="${imageData.id}"] .image-thumb img`);
    if (thumbEl) {
      thumbEl.src = e.target.result;
    }
  };
  reader.readAsDataURL(imageData.file);
}

function createImageCard(imageData) {
  const card = document.createElement('div');
  card.className = 'image-card';
  card.dataset.id = imageData.id;
  
  card.innerHTML = `
    <div class="image-thumb">
      <img src="" alt="${imageData.name}">
    </div>
    <div class="image-info">
      <p class="image-name">${imageData.name}</p>
      <div class="image-stats">
        <span class="original-size">原始: ${formatSize(imageData.originalSize)}</span>
        <span class="compressed-size" style="display: none;">压缩后: --</span>
        <span class="rate" style="display: none;">--</span>
      </div>
      <div class="quality-control">
        <span class="quality-label">质量:</span>
        <input type="range" class="quality-slider" min="35" max="100" value="${imageData.quality}">
        <span class="quality-value">${imageData.quality}%</span>
      </div>
    </div>
    <div class="image-actions">
      <div class="image-status">待压缩</div>
      <button class="btn btn-small btn-download" style="display: none;">下载</button>
      <button class="btn btn-small">删除</button>
    </div>
  `;

  const slider = card.querySelector('.quality-slider');
  const qualityValue = card.querySelector('.quality-value');
  slider.addEventListener('input', (e) => {
    imageData.quality = parseInt(e.target.value);
    qualityValue.textContent = `${imageData.quality}%`;
  });

  const deleteBtn = card.querySelector('.image-actions .btn:last-child');
  deleteBtn.addEventListener('click', () => removeImage(imageData.id));

  const downloadBtn = card.querySelector('.btn-download');
  downloadBtn.addEventListener('click', () => downloadSingle(imageData.id));

  imageListEl.appendChild(card);
}

function removeImage(id) {
  const index = imageList.findIndex(img => img.id === id);
  if (index > -1) {
    if (imageList[index].thumbUrl) {
      URL.revokeObjectURL(imageList[index].thumbUrl);
    }
    imageList.splice(index, 1);
  }
  
  const card = document.querySelector(`[data-id="${id}"]`);
  if (card) {
    card.remove();
  }
  
  updateStats();
  updateButtons();
}

async function compressAll() {
  if (isCompressing) return;
  
  const pendingImages = imageList.filter(img => img.status === 'pending' || img.status === 'error');
  if (pendingImages.length === 0) {
    showToast('没有需要压缩的图片', 'error');
    return;
  }

  isCompressing = true;
  compressAllBtn.disabled = true;
  compressAllBtn.innerHTML = '<span class="btn-icon">⏳</span>压缩中...';

  for (const imageData of pendingImages) {
    await compressImage(imageData);
  }

  isCompressing = false;
  compressAllBtn.disabled = false;
  compressAllBtn.innerHTML = '<span class="btn-icon">📦</span>全部压缩';
  updateStats();
  updateButtons();
  showToast('压缩完成！', 'success');
}

async function compressImage(imageData) {
  const card = document.querySelector(`[data-id="${imageData.id}"]`);
  if (!card) return;

  card.classList.add('compressing');
  card.classList.remove('completed', 'error');
  
  const statusEl = card.querySelector('.image-status');
  statusEl.textContent = '压缩中...';
  statusEl.className = 'image-status compressing';

  try {
    if (currentEngine === 'tinypng' && TinyPNG) {
      // 使用 TinyPNG 引擎
      console.log('Using TinyPNG engine for compression');
      console.log('Image data:', imageData);
      try {
        const result = await TinyPNG.compress(imageData.file, {
          minimumQuality: 35,
          quality: imageData.quality
        });
        console.log('Compression result:', result);

        if (result.success) {
          imageData.blob = result.blob;
          imageData.compressedSize = result.compressedSize;
          imageData.status = 'completed';

          card.classList.remove('compressing');
          card.classList.add('completed');
          
          statusEl.textContent = '已完成 ✓';
          statusEl.className = 'image-status completed';

          const compressedSizeEl = card.querySelector('.compressed-size');
          const rateEl = card.querySelector('.rate');
          compressedSizeEl.style.display = 'inline';
          compressedSizeEl.textContent = `压缩后: ${formatSize(result.compressedSize)}`;
          rateEl.style.display = 'inline';
          rateEl.textContent = result.rateString;

          const downloadBtn = card.querySelector('.btn-download');
          downloadBtn.style.display = 'inline-flex';
        } else {
          console.error('Compression failed:', result.error);
          throw new Error('压缩失败: ' + (result.error ? result.error.message : '未知错误'));
        }
      } catch (error) {
        console.error('Compression error:', error);
        throw error;
      }
    } else {
      // 使用 browser-image-compression 引擎
      const options = {
        maxSizeMB: 10, // 增大最大大小限制
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        quality: imageData.quality / 100, // 正确应用质量参数
        compressFormat: imageData.file.type.includes('png') ? 'png' : 'jpeg',
        // PNG 压缩专门配置
        pngCompressionLevel: 9, // 最高压缩级别
        // JPEG 压缩专门配置
        jpegQuality: imageData.quality / 100
      };

      const compressedFile = await imageCompression(imageData.file, options);
      const blob = new Blob([compressedFile], { type: compressedFile.type });

      imageData.blob = blob;
      imageData.compressedSize = compressedFile.size;
      imageData.status = 'completed';

      card.classList.remove('compressing');
      card.classList.add('completed');
      
      statusEl.textContent = '已完成 ✓';
      statusEl.className = 'image-status completed';

      const compressedSizeEl = card.querySelector('.compressed-size');
      const rateEl = card.querySelector('.rate');
      compressedSizeEl.style.display = 'inline';
      compressedSizeEl.textContent = `压缩后: ${formatSize(compressedFile.size)}`;
      rateEl.style.display = 'inline';
      rateEl.textContent = `${(compressedFile.size / imageData.originalSize * 100).toFixed(2)}%`;

      const downloadBtn = card.querySelector('.btn-download');
      downloadBtn.style.display = 'inline-flex';
    }
  } catch (error) {
    console.error('Compress error:', error);
    imageData.status = 'error';
    
    card.classList.remove('compressing');
    card.classList.add('error');
    
    statusEl.textContent = '压缩失败';
    statusEl.className = 'image-status error';
  }
}

function downloadSingle(id) {
  const imageData = imageList.find(img => img.id === id);
  if (!imageData || !imageData.blob) return;

  const url = URL.createObjectURL(imageData.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = getCompressedName(imageData.name);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToast('下载成功', 'success');
}

async function downloadAll() {
  const completedImages = imageList.filter(img => img.status === 'completed' && img.blob);
  if (completedImages.length === 0) {
    showToast('没有可下载的图片', 'error');
    return;
  }

  if (completedImages.length === 1) {
    downloadSingle(completedImages[0].id);
    return;
  }

  try {
    const zip = new JSZip();
    
    completedImages.forEach(img => {
      zip.file(getCompressedName(img.name), img.blob);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compressed_images_${Date.now()}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showToast('打包下载成功', 'success');
  } catch (error) {
    console.error('Download all error:', error);
    showToast('打包下载失败', 'error');
  }
}

function clearAll() {
  imageList.forEach(img => {
    if (img.thumbUrl) {
      URL.revokeObjectURL(img.thumbUrl);
    }
  });
  imageList.length = 0;
  imageListEl.innerHTML = '';
  updateStats();
  updateButtons();
  showToast('已清空列表', 'success');
}

function updateStats() {
  const totalCount = imageList.length;
  const completedImages = imageList.filter(img => img.status === 'completed');
  
  const totalOriginal = imageList.reduce((sum, img) => sum + img.originalSize, 0);
  const totalCompressed = completedImages.reduce((sum, img) => sum + img.compressedSize, 0);
  
  let savedPercent = 0;
  if (totalOriginal > 0 && totalCompressed > 0) {
    savedPercent = Math.round((1 - totalCompressed / totalOriginal) * 100);
  }

  document.getElementById('totalCount').textContent = totalCount;
  document.getElementById('totalOriginal').textContent = formatSize(totalOriginal);
  document.getElementById('totalCompressed').textContent = formatSize(totalCompressed);
  document.getElementById('totalSaved').textContent = `${savedPercent}%`;
}

function updateButtons() {
  const hasImages = imageList.length > 0;
  const hasPending = imageList.some(img => img.status === 'pending' || img.status === 'error');
  const hasCompleted = imageList.some(img => img.status === 'completed');

  compressAllBtn.disabled = !hasPending || isCompressing;
  downloadAllBtn.disabled = !hasCompleted;
  clearAllBtn.disabled = !hasImages;
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function getCompressedName(name) {
  const lastDot = name.lastIndexOf('.');
  if (lastDot > 0) {
    return name.substring(0, lastDot) + '_compressed' + name.substring(lastDot);
  }
  return name + '_compressed';
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast-message ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  
  setTimeout(() => toast.classList.add('show'), 10);
  
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

init();
