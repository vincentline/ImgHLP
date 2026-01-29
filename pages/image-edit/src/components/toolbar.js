/**
 * 工具栏组件
 * 负责工具栏的交互逻辑，包括打开文件、添加文字、群组、取消群组、导出等功能
 */

class Toolbar {
  constructor(editor) {
    this.editor = editor;
    this.bindEvents();
  }

  /**
   * 绑定工具栏事件
   */
  bindEvents() {
    // 打开文件按钮
    document.getElementById('openFileBtn').addEventListener('click', () => {
      document.getElementById('fileInput').click();
    });

    // 文件输入事件
    document.getElementById('fileInput').addEventListener('change', (e) => {
      this.handleFileInput(e);
    });

    // 拖放事件
    this.bindDragAndDropEvents();

    // 添加文字按钮
    document.getElementById('addTextBtn').addEventListener('click', () => {
      this.editor.textManager.addText();
    });

    // 群组按钮
    document.getElementById('groupBtn').addEventListener('click', () => {
      this.editor.layerManager.groupLayers();
    });

    // 取消群组按钮
    document.getElementById('ungroupBtn').addEventListener('click', () => {
      const activeLayer = this.editor.layerManager.getActiveLayer();
      if (activeLayer && activeLayer.type === 'group') {
        this.editor.layerManager.ungroupLayers(activeLayer.id);
      }
    });

    // 导出按钮
    document.getElementById('exportBtn').addEventListener('click', async () => {
      const blob = await this.editor.exportManager.exportImage('png', 1);
      this.editor.exportManager.downloadImage(blob, 'image-edit-export.png');
    });

    // 工作区应用按钮
    document.getElementById('applyWorkspaceBtn').addEventListener('click', () => {
      this.applyWorkspaceSettings();
    });
  }

  /**
   * 处理文件输入
   * @param {Event} e 文件输入事件
   */
  handleFileInput(e) {
    const files = e.target.files;
    if (files.length > 0) {
      this.processFiles(Array.from(files));
    }
  }

  /**
   * 绑定拖放事件
   */
  bindDragAndDropEvents() {
    const canvasArea = document.getElementById('canvasArea');

    // 拖放进入事件
    canvasArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      canvasArea.style.border = '2px dashed #409eff';
    });

    // 拖放离开事件
    canvasArea.addEventListener('dragleave', () => {
      canvasArea.style.border = 'none';
    });

    // 拖放释放事件
    canvasArea.addEventListener('drop', (e) => {
      e.preventDefault();
      canvasArea.style.border = 'none';
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.processFiles(Array.from(files));
      }
    });
  }

  /**
   * 处理文件
   * @param {Array} files 文件数组
   */
  async processFiles(files) {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        await this.loadImage(file);
      }
    }
  }

  /**
   * 加载图片
   * @param {File} file 图片文件
   */
  async loadImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // 创建Konva图片对象
          const image = new Konva.Image({
            image: img,
            draggable: true,
            rotation: 0,
            name: 'image'
          });

          // 计算图片位置，居中显示
          const workspace = this.editor.canvasManager.getWorkspaceSize();
          const x = (workspace.width - img.width) / 2;
          const y = (workspace.height - img.height) / 2;
          image.position({ x, y });

          // 如果是空白情况，自动调整工作区尺寸为图片尺寸
          if (this.editor.layerManager.getAllLayers().length === 0) {
            this.editor.canvasManager.setWorkspaceSize(img.width, img.height);
          }

          // 添加变换控件
          this.addTransformControls(image);

          // 添加到画布
          this.editor.canvasManager.addShape(image);

          // 添加到图层管理
          this.editor.layerManager.addLayer({
            name: file.name,
            type: 'image',
            shape: image
          });

          resolve();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * 添加变换控件
   * @param {Konva.Node} node Konva节点
   */
  addTransformControls(node) {
    const stage = this.editor.canvasManager.getStage();
    const layer = this.editor.canvasManager.getLayer();

    // 创建变换控件
    const transformer = new Konva.Transformer({
      nodes: [node],
      rotateEnabled: true,
      scaleEnabled: true,
      draggable: true,
      keepRatio: false
    });

    layer.add(transformer);

    // 监听选择事件
    stage.on('click tap', (e) => {
      // 只有点击在图片上时才显示变换控件
      if (e.target === node) {
        transformer.nodes([node]);
        this.editor.layerManager.setActiveLayer(node.id());
      } else if (e.target !== transformer) {
        transformer.nodes([]);
      }
      layer.draw();
    });
  }

  /**
   * 应用工作区设置
   */
  applyWorkspaceSettings() {
    const width = parseInt(document.getElementById('workspaceWidth').value) || 500;
    const height = parseInt(document.getElementById('workspaceHeight').value) || 500;
    
    this.editor.canvasManager.setWorkspaceSize(width, height);
  }
}

export default Toolbar;