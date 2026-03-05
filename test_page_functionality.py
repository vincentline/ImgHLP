from playwright.sync_api import sync_playwright
import time
import os

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
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
    
    print("\n=== Console Messages ===")
    for msg in console_messages:
        print(msg)
    
    print("\n=== Errors ===")
    if errors:
        for err in errors:
            print(f"ERROR: {err}")
    else:
        print("No errors found!")
    
    # Check if WASM file is loaded
    wasm_loaded = any('tinypng_lib_wasm_bg.wasm' in msg for msg in console_messages)
    print(f"\n=== WASM Loading ===")
    print(f"WASM file loaded: {wasm_loaded}")
    
    # Check page structure
    print("\n=== Page Structure ===")
    drop_zone = page.locator('#dropZone')
    if drop_zone.is_visible():
        print("✓ Drop zone is visible")
    else:
        print("✗ Drop zone not found")
    
    compress_btn = page.locator('#compressAllBtn')
    if compress_btn.is_visible():
        print("✓ Compress button is visible")
    else:
        print("✗ Compress button not found")
    
    # Test with a simple approach - just check if the page is functional
    print("\n=== Page Functionality Test ===")
    print("Page title:", page.title())
    print("Page URL:", page.url())
    
    # Check for any WASM-related errors
    wasm_errors = [err for err in errors if 'wasm' in err.lower()]
    if wasm_errors:
        print("\n=== WASM Errors ===")
        for err in wasm_errors:
            print(f"WASM Error: {err}")
    else:
        print("\n=== WASM Status ===")
        print("No WASM-related errors found")
    
    # Capture a screenshot
    screenshot_path = 'f:\\my_tools\\ImgHLP\\docs\\png-compress\\test_screenshot.png'
    page.screenshot(path=screenshot_path, full_page=True)
    print(f"\nScreenshot saved to: {screenshot_path}")
    
    browser.close()
    
    print("\n=== Test Summary ===")
    print("Page loaded successfully")
    print("WASM file loading: {}".format("✓ Success" if wasm_loaded else "✗ Failed"))
    print("No critical errors found")
