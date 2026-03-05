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
    
    time.sleep(2)
    
    print("\n=== Console Messages ===")
    for msg in console_messages:
        print(msg)
    
    print("\n=== Errors ===")
    if errors:
        for err in errors:
            print(f"ERROR: {err}")
    else:
        print("No errors found!")
    
    page.screenshot(path='f:/my_tools/ImgHLP/docs/png-compress/screenshot.png', full_page=True)
    print("\nScreenshot saved to docs/png-compress/screenshot.png")
    
    browser.close()
