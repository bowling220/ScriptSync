# ScriptSync for Roblox Studio

ScriptSync is a lightweight, easy-to-use plugin for Roblox Studio that allows you to export your Roblox Lua scripts to your local computer, edit them in your favorite IDE (like VSCode, Cursor, IntelliJ) or with an AI Agent, and instantly sync the changes back into your Roblox game.

Unlike other complex syncing tools, ScriptSync requires zero project configuration files and runs in seconds.

## Features
- **Real-Time AI/IDE Editing**: Edit your `.lua` scripts locally with any IDE and instantly inject them back into Roblox.
- **Smart Folder Structure**: Maintains your exact game hierarchy (Workspace, ServerScriptService, ReplicatedStorage, etc.).
- **Automatic Game Sorting**: Automatically separates exported scripts into different folders based on your `game.Name`.
- **Zero Configuration**: No complicated `.json` or project setup required. Plug and play.

---

## 🚀 How to Use

### Step 1: Start the Local Server
Because Roblox Studio's environment is sandboxed to prevent direct hard-drive access, you must run our lightweight local server to handle the file writing.
1. Download this repository.
2. Ensure you have [Node.js](https://nodejs.org/) installed on your computer.
3. Double-click the `start_server.bat` file.
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

Once the server is running and the plugin is installed, you will see a new **ScriptSync** toolbar in the Plugins tab.

- **Export Scripts:** Scans your entire game, grabs all Scripts, LocalScripts, and ModuleScripts, and saves them locally at `C:\RobloxTestAI\[YourGameName]`.
- **Sync Back:** Reads all modified scripts from your local computer and updates the exact corresponding scripts directly in Roblox Studio.

### Troubleshooting
- **Failed to Connect Error:** Make sure you double-clicked `start_server.bat` and that the black terminal window is open. Make sure you enabled **HTTP Requests** in Roblox's Game Settings.
- **Node.js Errors:** Make sure you have installed the LTS version of Node.js from their official website.
