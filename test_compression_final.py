from playwright.sync_api import sync_playwright
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # 导航到PNG压缩页面
    page.goto('http://localhost:8085/png-compress/index.html')
    page.wait_for_load_state('networkidle')
    
    # 等待TinyPNG加载
    page.wait_for_timeout(3000)
    
    # 检查TinyPNG是否加载成功
    tinypng_loaded = page.evaluate("() => typeof TinyPNG !== 'undefined'")
    print(f"TinyPNG loaded: {tinypng_loaded}")
    
    if tinypng_loaded:
        # 准备测试图片路径
        test_image_path = os.path.abspath('docs/favicon.png')
        print(f"Testing with image: {test_image_path}")
        
        # 上传图片
        file_input = page.locator('#fileInput')
        file_input.set_input_files(test_image_path)
        
        # 等待图片上传完成
        page.wait_for_timeout(2000)
        
        # 检查是否有图片卡片生成
        image_cards = page.locator('.image-card').count()
        print(f"Number of image cards: {image_cards}")
        
        if image_cards > 0:
            # 点击压缩按钮
            compress_button = page.locator('#compressAllBtn')
            compress_button.click()
            
            # 等待压缩完成
            page.wait_for_timeout(5000)
            
            # 检查压缩状态
            status_elements = page.locator('.image-status')
            for i in range(status_elements.count()):
                status = status_elements.nth(i).text_content()
                print(f"Image {i+1} status: {status}")
            
            # 检查是否有压缩后的大小显示
            compressed_size_elements = page.locator('.compressed-size')
            for i in range(compressed_size_elements.count()):
                size = compressed_size_elements.nth(i).text_content()
                print(f"Image {i+1} compressed size: {size}")
    
    # 截图
    page.screenshot(path='f:\\my_tools\\ImgHLP\\final_test_screenshot.png')
    print("Screenshot saved to final_test_screenshot.png")
    
    browser.close()