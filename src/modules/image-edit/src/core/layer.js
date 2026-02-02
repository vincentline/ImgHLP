/**
 * 图层管理模块
 * 负责管理画布上的图层，处理图层的添加、删除、排序等操作
 */

class LayerManager {
  constructor() {
    this.layers = [];
    this.activeLayerId = null;
    this.layerCounter = 0;
  }

  /**
   * 添加图层
   * @param {Object} layerData 图层数据
   * @returns {string} 图层ID
   */
  addLayer(layerData) {
    const layerId = `layer_${this.layerCounter++}`;
    const newLayer = {
      id: layerId,
      name: layerData.name || `图层 ${this.layerCounter}`,
      type: layerData.type || 'image',
      shape: layerData.shape,
      visible: true,
      locked: false
    };
    
    this.layers.push(newLayer);
    this.setActiveLayer(layerId);
    this.updateLayersList();
    return layerId;
  }

  /**
   * 移除图层
   * @param {string} layerId 图层ID
   */
  removeLayer(layerId) {
    const index = this.layers.findIndex(layer => layer.id === layerId);
    if (index !== -1) {
      // 移除图层
      this.layers.splice(index, 1);
      
      // 更新活动图层
      if (this.activeLayerId === layerId) {
        this.activeLayerId = this.layers.length > 0 ? this.layers[this.layers.length - 1].id : null;
      }
      
      this.updateLayersList();
    }
  }

  /**
   * 设置活动图层
   * @param {string} layerId 图层ID
   */
  setActiveLayer(layerId) {
    this.activeLayerId = layerId;
    this.updateLayersList();
  }

  /**
   * 获取活动图层
   * @returns {Object} 活动图层
   */
  getActiveLayer() {
    return this.layers.find(layer => layer.id === this.activeLayerId);
  }

  /**
   * 移动图层到上层
   * @param {string} layerId 图层ID
   */
  moveLayerUp(layerId) {
    const index = this.layers.findIndex(layer => layer.id === layerId);
    if (index < this.layers.length - 1) {
      // 交换位置
      [this.layers[index], this.layers[index + 1]] = [this.layers[index + 1], this.layers[index]];
      this.updateLayersOrder();
      this.updateLayersList();
    }
  }

  /**
   * 移动图层到下层
   * @param {string} layerId 图层ID
   */
  moveLayerDown(layerId) {
    const index = this.layers.findIndex(layer => layer.id === layerId);
    if (index > 0) {
      // 交换位置
      [this.layers[index], this.layers[index - 1]] = [this.layers[index - 1], this.layers[index]];
      this.updateLayersOrder();
      this.updateLayersList();
    }
  }

  /**
   * 更新图层顺序
   */
  updateLayersOrder() {
    // 按照图层顺序重新排列Konva对象
    this.layers.forEach((layer, index) => {
      if (layer.shape) {
        layer.shape.moveToTop();
      }
    });
  }

  /**
   * 更新图层面板
   */
  updateLayersList() {
    const layersList = document.getElementById('layersList');
    if (!layersList) return;

    // 清空列表
    layersList.innerHTML = '';

    // 反向遍历，因为Konva的z-index是从上到下递增的
    for (let i = this.layers.length - 1; i >= 0; i--) {
      const layer = this.layers[i];
      const layerItem = document.createElement('div');
      layerItem.className = `layer-item ${layer.id === this.activeLayerId ? 'active' : ''}`;
      layerItem.dataset.layerId = layer.id;
      
      // 图层图标
      const layerIcon = document.createElement('span');
      layerIcon.className = 'layer-icon';
      layerIcon.textContent = layer.type === 'text' ? 'T' : '🖼️';
      
      // 图层名称
      const layerName = document.createElement('span');
      layerName.className = 'layer-name';
      layerName.textContent = layer.name;
      
      // 组装图层项
      layerItem.appendChild(layerIcon);
      layerItem.appendChild(layerName);
      
      // 点击事件
      layerItem.addEventListener('click', () => {
        this.setActiveLayer(layer.id);
      });
      
      layersList.appendChild(layerItem);
    }
  }

  /**
   * 根据类型获取图层
   * @param {string} type 图层类型
   * @returns {Array} 图层数组
   */
  getLayersByType(type) {
    return this.layers.filter(layer => layer.type === type);
  }

  /**
   * 群组选中的图层
   * @returns {string} 群组图层ID
   */
  groupLayers() {
    const activeLayer = this.getActiveLayer();
    if (!activeLayer) return null;

    // 这里简化处理，只群组当前活动图层
    // 实际应用中可以群组多个选中的图层
    const groupId = `group_${this.layerCounter++}`;
    const groupLayer = {
      id: groupId,
      name: `群组 ${this.layerCounter}`,
      type: 'group',
      shape: activeLayer.shape,
      visible: true,
      locked: false
    };

    this.layers.push(groupLayer);
    this.setActiveLayer(groupId);
    this.updateLayersList();
    return groupId;
  }

  /**
   * 取消群组
   * @param {string} groupId 群组ID
   */
  ungroupLayers(groupId) {
    const groupLayer = this.layers.find(layer => layer.id === groupId);
    if (!groupLayer || groupLayer.type !== 'group') return;

    // 移除群组图层
    this.removeLayer(groupId);
  }

  /**
   * 清空所有图层
   */
  clearLayers() {
    this.layers = [];
    this.activeLayerId = null;
    this.updateLayersList();
  }

  /**
   * 获取所有图层
   * @returns {Array} 图层数组
   */
  getAllLayers() {
    return this.layers;
  }
}

export default LayerManager;