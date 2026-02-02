/**
 * 文字管理模块
 * 负责文字的添加、编辑、样式设置等操作
 */

import Konva from 'konva';

class TextManager {
  constructor(canvasManager, layerManager, textEditor) {
    this.canvasManager = canvasManager;
    this.layerManager = layerManager;
    this.textEditor = textEditor;
    this.textCounter = 0;
  }

  /**
   * 添加文字
   * @param {Object} textData 文字数据
   * @returns {string} 文字图层ID
   */
  addText(textData = {}) {
    const defaults = {
      text: '双击编辑文字',
      x: 50,
      y: 50,
      fontSize: 24,
      fontWeight: 'normal',
      align: 'left',
      fill: '#000000',
      fontFamily: 'Arial, sans-serif'
    };

    const options = { ...defaults, ...textData };
    const textId = `text_${this.textCounter++}`;

    // 创建Konva文字对象
    const text = new Konva.Text({
      id: textId,
      text: options.text,
      x: options.x,
      y: options.y,
      fontSize: options.fontSize,
      fontWeight: options.fontWeight,
      align: options.align,
      fill: options.fill,
      fontFamily: options.fontFamily,
      draggable: true,
      rotation: 0,
      name: 'text'
    });

    // 添加变换控件
    this.addTransformControls(text);

    // 双击编辑文字
    text.on('dblclick', () => {
      this.editText(text);
    });

    // 添加到画布
    this.canvasManager.addShape(text);

    // 添加到图层管理
    const layerId = this.layerManager.addLayer({
      name: `文字 ${this.textCounter}`,
      type: 'text',
      shape: text
    });

    return layerId;
  }

  /**
   * 编辑文字
   * @param {Konva.Text} text Konva文字对象
   */
  editText(text) {
    console.log('Editing text:', text);
    console.log('Text attrs:', text.attrs);
    
    // 使用textEditor显示弹窗
    if (this.textEditor) {
      // 传递一个包含文字属性的对象，而不是整个text对象
      this.textEditor.showModal({
        id: text.id(),
        text: text.text(),
        fontSize: text.fontSize(),
        fontWeight: typeof text.fontWeight === 'function' ? text.fontWeight() : (text.attrs ? text.attrs.fontWeight : 'normal'),
        align: text.align(),
        fill: text.fill(),
        fontFamily: text.fontFamily(),
        x: text.x(),
        y: text.y(),
        rotation: text.rotation(),
        // 保存原始text对象，以便在应用更改时使用
        _originalText: text
      });
    }
  }

  /**
   * 添加变换控件
   * @param {Konva.Node} node Konva节点
   */
  addTransformControls(node) {
    const stage = this.canvasManager.getStage();
    const layer = this.canvasManager.getLayer();

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
      // 只有点击在文字上时才显示变换控件
      if (e.target === node) {
        transformer.nodes([node]);
        this.layerManager.setActiveLayer(node.id());
      } else if (e.target !== transformer) {
        transformer.nodes([]);
      }
      layer.draw();
    });
  }

  /**
   * 更新文字样式
   * @param {Konva.Text} text Konva文字对象
   * @param {Object} style 样式对象
   */
  updateTextStyle(text, style) {
    if (style.fontSize) text.fontSize(style.fontSize);
    if (style.fontWeight) {
      if (typeof text.fontWeight === 'function') {
        text.fontWeight(style.fontWeight);
      } else if (text.attrs) {
        text.attrs.fontWeight = style.fontWeight;
      }
    }
    if (style.align) text.align(style.align);
    if (style.fill) text.fill(style.fill);
    if (style.fontFamily) text.fontFamily(style.fontFamily);
    if (style.rotation) text.rotation(style.rotation);

    this.canvasManager.getLayer().draw();
  }

  /**
   * 删除文字
   * @param {string} textId 文字ID
   */
  deleteText(textId) {
    this.layerManager.removeLayer(textId);
  }

  /**
   * 获取所有文字图层
   * @returns {Array} 文字图层数组
   */
  getAllTextLayers() {
    return this.layerManager.getLayersByType('text');
  }
}

export default TextManager;