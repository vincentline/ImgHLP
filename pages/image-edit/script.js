/**
 * 主脚本文件
 * 负责整合所有模块，初始化编辑器
 */

import Konva from 'konva';
import CanvasManager from './src/core/canvas.js';
import LayerManager from './src/core/layer.js';
import TextManager from './src/core/text.js';
import ExportManager from './src/core/export.js';
import Toolbar from './src/components/toolbar.js';
import LayersPanel from './src/components/layers.js';
import TextEditor from './src/components/text-editor.js';

/**
 * 图片编辑器主类
 */
class ImageEditor {
  constructor() {
    this.canvasManager = null;
    this.layerManager = null;
    this.textManager = null;
    this.exportManager = null;
    this.toolbar = null;
    this.layersPanel = null;
    this.textEditor = null;
  }

  /**
   * 初始化编辑器
   */
  init() {
    // 初始化画布管理
    this.canvasManager = new CanvasManager('stage-container');
    this.canvasManager.init();

    // 初始化图层管理
    this.layerManager = new LayerManager();

    // 初始化导出管理
    this.exportManager = new ExportManager(this.canvasManager);

    // 初始化工具栏
    this.toolbar = new Toolbar(this);

    // 初始化图层面板
    this.layersPanel = new LayersPanel(this);

    // 初始化文字编辑器
    this.textEditor = new TextEditor(this);

    // 初始化文字管理
    this.textManager = new TextManager(this.canvasManager, this.layerManager, this.textEditor);

    // 绑定全局事件
    this.bindGlobalEvents();

    console.log('Image editor initialized successfully!');
  }

  /**
   * 绑定全局事件
   */
  bindGlobalEvents() {
    // 键盘事件
    document.addEventListener('keydown', (e) => {
      this.handleKeydown(e);
    });

    // 窗口大小改变事件
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  /**
   * 处理键盘事件
   * @param {KeyboardEvent} e 键盘事件
   */
  handleKeydown(e) {
    // Ctrl+Z 撤销
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
      // 这里可以添加撤销功能
      console.log('Undo');
    }

    // Ctrl+S 保存
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      // 这里可以添加保存功能
      console.log('Save');
    }

    // Delete 键删除选中图层
    if (e.key === 'Delete' || e.key === 'Backspace') {
      const activeLayer = this.layerManager.getActiveLayer();
      if (activeLayer) {
        if (activeLayer.shape) {
          this.canvasManager.removeShape(activeLayer.shape);
        }
        this.layerManager.removeLayer(activeLayer.id);
      }
    }
  }

  /**
   * 处理窗口大小改变事件
   */
  handleResize() {
    const stage = this.canvasManager.getStage();
    if (stage) {
      stage.width(window.innerWidth);
      stage.height(window.innerHeight - 60); // 减去工具栏高度
      stage.draw();
    }
  }
}

// 初始化编辑器
window.addEventListener('DOMContentLoaded', () => {
  const editor = new ImageEditor();
  editor.init();
  
  // 暴露编辑器实例到全局，方便调试
  window.editor = editor;
});