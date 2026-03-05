from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    page = browser.new_page()
    
    # 导航到我们的PNG压缩页面
    page.goto('http://localhost:8085/png-compress/index.html')
    
    # 等待页面加载完成
    page.wait_for_load_state('networkidle')
    
    # 捕获控制台日志
    page.on('console', lambda msg: print(f"Console: {msg.text}"))
    
    # 等待3秒让所有脚本加载完成
    page.wait_for_timeout(3000)
    
    # 检查是否有错误
    errors = page.evaluate("() => window.errors || []")
    if errors:
        print(f"Errors found: {errors}")
    else:
        print("No errors found in console")
    
    # 检查TinyPNG是否加载成功
    tinypng_loaded = page.evaluate("() => typeof TinyPNG !== 'undefined'")
    print(f"TinyPNG loaded: {tinypng_loaded}")
    
    # 截图保存
    page.screenshot(path='f:\\my_tools\\ImgHLP\\test_screenshot.png')
    print("Screenshot saved to test_screenshot.png")
    
    browser.close()