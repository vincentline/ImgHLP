/**
 * 图层面板组件
 * 负责图层面板的交互逻辑，包括图层的选择、移动、删除等操作
 */

class LayersPanel {
  constructor(editor) {
    this.editor = editor;
    this.bindEvents();
  }

  /**
   * 绑定图层面板事件
   */
  bindEvents() {
    // 移动图层到上层
    document.getElementById('moveUpBtn').addEventListener('click', () => {
      const activeLayer = this.editor.layerManager.getActiveLayer();
      if (activeLayer) {
        this.editor.layerManager.moveLayerUp(activeLayer.id);
      }
    });

    // 移动图层到下层
    document.getElementById('moveDownBtn').addEventListener('click', () => {
      const activeLayer = this.editor.layerManager.getActiveLayer();
      if (activeLayer) {
        this.editor.layerManager.moveLayerDown(activeLayer.id);
      }
    });

    // 删除图层
    document.getElementById('deleteLayerBtn').addEventListener('click', () => {
      const activeLayer = this.editor.layerManager.getActiveLayer();
      if (activeLayer) {
        // 从画布中移除
        if (activeLayer.shape) {
          this.editor.canvasManager.removeShape(activeLayer.shape);
        }
        // 从图层管理中移除
        this.editor.layerManager.removeLayer(activeLayer.id);
      }
    });
  }

  /**
   * 更新图层面板
   */
  update() {
    this.editor.layerManager.updateLayersList();
  }
}

export default LayersPanel;