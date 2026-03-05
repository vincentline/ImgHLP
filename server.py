#!/usr/bin/env python3
"""
Custom HTTP server that properly handles WASM files with correct MIME type
"""

import http.server
import socketserver
import mimetypes

# Add WASM MIME type
mimetypes.add_type('application/wasm', '.wasm')

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='docs', **kwargs)

if __name__ == '__main__':
    PORT = 3000
    
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}")
        print("Serving from 'docs' directory")
        print("WASM MIME type is properly configured")
        httpd.serve_forever()
