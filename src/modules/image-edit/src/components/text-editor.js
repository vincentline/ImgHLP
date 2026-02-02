/**
 * 文字编辑器组件
 * 负责文字编辑器弹窗的交互逻辑，包括文字内容的编辑、样式的设置等功能
 */

class TextEditor {
  constructor(editor) {
    this.editor = editor;
    this.bindEvents();
  }

  /**
   * 绑定文字编辑器事件
   */
  bindEvents() {
    // 确定按钮事件
    document.getElementById('confirmTextEditBtn').addEventListener('click', () => {
      this.applyChanges();
    });

    // 取消按钮事件
    document.getElementById('cancelTextEditBtn').addEventListener('click', () => {
      this.hideModal();
    });

    // 点击弹窗外部关闭
    document.getElementById('textEditorModal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.hideModal();
      }
    });
  }

  /**
   * 显示文字编辑器弹窗
   * @param {Object} textData 文字数据对象
   */
  showModal(textData) {
    console.log('Text data:', textData);
    
    const modal = document.getElementById('textEditorModal');
    const contentInput = document.getElementById('textContent');
    const sizeInput = document.getElementById('textSize');
    const weightSelect = document.getElementById('textWeight');
    const alignSelect = document.getElementById('textAlign');
    const styleInput = document.getElementById('textStyle');

    // 填充当前文字属性
    contentInput.value = textData.text || '';
    sizeInput.value = textData.fontSize || 24;
    weightSelect.value = textData.fontWeight || 'normal';
    alignSelect.value = textData.align || 'left';
    styleInput.value = ''; // 清空样式输入

    // 存储当前编辑的文字对象
    this.currentText = textData;

    // 显示弹窗
    modal.style.display = 'flex';
  }

  /**
   * 隐藏文字编辑器弹窗
   */
  hideModal() {
    document.getElementById('textEditorModal').style.display = 'none';
    this.currentText = null;
  }

  /**
   * 应用文字编辑
   */
  applyChanges() {
    if (!this.currentText) return;

    const contentInput = document.getElementById('textContent');
    const sizeInput = document.getElementById('textSize');
    const weightSelect = document.getElementById('textWeight');
    const alignSelect = document.getElementById('textAlign');
    const styleInput = document.getElementById('textStyle');

    // 获取原始text对象
    const originalText = this.currentText._originalText;
    console.log('Original text:', originalText);
    
    // 更新文字属性
    if (originalText) {
      originalText.text(contentInput.value);
      originalText.fontSize(parseInt(sizeInput.value));
      if (typeof originalText.fontWeight === 'function') {
        originalText.fontWeight(weightSelect.value);
      } else if (originalText.attrs) {
        originalText.attrs.fontWeight = weightSelect.value;
      }
      originalText.align(alignSelect.value);
    }

    // 应用CSS样式
    const cssStyle = styleInput.value.trim();
    if (cssStyle) {
      // 这里简化处理，实际应用中可以解析CSS样式并应用到文字
      console.log('应用CSS样式:', cssStyle);
    }

    // 重绘图层
    this.editor.canvasManager.getLayer().draw();

    // 隐藏弹窗
    this.hideModal();
  }
}

export default TextEditor;