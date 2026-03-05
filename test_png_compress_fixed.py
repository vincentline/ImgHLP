from playwright.sync_api import sync_playwright
import time

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
    
    # Test file upload
    print("\nTesting file upload...")
    try:
        # Upload a test file
        file_input = page.locator('input[type="file"]')
        file_input.set_input_files('f:\\my_tools\\ImgHLP\\docs\\favicon.png')
        
        # Wait for image card to appear
        page.wait_for_selector('.image-card', timeout=5000)
        print("✓ Image card created successfully")
        
        # Click compress button
        page.click('#compressAllBtn')
        print("✓ Compress button clicked")
        
        # Wait for compression to complete
        time.sleep(3)
        
        # Check for compression result
        status_elements = page.locator('.image-status').all()
        for i, status in enumerate(status_elements):
            text = status.text_content()
            print(f"Image {i+1} status: {text}")
            
    except Exception as e:
        print(f"Test error: {e}")
    
    # Capture final console messages
    time.sleep(2)
    print("\n=== Final Console Messages ===")
    for msg in console_messages[len(console_messages)//2:]:
        print(msg)
    
    browser.close()
