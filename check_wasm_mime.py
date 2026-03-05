import urllib.request

# 检查WASM文件的MIME类型
url = 'http://localhost:8085/png-compress/lib/tinypng_lib_wasm_bg.wasm'

with urllib.request.urlopen(url) as response:
    print(f"Status code: {response.status}")
    print(f"Content-Type: {response.getheader('Content-Type')}")
    print(f"All headers: {dict(response.getheaders())}")