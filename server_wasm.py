#!/usr/bin/env python3
"""
Custom HTTP server that properly handles WASM files with correct MIME type
"""

import http.server
import socketserver
import mimetypes
import os

# Add WASM MIME type
mimetypes.add_type('application/wasm', '.wasm')

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='docs', **kwargs)

    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    PORT = 8085
    
    # Clear any existing servers on this port
    os.system('netstat -ano | findstr :8085')
    
    try:
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"Server running at http://localhost:{PORT}")
            print("Serving from 'docs' directory")
            print("WASM MIME type is properly configured")
            httpd.serve_forever()
    except OSError as e:
        print(f"Error starting server: {e}")
        print("Trying port 8086...")
        PORT = 8086
        with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
            print(f"Server running at http://localhost:{PORT}")
            print("Serving from 'docs' directory")
            print("WASM MIME type is properly configured")
            httpd.serve_forever()
