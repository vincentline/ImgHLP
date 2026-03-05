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
    
    print("\n=== All Console Messages ===")
    for msg in console_messages:
        print(msg)
    
    print("\n=== All Errors ===")
    for err in errors:
        print(f"ERROR: {err}")
    
    # Check if TinyPNG is available
    print("\n=== Checking TinyPNG availability ===")
    try:
        result = page.evaluate("typeof window.TinyPNG")
        print(f"window.TinyPNG type: {result}")
        
        if result == 'object':
            methods = page.evaluate("Object.keys(window.TinyPNG)")
            print(f"TinyPNG methods: {methods}")
        else:
            print("TinyPNG is not defined")
            
    except Exception as e:
        print(f"Error checking TinyPNG: {e}")
    
    # Check module import
    print("\n=== Checking module import ===")
    try:
        result = page.evaluate("""
            async function() {
                try {
                    const module = await import('./lib/index.js');
                    return { success: true, module: typeof module.default };
                } catch (error) {
                    return { success: false, error: error.message };
                }
            }
        """)
        print(f"Module import result: {result}")
    except Exception as e:
        print(f"Error checking module import: {e}")
    
    browser.close()
