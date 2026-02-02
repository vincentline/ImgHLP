/**
 * 画布管理模块
 * 负责创建和管理Konva画布，处理画布的缩放、移动等操作
 */

import Konva from 'konva';

class CanvasManager {
  constructor(containerId) {
    this.containerId = containerId;
    this.stage = null;
    this.layer = null;
    this.workspace = {
      width: 500,
      height: 500
    };
    this.scale = 1;
    this.offset = { x: 0, y: 0 };
    this.isDragging = false;
    this.lastPos = { x: 0, y: 0 };
  }

  /**
   * 初始化画布
   */
  init() {
    // 创建Konva舞台
    this.stage = new Konva.Stage({
      container: this.containerId,
      width: window.innerWidth,
      height: window.innerHeight - 60, // 减去工具栏高度
      draggable: false
    });

    // 创建主图层
    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    // 添加背景网格
    this.addGrid();

    // 绑定事件
    this.bindEvents();

    // 更新工作区边界
    this.updateWorkspaceBoundary();

    // 居中显示工作区
    this.centerWorkspace();
  }

  /**
   * 添加背景网格
   */
  addGrid() {
    const grid = new Konva.Rect({
      x: -10000,
      y: -10000,
      width: 20000,
      height: 20000,
      fillPatternImage: this.createGridPattern(),
      fillPatternScale: { x: 1, y: 1 }
    });
    this.layer.add(grid);
    this.layer.draw();
  }

  /**
   * 创建网格图案
   */
  createGridPattern() {
    const canvas = document.createElement('canvas');
    canvas.width = 20;
    canvas.height = 20;
    const ctx = canvas.getContext('2d');

    // 设置背景色为 #fcfcfc
    ctx.fillStyle = '#fcfcfc';
    ctx.fillRect(0, 0, 20, 20);

    // 绘制点阵图案
    ctx.fillStyle = '#e0e0e0';
    ctx.beginPath();
    ctx.arc(2, 2, 0.5, 0, Math.PI * 2);
    ctx.fill();

    return canvas;
  }

  /**
   * 绑定事件
   */
  bindEvents() {
    // 鼠标按下事件
    this.stage.on('mousedown', (e) => {
      // 只有在空白区域点击且是中键时才开始拖拽
      if (e.target === this.stage && e.evt.button === 1) {
        e.evt.preventDefault(); // 阻止默认行为，避免页面滚动
        this.isDragging = true;
        this.lastPos = { x: e.evt.clientX, y: e.evt.clientY };
        this.stage.container().style.cursor = 'grabbing';
      }
    });

    // 鼠标移动事件
    this.stage.on('mousemove', (e) => {
      if (this.isDragging) {
        const dx = e.evt.clientX - this.lastPos.x;
        const dy = e.evt.clientY - this.lastPos.y;
        
        this.offset.x += dx;
        this.offset.y += dy;
        
        this.stage.position({
          x: this.offset.x,
          y: this.offset.y
        });
        
        this.lastPos = { x: e.evt.clientX, y: e.evt.clientY };
      } else if (e.target === this.stage) {
        this.stage.container().style.cursor = 'default';
      } else {
        this.stage.container().style.cursor = 'default';
      }
    });

    // 鼠标释放事件
    this.stage.on('mouseup mouseleave', () => {
      this.isDragging = false;
      this.stage.container().style.cursor = 'default';
    });

    // 滚轮缩放事件
    this.stage.on('wheel', (e) => {
      e.evt.preventDefault();
      
      const scaleBy = 1.1;
      const stage = e.target.getStage();
      const oldScale = stage.scaleX();
      
      const pointer = stage.getPointerPosition();
      const mousePointTo = {
        x: (pointer.x - stage.x()) / oldScale,
        y: (pointer.y - stage.y()) / oldScale
      };
      
      const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
      this.scale = newScale;
      
      stage.scale({ x: newScale, y: newScale });
      
      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale
      };
      
      stage.position(newPos);
      this.offset = newPos;
      stage.batchDraw();
    });

    // 窗口大小改变事件
    window.addEventListener('resize', () => {
      this.stage.width(window.innerWidth);
      this.stage.height(window.innerHeight - 60);
      this.stage.draw();
    });
  }

  /**
   * 设置工作区大小
   * @param {number} width 工作区宽度
   * @param {number} height 工作区高度
   */
  setWorkspaceSize(width, height) {
    this.workspace.width = width;
    this.workspace.height = height;
    this.updateWorkspaceBoundary();
  }

  /**
   * 更新工作区边界
   */
  updateWorkspaceBoundary() {
    const boundary = document.getElementById('workspaceBoundary');
    if (boundary) {
      boundary.style.width = `${this.workspace.width}px`;
      boundary.style.height = `${this.workspace.height}px`;
      boundary.style.left = '0';
      boundary.style.top = '0';
    }
  }

  /**
   * 添加图形到画布
   * @param {Konva.Shape} shape 要添加的图形
   */
  addShape(shape) {
    this.layer.add(shape);
    this.layer.draw();
  }

  /**
   * 移除图形从画布
   * @param {Konva.Shape} shape 要移除的图形
   */
  removeShape(shape) {
    shape.remove();
    this.layer.draw();
  }

  /**
   * 清除画布
   */
  clear() {
    this.layer.removeChildren();
    this.addGrid();
    this.layer.draw();
  }

  /**
   * 获取当前图层
   * @returns {Konva.Layer} 当前图层
   */
  getLayer() {
    return this.layer;
  }

  /**
   * 获取当前舞台
   * @returns {Konva.Stage} 当前舞台
   */
  getStage() {
    return this.stage;
  }

  /**
   * 获取工作区大小
   * @returns {Object} 工作区大小
   */
  getWorkspaceSize() {
    return this.workspace;
  }

  /**
   * 重置画布
   */
  reset() {
    this.scale = 1;
    this.offset = { x: 0, y: 0 };
    this.stage.scale({ x: 1, y: 1 });
    this.stage.position({ x: 0, y: 0 });
    this.stage.draw();
  }

  /**
   * 居中显示工作区
   */
  centerWorkspace() {
    const stageWidth = this.stage.width();
    const stageHeight = this.stage.height();
    
    const offsetX = (stageWidth - this.workspace.width) / 2;
    const offsetY = (stageHeight - this.workspace.height) / 2;
    
    this.offset = { x: offsetX, y: offsetY };
    this.stage.position(this.offset);
    this.stage.draw();
  }
}

export default CanvasManager;