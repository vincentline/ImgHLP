from playwright.sync_api import sync_playwright
import sys

# Example: Capturing console logs during browser automation

# 检查命令行参数
url = 'http://localhost:8085/png-compress/index.html'  # 默认URL
if len(sys.argv) > 2 and sys.argv[1] == '--url':
    url = sys.argv[2]

console_logs = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1920, 'height': 1080})

    # Set up console log capture
    def handle_console_message(msg):
        console_logs.append(f"[{msg.type}] {msg.text}")
        print(f"Console: [{msg.type}] {msg.text}")

    page.on("console", handle_console_message)

    # Navigate to page
    page.goto(url)
    page.wait_for_load_state('networkidle')

    # 等待页面加载完成，捕获控制台日志
    page.wait_for_timeout(3000)

    browser.close()

# Save console logs to file
import os
output_dir = os.path.join(os.getcwd(), 'outputs')
os.makedirs(output_dir, exist_ok=True)
output_path = os.path.join(output_dir, 'console.log')

with open(output_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(console_logs))

print(f"\nCaptured {len(console_logs)} console messages")
print(f"Logs saved to: {output_path}")