# ScriptSync for Roblox Studio

ScriptSync is a lightweight, easy-to-use plugin for Roblox Studio that allows you to export your Roblox Lua scripts to your local computer, edit them in your favorite IDE (like VSCode, Cursor, IntelliJ) or with an AI Agent, and instantly sync the changes back into your Roblox game.

Unlike other complex syncing tools, ScriptSync requires **zero project configuration files**, runs in seconds, and features an elegant built-in dark mode UI with a live activity log.

## ✨ Features
- **Two-Way Instant Auto-Sync**: Enable the "Auto-Sync" toggle in the plugin menu to establish a real-time connection. Any modifications, new scripts, or even new folders you create in your external IDE immediately materialize in Roblox Studio. Similarly, anytime you type in Roblox Studio, it pushes the changes straight to your local disk!
- **Active Editor Injection**: Modifying a script externally while having that exact script open in your Roblox Script Editor? No problem! ScriptSync intelligently injects the updated text directly into your open editor tab to prevent code conflicts.
- **Smart Folder Structure**: Accurately mirrors and maintains your exact game hierarchy (Workspace, ServerScriptService, ReplicatedStorage, etc.), even letting you sync empty folders!
- **Premium Built-In UI**: Operates exclusively through a modern Dock Widget complete with an activity terminal, so you always know exactly which files are being pushed or pulled (📤 / 📥).
- **Auto-Sorting by Game**: Automatically separates your exported scripts into different local folders depending on your current `game.Name`. If you rename or publish your game under a new name, the plugin intelligently pauses and prompts you to re-export!
- **Zero Configuration**: No `.json` files, Rojo setups, or complicated structure maps required. 

---

## 🚀 How to Use

### Step 1: Start the Local Server
Because Roblox Studio's environment is sandboxed to prevent direct hard-drive access, you must run our lightweight local server to handle the file reading and writing.
1. Download this repository.
2. Ensure you have [Node.js](https://nodejs.org/) installed on your computer.
3. Simply double-click the `start_server.bat` file.
4. A terminal window will open, confirming the server is listening on port 8080. Leave this window open while you work.

*All your game scripts will be exported here on your PC:* 
`C:\RobloxTestAI\[YourGameName]`

### Step 2: Install the Plugin in Roblox Studio
1. You can install the plugin directly from the Roblox Marketplace (if published) or manually from the source code.
2. **To install manually from source:**
   - Copy the contents of `IDEScriptSyncPlugin.lua`.
   - In Roblox Studio, open an empty `Script` in `ServerScriptService`.
   - Paste the code inside, right-click the script in your Explorer, and choose **"Save as Local Plugin..."**. You can delete the script from ServerScriptService afterward.

### Step 3: Enable HTTP Requests
To allow Roblox to talk to the local server you just started:
1. In Roblox Studio, go to the **Home** tab and click **Game Settings**.
2. Navigate to **Security**.
3. Toggle ON **Allow HTTP Requests**.
4. Click **Save**.

---

## 🕹️ Syncing Your Scripts

Once the server is running and the plugin is installed, you will see a new **ScriptSync** toolbar button in the Plugins tab. Clicking it opens the Plugin Menu:

- **📤 Export Scripts:** Scans your entire game, grabs all Scripts, LocalScripts, ModuleScripts, and Folders, and saves them locally at `C:\RobloxTestAI\[YourGameName]`.
- **📥 Sync Back:** Reads all modified scripts from your local computer and updates the exact corresponding scripts directly in Roblox Studio (useful if Auto-Sync is off).
- **⚡ Enable Auto-Sync:** Actively listens to both your local file system and your Roblox Studio workspace. Saving a file in Cursor/VSCode will instantly overwrite its counterpart in Roblox, and typing in Roblox instantly overwrites the file in your IDE. Creates missing scripts and folders dynamically!

### Troubleshooting
- **Failed to Connect Error:** Make sure you double-clicked `start_server.bat` and that the black terminal window is open in the background. Make sure you enabled **HTTP Requests** in Roblox's Game Settings.
- **Port In Use (EADDRINUSE) Error:** This means the Node server is already running in the background somewhere. Close out of other terminal windows running `server.js` and try again.
- **Node.js Errors:** Make sure you have installed the LTS version of Node.js from their official website.
