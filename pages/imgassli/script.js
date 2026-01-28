document.addEventListener('DOMContentLoaded', function() {
  let mergedResult = null;
  
  // 合并按钮点击事件
  document.getElementById('mergeBtn').addEventListener('click', async function() {
    const files = document.getElementById('fileInput').files;
    if (files.length === 0) {
      alert('请选择图片');
      return;
    }
    
    try {
      // 合并图片
      mergedResult = await PuzzleTool.merge(Array.from(files));
      
      // 显示拼图
      const mergedUrl = URL.createObjectURL(mergedResult.mergedImage);
      document.getElementById('mergedImage').src = mergedUrl;
      
      // 显示Alpha通道图
      const alphaUrl = URL.createObjectURL(mergedResult.alphaImage);
      document.getElementById('alphaImage').src = alphaUrl;
      
      // 显示位置信息
      document.getElementById('positionData').textContent = JSON.stringify(mergedResult.positionData, null, 2);
      
      alert('合并成功！');
    } catch (error) {
      console.error('合并失败:', error);
      alert('合并失败：' + error.message);
    }
  });
  
  // 切割按钮点击事件
  document.getElementById('splitBtn').addEventListener('click', async function() {
    if (!mergedResult) {
      alert('请先合并图片');
      return;
    }
    
    try {
      // 切割图片
      const cutImages = await PuzzleTool.split(mergedResult.mergedImage, mergedResult.positionData);
      
      // 显示切割结果
      const cutImagesContainer = document.getElementById('cutImages');
      cutImagesContainer.innerHTML = '';
      
      cutImages.forEach((item, index) => {
        const url = URL.createObjectURL(item.image);
        const img = document.createElement('img');
        img.src = url;
        img.alt = item.filename;
        img.style.margin = '10px';
        cutImagesContainer.appendChild(img);
      });
      
      alert('切割成功！');
    } catch (error) {
      console.error('切割失败:', error);
      alert('切割失败：' + error.message);
    }
  });
});