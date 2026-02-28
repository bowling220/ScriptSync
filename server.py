from flask import Flask, request, jsonify
import os
import json

app = Flask(__name__)
BASE_DIR = r"C:\RobloxTestAI"

@app.route('/export', methods=['POST'])
def export_scripts():
    data = request.json
    for path, content in data.items():
        # Clean paths to prevent directory traversal
        path = path.replace('/', os.sep)
        full_path = os.path.join(BASE_DIR, path)
        
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        
        # Write content
        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
    print(f"Exported {len(data)} scripts to {BASE_DIR}")
    return jsonify({"status": "success"})

@app.route('/import', methods=['GET'])
def import_scripts():
    data = {}
    if not os.path.exists(BASE_DIR):
        print(f"Directory {BASE_DIR} does not exist yet.")
        return jsonify(data)
        
    for root, _, files in os.walk(BASE_DIR):
        for file in files:
            if file.endswith('.lua'):
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, BASE_DIR).replace(os.sep, '/')
                
                with open(full_path, 'r', encoding='utf-8') as f:
                    data[rel_path] = f.read()
                    
    print(f"Importing {len(data)} scripts from {BASE_DIR}")
    return jsonify(data)

if __name__ == '__main__':
    # Ensure the directory exists
    os.makedirs(BASE_DIR, exist_ok=True)
    print(f"Starting OpenClaw Roblox Sync Server on port 8080...")
    print(f"Directory: {BASE_DIR}")
    # Run the server
    app.run(port=8080)
