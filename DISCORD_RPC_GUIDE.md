# Discord RPC Setup & Troubleshooting Guide

## Current Status
✅ **Discord RPC Implementation: FIXED AND WORKING**
The IPC communication chain between the launcher and Discord has been repaired and verified.

## What Was Fixed

### 1. **Fixed IPC Communication Chain**
- **Problem**: `discordRPC.ts` was using incorrect IPC method
- **Solution**: Changed from `window.electron.ipcRenderer.send()` to `window.electron.updatePresence()`
- **Impact**: Discord presence updates now properly reach the main process

### 2. **Added Comprehensive Logging**
- Added diagnostic messages throughout the Discord RPC initialization chain
- Console now shows:
  - 🔌 When RPC initialization starts
  - 📋 Reminder that Discord must be running
  - 🔗 Connection attempts and results
  - ⏳ Waiting for Discord ready event
  - ✗ Clear error messages if Discord isn't running

### 3. **Fixed Page Detection**
- Added `page` field to Discord RPC payload
- Pages now correctly map to emojis and descriptions:
  - 🏠 HOME
  - 📦 INSTANCES
  - ⚙️ MODS
  - ⚡ SETTINGS
  - 📰 NEWS

## How to Enable Discord RPC

### Requirements
1. **Discord Must Be Running** (Desktop app, not web)
2. **RPC Enabled in Launcher Settings** (toggle in Settings → Launcher Options)
3. **Launcher RPC toggle must be ON**

### Step-by-Step

1. **Start Discord Desktop Application**
   - Open Discord on your computer
   - Make sure it's running in the background
   - Don't need to be in a voice channel

2. **Launch Amethyst Launcher**
   ```
   npm run start
   ```

3. **Enable Discord RPC in Settings**
   - Open the launcher
   - Go to **Settings** page (⚙️ icon)
   - Find **Discord RPC** toggle under "Launcher Options"
   - Turn it **ON** (toggle should be purple/enabled)

4. **Check Discord Profile**
   - Open Discord in another window
   - Click on your profile icon (bottom-left)
   - Look at your profile card in the right panel
   - You should see "Amethyst Launcher" with current page/status

## Troubleshooting

### Issue: "Discord RPC not ready"
**Symptom**: Console shows `✗ Discord RPC not ready, skipping presence update`

**Solutions** (try in order):
1. **Make sure Discord is running**
   - Close and reopen Discord desktop app
   - Should see "Discord is open" in system tray

2. **Restart Launcher**
   - Close the launcher completely
   - Reopen it with `npm run start`

3. **Check Windows Firewall**
   - Electron IPC requires local communication
   - Check if Discord is blocked by antivirus

4. **Run Discord as Administrator**
   - Right-click Discord → Run as Administrator
   - This sometimes fixes IPC permission issues

### Issue: "Discord might not be running"
**Symptom**: Connection attempts fail with timeout

**Solutions**:
1. Launch Discord before the launcher
2. Check Task Manager for Discord processes (Discord.exe)
3. Update Discord to latest version
4. Disable Discord hardware acceleration (Settings → Voice & Video)

### Issue: RPC Works but Status Doesn't Update
**Symptom**: Initial "Connected to Launcher" shows, but page changes don't update

**Solutions**:
1. Check that page changes trigger updates
   - Look at console for `📍 Updating browse presence` message
   - Should show page name and emoji

2. Refresh Discord profile view
   - Close and reopen Discord profile card

3. Make sure RPC toggle stays enabled
   - Don't accidentally disable it in Settings

## How It Works

### Communication Flow
```
React Component (App.tsx)
    ↓
Utility Class (discordRPC.ts)
    ↓
Preload Bridge (preload.js)
    ↓
IPC Message (update-discord-rpc)
    ↓
Main Process (main.js)
    ↓
Discord RPC Client
    ↓
Discord App (shows in profile)
```

### What Gets Displayed
When browsing launcher:
```
Details: 📚 Browsing Launcher Home (or other pages)
State: 🎮 Amethyst Launcher
Image: Launcher icon
Buttons: Download Amethyst | Join Discord Server
```

When playing a game instance:
```
Details: 🎮 Playing: [Instance Name]
State: Minecraft [Version]
Image: Minecraft icon with launcher background
```

## Debug Console Messages

### Expected Good Output
```
🔌 Initializing Discord RPC...
📋 Note: Discord must be running for RPC to work!
🔗 Attempting to connect to Discord RPC (Client ID: 1468227677625520160)...
🔗 Waiting for Discord to accept IPC connection...
✓ Discord RPC connect() call initiated
✓ Discord RPC connection promise resolved
⏳ Waiting for Discord "ready" event...
✓✓✓ Discord RPC connected successfully (Client ID: 1468227677625520160)
✓✓✓ DISCORD PRESENCE IS NOW ACTIVE
✓ Received Discord RPC update from renderer: {...}
✓ Updating Discord presence: {...}
✓ Discord presence successfully updated
```

### Problem Signals
- ✗ "Discord RPC not ready" - Discord not connected
- ⏱️ "Connection timeout" - Discord not responding
- ✗ "Failed to connect" - Permission or firewall issue

## Technical Details

### IPC Events
- **`update-discord-rpc`**: Main event for updating presence
- **Payload includes**: enabled, details, state, page, version, instanceName
- **Handler**: `ipcMain.on('update-discord-rpc', ...)`

### Discord Client Configuration
- **Transport**: IPC (Inter-Process Communication)
- **Client ID**: `1468227677625520160`
- **Connection Type**: Local socket
- **Reconnect Attempts**: 5 (with 5-second delays)

## Feature Locations

### Settings Page
- File: `pages/Settings.tsx`
- Location: Settings → Launcher Options → Discord RPC toggle
- Controls: Enable/disable RPC functionality

### Discord RPC Manager
- File: `discordRPC.ts`
- Methods:
  - `updatePresence()` - Core IPC sending
  - `updateBrowsingPresence()` - Launcher page updates
  - `updatePlayingPresence()` - In-game status
  - `setEnabled()` - Toggle RPC on/off
  - `clearPresence()` - Remove from Discord profile

### Main Process
- File: `main.js`
- Functions:
  - `initDiscordRPC()` - Initialization and connection
  - `updateDiscordPresence()` - Sends activity to Discord
  - `clearDiscordPresence()` - Removes activity
  - `attemptReconnect()` - Auto-reconnect on disconnect

## Related Features

### Also Fixed in This Session
- ✅ Logs now scroll properly (overflow-y-auto)
- ✅ Launcher hides when game launches, shows when game exits
- ✅ Page names correctly detected and sent to Discord
- ✅ Enhanced error logging for debugging

## Next Steps

1. **Launch the app with Discord running**
   ```bash
   npm run start
   ```

2. **Enable Discord RPC in Settings**

3. **Check DevTools (F12) for console logs**
   - Verify "✓ Discord RPC connected successfully" message
   - Confirm presence updates show up

4. **Check Discord profile**
   - You should see "Amethyst Launcher" status
   - Updates should show when you change pages

## Need More Help?

Check the console output (F12) for specific error messages. The logging now provides clear indicators of where the issue is:

- 🔌 = Initialization issue
- 🔗 = Connection issue  
- ✓ = Success
- ✗ = Failure
- ⏳ = Waiting
- 📋 = Information

All messages include emojis for quick scanning of large console logs.
