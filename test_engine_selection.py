from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    console_messages = []
    errors = []
    
    def handle_console(msg):
        console_messages.append(f"[{msg.type}] {msg.text}")
        if msg.type == 'error':
            errors.append(msg.text)
    
    page.on('console', handle_console)
    page.on('pageerror', lambda err: errors.append(f"Page Error: {err}"))
    
    print("Navigating to PNG compress page...")
    page.goto('http://localhost:8080/png-compress/')
    page.wait_for_load_state('networkidle')
    
    print("\n=== Testing TinyPNG engine ===")
    
    # Test file path
    test_file = 'f:\\my_tools\\ImgHLP\\docs\\favicon.png'
    
    # Test with TinyPNG engine and quality 35%
    print("\n1. Testing TinyPNG engine with quality 35%...")
    try:
        # Upload file
        file_input = page.locator('#fileInput')
        file_input.set_input_files(test_file)
        
        # Wait for image card
        page.wait_for_selector('.image-card', timeout=5000)
        
        # Set quality to 35%
        slider = page.locator('.quality-slider')
        slider.fill('35')
        slider.press('Enter')
        
        # Click compress
        compress_btn = page.locator('#compressAllBtn')
        compress_btn.click()
        
        # Wait for completion
        page.wait_for_selector('.image-card.completed', timeout=15000)
        
        # Get results
        compressed_size = page.locator('.compressed-size').text_content()
        rate = page.locator('.rate').text_content()
        
        print(f"   Compressed size: {compressed_size}")
        print(f"   Compression rate: {rate}")
        
    except Exception as e:
        print(f"   Error: {e}")
    
    # Clear list
    clear_btn = page.locator('#clearAllBtn')
    clear_btn.click()
    page.wait_for_selector('.image-card', state='detached', timeout=5000)
    
    # Test with TinyPNG engine and quality 100%
    print("\n2. Testing TinyPNG engine with quality 100%...")
    try:
        # Upload file again
        file_input = page.locator('#fileInput')
        file_input.set_input_files(test_file)
        
        # Wait for image card
        page.wait_for_selector('.image-card', timeout=5000)
        
        # Set quality to 100%
        slider = page.locator('.quality-slider')
        slider.fill('100')
        slider.press('Enter')
        
        # Click compress
        compress_btn = page.locator('#compressAllBtn')
        compress_btn.click()
        
        # Wait for completion
        page.wait_for_selector('.image-card.completed', timeout=15000)
        
        # Get results
        compressed_size = page.locator('.compressed-size').text_content()
        rate = page.locator('.rate').text_content()
        
        print(f"   Compressed size: {compressed_size}")
        print(f"   Compression rate: {rate}")
        
    except Exception as e:
        print(f"   Error: {e}")
    
    # Switch to browser engine
    print("\n3. Switching to Browser engine...")
    try:
        engine_select = page.locator('#engineSelect')
        engine_select.select_option('browser')
        print("   Switched to Browser engine")
    except Exception as e:
        print(f"   Error switching engine: {e}")
    
    # Clear list
    clear_btn = page.locator('#clearAllBtn')
    clear_btn.click()
    page.wait_for_selector('.image-card', state='detached', timeout=5000)
    
    # Test with Browser engine
    print("\n4. Testing Browser engine...")
    try:
        # Upload file
        file_input = page.locator('#fileInput')
        file_input.set_input_files(test_file)
        
        # Wait for image card
        page.wait_for_selector('.image-card', timeout=5000)
        
        # Click compress
        compress_btn = page.locator('#compressAllBtn')
        compress_btn.click()
        
        # Wait for completion
        page.wait_for_selector('.image-card.completed', timeout=15000)
        
        # Get results
        compressed_size = page.locator('.compressed-size').text_content()
        rate = page.locator('.rate').text_content()
        
        print(f"   Compressed size: {compressed_size}")
        print(f"   Compression rate: {rate}")
        
    except Exception as e:
        print(f"   Error: {e}")
    
    # Check for errors
    print("\n=== Console Errors ===")
    if errors:
        for err in errors:
            print(f"Error: {err}")
    else:
        print("No errors found!")
    
    # Check TinyPNG load status
    print("\n=== TinyPNG Load Status ===")
    try:
        tiny_png_loaded = page.evaluate("typeof window.TinyPNG !== 'undefined'")
        print(f"TinyPNG loaded: {tiny_png_loaded}")
    except Exception as e:
        print(f"Error checking TinyPNG: {e}")
    
    browser.close()
    
    print("\n=== Test Summary ===")
    print("Engine selection and compression test completed")
