
const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');
const https = require('https');
const http = require('http');
const { Client } = require('discord-rpc');
const minecraftRPC = require('./minecraft-rpc');

// App constants
const APP_VERSION = '3.0.0';
const GITHUB_REPO = 'Crazyivo/Amethyst'; // Change this to your repo
const GITHUB_OWNER = 'Crazyivo'; // Change this to your username
const GITHUB_REPO_NAME = 'Amethyst'; // Change this to your repo name

// Main window reference
let mainWindow = null;

// Discord RPC Client
let rpcClient = null;
const DISCORD_CLIENT_ID = '1468227677625520160';
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_DELAY = 5000; // 5 seconds
let gameProcess = null; // Track running game process

// ============ UPDATER FUNCTIONS ============

async function checkAndDownloadUpdate(mainWindow) {
  try {
    console.log('🔄 Checking for updates...');
    console.log(`📦 Current version: ${APP_VERSION}`);
    
    // Fetch latest release from GitHub
    const latestRelease = await new Promise((resolve, reject) => {
      const apiUrl = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
      https.get(apiUrl, {
        headers: {
          'User-Agent': 'Amethyst-Launcher'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.message === 'Not Found') {
              reject(new Error('No releases found on GitHub'));
              return;
            }
            resolve(response);
          } catch (e) {
            reject(e);
          }
        });
      }).on('error', reject);
    });

    const latestVersion = latestRelease.tag_name.replace('v', '');
    console.log(`📦 Latest version: ${latestVersion}`);

    // Compare versions
    const needsUpdate = compareVersions(APP_VERSION, latestVersion);
    
    if (!needsUpdate) {
      console.log('✅ You are already on the latest version!');
      return null;
    }

    console.log(`🆕 New version available: ${latestVersion}`);
    
    // Find asset to download (looking for .exe or .zip)
    const asset = latestRelease.assets.find(a => 
      a.name.endsWith('.exe') || 
      a.name.endsWith('.zip') ||
      a.name.includes('Amethyst') ||
      a.name.includes('amethyst')
    );

    if (!asset) {
      console.log('⚠️  No suitable release asset found');
      return null;
    }

    console.log(`📥 Downloading: ${asset.name}`);
    console.log(`📊 Size: ${(asset.size / 1024 / 1024).toFixed(2)} MB`);

    return {
      version: latestVersion,
      downloadUrl: asset.browser_download_url,
      assetName: asset.name,
      size: asset.size
    };

  } catch (error) {
    console.error('❌ Update check failed:', error.message);
    return null;
  }
}

function compareVersions(currentVersion, latestVersion) {
  const current = currentVersion.split('.').map(Number);
  const latest = latestVersion.split('.').map(Number);
  
  for (let i = 0; i < Math.max(current.length, latest.length); i++) {
    const curr = current[i] || 0;
    const lat = latest[i] || 0;
    
    if (lat > curr) return true;  // Update available
    if (lat < curr) return false; // Current is newer
  }
  
  return false; // Same version
}

async function downloadUpdate(updateInfo, mainWindow) {
  return new Promise((resolve, reject) => {
    const appDataPath = app.getPath('appData');
    const updateDir = path.join(appDataPath, 'Amethyst', 'updates');
    
    if (!fs.existsSync(updateDir)) {
      fs.mkdirSync(updateDir, { recursive: true });
    }
    
    const downloadPath = path.join(updateDir, updateInfo.assetName);
    
    console.log(`💾 Saving to: ${downloadPath}`);
    
    const file = fs.createWriteStream(downloadPath);
    let downloadedBytes = 0;
    
    https.get(updateInfo.downloadUrl, (response) => {
      response.pipe(file);
      
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        const progress = Math.round((downloadedBytes / updateInfo.size) * 100);
        
        // Send progress to renderer
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('update-progress', {
            progress,
            status: `Скачивание обновления... ${progress}%`,
            currentMB: (downloadedBytes / 1024 / 1024).toFixed(1),
            totalMB: (updateInfo.size / 1024 / 1024).toFixed(1)
          });
        }
        
        console.log(`📊 Download progress: ${progress}%`);
      });
      
      file.on('finish', () => {
        file.close();
        console.log('✅ Download complete!');
        
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('update-progress', {
            progress: 100,
            status: 'Обновление загружено. Перезагрузка...'
          });
        }
        
        resolve(downloadPath);
      });
      
      file.on('error', (err) => {
        fs.unlink(downloadPath, () => {});
        reject(err);
      });
      
    }).on('error', reject);
  });
}

// ============ END UPDATER FUNCTIONS ============

async function initDiscordRPC() {
  try {
    console.log('🔌 Initializing Discord RPC...');
    console.log('📋 Note: Discord must be running for RPC to work!');
    rpcClient = new Client({ transport: 'ipc' });
    
    console.log('🎧 Registering event listeners...');
    
    rpcClient.on('ready', () => {
      console.log('✓✓✓ Discord RPC connected successfully (Client ID: ' + DISCORD_CLIENT_ID + ')');
      console.log('✓✓✓ DISCORD PRESENCE IS NOW ACTIVE');
      rpcConnected = true;
      reconnectAttempts = 0;
      // Update presence immediately when connected
      updateDiscordPresence({ enabled: true, details: 'Connected to Launcher' });
    });

    rpcClient.on('disconnected', () => {
      console.log('✗ Discord RPC disconnected');
      rpcConnected = false;
      attemptReconnect();
    });

    rpcClient.on('error', (error) => {
      console.error('✗ Discord RPC error event:', error);
      console.error('✗ Error message:', error.message);
      console.error('✗ Error code:', error.code);
    });

    rpcClient.on('warn', (message) => {
      console.warn('⚠️  Discord RPC warning:', message);
    });

    console.log('✓ Event listeners registered');
    console.log('🔗 Attempting to connect to Discord RPC (Client ID: ' + DISCORD_CLIENT_ID + ')...');
    console.log('🔗 Waiting for Discord to accept IPC connection...');
    
    const connectPromise = rpcClient.connect(DISCORD_CLIENT_ID);
    console.log('✓ Discord RPC connect() call initiated');
    
    // Wait for connection with longer timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout - Discord may not be responding')), 15000)
    );
    
    try {
      await Promise.race([connectPromise, timeoutPromise]);
      console.log('✓ Discord RPC connection promise resolved successfully');
      console.log('⏳ Waiting for Discord "ready" event (up to 5 seconds)...');
      
      // Wait for ready event
      let readyEventFired = false;
      const readyTimeout = setTimeout(() => {
        if (!readyEventFired && rpcConnected) {
          console.log('✅ Ready event may have fired - rpcConnected is true');
        } else if (!readyEventFired && !rpcConnected) {
          console.warn('⚠️  Timeout waiting for ready event');
          console.warn('⚠️  But will continue anyway - Discord may still respond');
          // Force try to update presence
          updateDiscordPresence({ enabled: true, details: 'Connected to Launcher' });
        }
      }, 5000);
      
      // Wait a bit more and check
      await new Promise(resolve => setTimeout(resolve, 3000));
      clearTimeout(readyTimeout);
      
      if (!rpcConnected) {
        console.warn('⚠️  Discord "ready" event not fired after 3 seconds');
        console.warn('⚠️  This might mean Discord is not running or has issues');
        console.warn('⚠️  Trying to send presence anyway...');
        // Try to set presence anyway
        if (rpcClient) {
          try {
            await rpcClient.setActivity({
              details: 'Test message',
              state: 'Amethyst Launcher',
              startTimestamp: Math.floor(Date.now() / 1000)
            });
            console.log('✅ Successfully sent test presence!');
            rpcConnected = true;
          } catch (e) {
            console.error('✗ Could not send test presence:', e.message);
          }
        }
      }
    } catch (timeoutError) {
      console.error('⏱️ Discord RPC connection error:', timeoutError.message);
      console.error('⏱️ Discord might not be running on this system');
      rpcConnected = false;
      attemptReconnect();
    }
  } catch (error) {
    console.error('✗ Failed to initialize Discord RPC:', error.message);
    console.error('✗ Full error details:', error);
    console.error('✗ Troubleshooting: Is Discord running? Check firewall settings.');
    rpcConnected = false;
    attemptReconnect();
  }
}

function attemptReconnect() {
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    reconnectAttempts++;
    console.log(`🔄 Attempting to reconnect to Discord RPC (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
    setTimeout(() => {
      initDiscordRPC();
    }, RECONNECT_DELAY);
  } else {
    console.error('✗ Max Discord RPC reconnection attempts reached. Discord presence disabled.');
  }
}

function updateDiscordPresence(data) {
  if (!rpcClient || !rpcConnected) {
    console.warn('✗ Discord RPC not ready, skipping presence update');
    console.log('  rpcClient:', !!rpcClient, 'rpcConnected:', rpcConnected);
    return;
  }
  
  try {
    // Красивая версия с эмодзи и кнопками - БЕЗ необходимости загружать иконки
    const activityData = {
      details: data.details || '🏠 На главной странице',
      state: '🎮 Amethyst Launcher',
      largeImageKey: 'amethyst_launcher',
      largeImageText: 'Amethyst Launcher v3.0.0',
      startTimestamp: Math.floor(Date.now() / 1000),
      buttons: [
        {
          label: '📥 Скачать',
          url: 'https://github.com/Nominor/Amethyst'
        },
        {
          label: '💬 Discord',
          url: 'https://discord.gg/amethyst'
        }
      ]
    };

    // If playing - show full game info with minecraft icon
    if (data.instanceName) {
      activityData.details = `▶️ Играет: ${data.instanceName}`;
      activityData.state = `Minecraft ${data.version || '1.20.1'}`;
      activityData.smallImageKey = 'minecraft';
      activityData.smallImageText = `MC ${data.version}`;
    } else {
      // Show current page with emoji
      const pageEmoji = {
        'HOME': '🏠',
        'INSTANCES': '📦',
        'MODS': '🔧',
        'SETTINGS': '⚙️',
        'NEWS': '📰'
      };
      
      const pageTitle = {
        'HOME': 'На главной странице',
        'INSTANCES': 'Управление экземплярами',
        'MODS': 'Просмотр модов',
        'SETTINGS': 'Настройка параметров',
        'NEWS': 'Чтение новостей'
      };
      
      if (data.page && pageEmoji[data.page]) {
        activityData.details = `${pageEmoji[data.page]} ${pageTitle[data.page] || 'Навигация'}`;
      }
    }

    console.log('✓ Sending Discord activity:', {
      details: activityData.details,
      state: activityData.state,
      buttons: activityData.buttons.length
    });
    
    rpcClient.setActivity(activityData).then(() => {
      console.log('✅ Discord presence successfully updated!');
    }).catch(err => {
      console.error('✗ Failed to set Discord activity:', err.message);
    });
  } catch (error) {
    console.error('✗ Failed to update Discord presence:', error);
  }
}

function clearDiscordPresence() {
  if (!rpcClient || !rpcConnected) return;
  
  try {
    rpcClient.clearActivity();
    console.log('Discord presence cleared');
  } catch (error) {
    console.error('Failed to clear Discord presence:', error);
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1000,
    minHeight: 700,
    frame: false,
    backgroundColor: '#050506',
    icon: path.join(__dirname, 'assets', 'amethyst_launcher.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    },
    show: false
  });

  // Загружаем splash screen сначала
  const splashPath = path.join(__dirname, 'splash.html');
  mainWindow.loadFile(splashPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Проверяем обновления перед загрузкой
    checkAndDownloadUpdate(mainWindow).then(updateInfo => {
      if (updateInfo) {
        console.log('🔄 Starting update download...');
        return downloadUpdate(updateInfo, mainWindow);
      }
    }).then(() => {
      // После завершения анимации splash screen загружаем основное приложение
      setTimeout(() => {
        const indexPath = path.join(__dirname, 'dist', 'index.html');
        mainWindow.loadFile(indexPath);
        
        // Плавная анимация при загрузке контента
        mainWindow.webContents.once('did-finish-load', () => {
          mainWindow.webContents.insertCSS(`
            body {
              animation: fadeInApp 0.6s ease-out;
            }
            @keyframes fadeInApp {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }
          `);
        });
      }, 14500);
    }).catch(err => {
      console.error('Update error:', err.message);
      // Continue anyway even if update fails
      setTimeout(() => {
        const indexPath = path.join(__dirname, 'dist', 'index.html');
        mainWindow.loadFile(indexPath);
      }, 14500);
    });
  });

  // Открываем DevTools для отладки (закомментировано для production)
  // mainWindow.webContents.openDevTools();

  // Обработка кастомных кнопок управления окном
  ipcMain.on('window-minimize', () => mainWindow.minimize());
  ipcMain.on('window-close', () => {
    console.log('🔌 Closing launcher - clearing Discord RPC');
    clearDiscordPresence();
    mainWindow.close();
  });
  
  // Handle window closed
  mainWindow.on('closed', () => {
    console.log('🔌 Window closed - clearing Discord presence');
    clearDiscordPresence();
  });
  
  // Открытие папок в проводнике
  ipcMain.on('open-folder', (event, folderPath) => {
    shell.openPath(folderPath);
  });

  // Hide launcher on Minecraft launch
  ipcMain.on('game-launched', () => {
    if (mainWindow) {
      console.log('Hiding launcher...');
      mainWindow.hide();
    }
  });

  // Show launcher when Minecraft exits
  ipcMain.on('game-exited', () => {
    if (mainWindow) {
      console.log('Showing launcher...');
      mainWindow.show();
      mainWindow.focus();
    }
  });

  // Discord RPC обновление
  ipcMain.on('update-discord-rpc', (event, data) => {
    console.log('✓ Received Discord RPC update from renderer:', data);
    if (data.enabled) {
      updateDiscordPresence(data);
    } else {
      clearDiscordPresence();
    }
  });

  // Получение пути к Minecraft (используем стандартный путь .minecraft)
  const getMinecraftPath = () => {
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, '.minecraft');
  };

  // Создание директории Minecraft в AppData
  const minecraftPath = getMinecraftPath();
  if (!fs.existsSync(minecraftPath)) {
    fs.mkdirSync(minecraftPath, { recursive: true });
    console.log('Created Minecraft directory at:', minecraftPath);
  }

  // Функция скачивания JSON данных
  const downloadFileData = (url) => {
    return new Promise((resolve, reject) => {
      const protocol = url.startsWith('https') ? https : http;
      const req = protocol.get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          // Редирект
          downloadFileData(res.headers.location)
            .then(resolve)
            .catch(reject);
          return;
        }
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      });
      req.on('error', reject);
    });
  };

  // Функция скачивания файла с лучшей обработкой ошибок и повторными попытками
  const downloadFile = (url, destinationPath, retries = 3) => {
    return new Promise(async (resolve, reject) => {
      // Проверка URL
      if (!url || typeof url !== 'string' || !url.includes('http')) {
        reject(new Error('Invalid download URL provided'));
        return;
      }

      // Убедимся, что директория существует
      const dir = path.dirname(destinationPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log('Created directory:', dir);
      }

      let lastError = null;
      
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          console.log(`[Download] Attempt ${attempt}/${retries} for ${path.basename(destinationPath)}`);
          
          await new Promise((resolveAttempt, rejectAttempt) => {
            const protocol = url.startsWith('https') ? https : http;
            let fileStream = null;
            let request = null;

            const cleanup = () => {
              if (fileStream) {
                fileStream.destroy();
              }
              if (request) {
                request.abort();
              }
            };

            // Увеличиваем таймаут до 2 минут
            request = protocol.get(url, { timeout: 120000 }, (response) => {
              console.log(`[Download] Response status: ${response.statusCode} for ${path.basename(destinationPath)}`);
              
              if (response.statusCode === 302 || response.statusCode === 301) {
                const redirectUrl = response.headers.location;
                if (!redirectUrl) {
                  cleanup();
                  rejectAttempt(new Error('Redirect location not provided by server'));
                  return;
                }
                console.log('[Download] Following redirect to:', redirectUrl);
                cleanup();
                downloadFile(redirectUrl, destinationPath, retries)
                  .then(resolveAttempt)
                  .catch(rejectAttempt);
                return;
              }
              
              if (response.statusCode !== 200) {
                cleanup();
                rejectAttempt(new Error(`HTTP ${response.statusCode}: Failed to download file`));
                return;
              }
              
              const contentLength = parseInt(response.headers['content-length'], 10);
              console.log(`[Download] File size: ${(contentLength / 1024 / 1024).toFixed(2)} MB`);
              
              fileStream = fs.createWriteStream(destinationPath, { flags: 'w' });
              let downloadedBytes = 0;

              fileStream.on('error', (err) => {
                console.error('[Download] File write error:', err);
                cleanup();
                try {
                  fs.unlinkSync(destinationPath);
                } catch (e) {}
                rejectAttempt(err);
              });

              response.on('data', (chunk) => {
                downloadedBytes += chunk.length;
                const percent = ((downloadedBytes / contentLength) * 100).toFixed(1);
                console.log(`[Download] Progress: ${percent}%`);
              });

              response.on('error', (err) => {
                console.error('[Download] Response error:', err);
                cleanup();
                rejectAttempt(err);
              });

              response.pipe(fileStream);

              fileStream.on('finish', () => {
                fileStream.close();
                console.log(`[Download] Successfully downloaded: ${path.basename(destinationPath)}`);
                resolveAttempt();
              });
            });

            request.on('error', (err) => {
              console.error(`[Download] Request error (attempt ${attempt}/${retries}):`, err);
              cleanup();
              try {
                if (fileStream) fs.unlinkSync(destinationPath);
              } catch (e) {}
              rejectAttempt(err);
            });

            request.on('timeout', () => {
              console.error(`[Download] Request timeout (attempt ${attempt}/${retries})`);
              cleanup();
              rejectAttempt(new Error('Download timeout - server took too long to respond'));
            });
          });
          
          // Если успешно - выходим из цикла
          resolve();
          return;
          
        } catch (error) {
          lastError = error;
          console.error(`[Download] Attempt ${attempt} failed:`, error.message);
          
          if (attempt < retries) {
            // Ждем перед следующей попыткой (экспоненциальная задержка)
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            console.log(`[Download] Waiting ${delay}ms before retry...`);
            await new Promise(r => setTimeout(r, delay));
          }
        }
      }
      
      // Все попытки исчерпаны
      reject(lastError || new Error('Download failed after all retry attempts'));
    });
  };

  // Скачивание версии Minecraft
  ipcMain.on('download-version', async (event, versionUrl) => {
    try {
      console.log('=== Starting version download ===');
      console.log('URL:', versionUrl);
      
      if (!versionUrl || !versionUrl.includes('http')) {
        throw new Error('Invalid version URL provided');
      }
      
      event.reply('download-progress', { status: 'Fetching version info...', progress: 10 });
      
      // Скачиваем JSON с информацией о версии
      console.log('Fetching version manifest...');
      const manifestData = await new Promise((resolve, reject) => {
        const protocol = versionUrl.startsWith('https') ? https : http;
        const req = protocol.get(versionUrl, { timeout: 120000 }, (res) => {
          console.log(`[Manifest] Response status: ${res.statusCode}`);
          
          if (res.statusCode === 302 || res.statusCode === 301) {
            console.log('[Manifest] Following redirect to:', res.headers.location);
            const redirectUrl = res.headers.location;
            res.destroy();
            
            const redirectReq = (redirectUrl.startsWith('https') ? https : http).get(redirectUrl, { timeout: 120000 }, (redirectRes) => {
              let data = '';
              redirectRes.on('data', chunk => data += chunk);
              redirectRes.on('end', () => {
                try {
                  resolve(JSON.parse(data));
                } catch (e) {
                  reject(e);
                }
              });
              redirectRes.on('error', reject);
            });
            redirectReq.on('error', reject);
            return;
          }
          
          if (res.statusCode !== 200) {
            reject(new Error(`HTTP ${res.statusCode}: Failed to fetch version manifest`));
            return;
          }
          
          let data = '';
          res.on('data', chunk => data += chunk);
          
          res.on('end', () => {
            try {
              console.log('[Manifest] Parsing JSON...');
              const parsed = JSON.parse(data);
              console.log('[Manifest] Parsed data keys:', Object.keys(parsed));
              resolve(parsed);
            } catch (e) {
              console.error('[Manifest] JSON parse error:', e);
              reject(e);
            }
          });
          
          res.on('error', reject);
        });
        
        req.on('error', reject);
        req.on('timeout', () => reject(new Error('Manifest fetch timeout')));
      });

      // Определяем тип полученных данных
      let versionId = null;
      let versionJsonUrl = null;
      
      // Если это полный манифест версий (содержит массив versions)
      if (manifestData.versions && Array.isArray(manifestData.versions)) {
        console.log('[Download] Got full manifest with versions list');
        // Это манифест со списком всех версий
        // Найти первую версию типа "release" (или можно использовать последнюю)
        const releaseVersion = manifestData.versions.find(v => v.type === 'release');
        if (!releaseVersion) {
          throw new Error('No release versions found in manifest');
        }
        versionId = releaseVersion.id;
        versionJsonUrl = releaseVersion.url;
        console.log(`[Download] Selected version: ${versionId}`);
        console.log(`[Download] Version JSON URL: ${versionJsonUrl}`);
      } 
      // Если это JSON отдельной версии (содержит id и downloads)
      else if (manifestData.id && manifestData.downloads) {
        console.log('[Download] Got specific version JSON');
        versionId = manifestData.id;
        // Это уже полная версия JSON, не нужно скачивать ещё
      } 
      else {
        throw new Error('Unknown manifest format received');
      }

      if (!versionId) {
        throw new Error('Could not determine version ID');
      }

      console.log('=== Version selected ===');
      console.log('Version ID:', versionId);
      
      const minecraftPath = getMinecraftPath();
      const versionsDir = path.join(minecraftPath, 'versions', versionId);
      
      // Создаем директорию
      if (!fs.existsSync(versionsDir)) {
        fs.mkdirSync(versionsDir, { recursive: true });
        console.log('[Download] Created directory:', versionsDir);
      }
      
      let versionData = manifestData;
      
      // Если нам нужно скачать JSON версии
      if (versionJsonUrl) {
        console.log('=== Downloading version JSON ===');
        console.log('URL:', versionJsonUrl);
        event.reply('download-progress', { status: 'Downloading version metadata...', progress: 20 });
        
        const versionJsonPath = path.join(versionsDir, `${versionId}.json`);
        await downloadFile(versionJsonUrl, versionJsonPath);
        
        if (!fs.existsSync(versionJsonPath)) {
          throw new Error('Version JSON file was not downloaded');
        }
        
        const jsonContent = fs.readFileSync(versionJsonPath, 'utf-8');
        versionData = JSON.parse(jsonContent);
        
        const jsonSize = fs.statSync(versionJsonPath).size;
        console.log(`[Download] Version JSON size: ${(jsonSize / 1024).toFixed(2)} KB`);
      }

      // === Скачиваем client.jar ===
      const clientJarPath = path.join(versionsDir, `${versionId}.jar`);
      const clientDownloadUrl = versionData.downloads?.client?.url;
      
      if (!clientDownloadUrl) {
        throw new Error('No client download URL in version data');
      }
      
      console.log('=== Downloading client JAR ===');
      console.log('URL:', clientDownloadUrl);
      event.reply('download-progress', { status: 'Downloading client JAR...', progress: 40 });
      
      await downloadFile(clientDownloadUrl, clientJarPath);
      
      if (!fs.existsSync(clientJarPath)) {
        throw new Error('Client JAR file was not downloaded');
      }
      const jarSize = fs.statSync(clientJarPath).size;
      console.log(`[Download] Client JAR size: ${(jarSize / 1024 / 1024).toFixed(2)} MB`);
      
      // === Парсим JSON и загружаем библиотеки ===
      console.log('=== Downloading libraries ===');
      if (versionData && versionData.libraries) {
        const librariesDir = path.join(minecraftPath, 'libraries');
        if (!fs.existsSync(librariesDir)) {
          fs.mkdirSync(librariesDir, { recursive: true });
        }
        
        const libraryCount = versionData.libraries.length;
        console.log(`[Download] Found ${libraryCount} libraries to download`);
        
        let downloadedCount = 0;
        for (let i = 0; i < versionData.libraries.length; i++) {
          const lib = versionData.libraries[i];
          if (lib.downloads?.artifact?.url) {
            const relPath = lib.downloads.artifact.path;
            const libPath = path.join(librariesDir, relPath);
            
            // Создаем директорию если нужно
            const libDir = path.dirname(libPath);
            if (!fs.existsSync(libDir)) {
              fs.mkdirSync(libDir, { recursive: true });
            }
            
            // Пропускаем если уже скачано
            if (fs.existsSync(libPath)) {
              console.log(`[Download] Library already exists: ${relPath}`);
              downloadedCount++;
              continue;
            }
            
            console.log(`[Download] Downloading library ${i + 1}/${libraryCount}: ${relPath}`);
            try {
              await downloadFile(lib.downloads.artifact.url, libPath);
              downloadedCount++;
              const progress = 50 + Math.floor((downloadedCount / libraryCount) * 45);
              event.reply('download-progress', { status: `Downloading libraries... (${downloadedCount}/${libraryCount})`, progress });
            } catch (libError) {
              console.warn(`[Download] Failed to download library ${relPath}:`, libError.message);
              // Продолжаем, даже если не скачалась одна библиотека
            }
          }
        }
        console.log(`[Download] Successfully downloaded ${downloadedCount}/${libraryCount} libraries`);
      } else {
        console.warn('[Download] No libraries found in version data');
      }
      
      console.log('=== Download complete! ===');
      event.reply('download-progress', { status: 'Download complete!', progress: 100 });
      event.reply('download-version-response', { success: true, message: 'Version downloaded successfully' });
      
    } catch (error) {
      console.error('=== Download error ===');
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
      event.reply('download-version-response', { 
        success: false, 
        message: `Download failed: ${error.message}` 
      });
    }
  });

  // Обработка запроса на оптимизацию Minecraft (записывает options.txt и amethyst-optimize.json)
  ipcMain.on('optimize-minecraft', (event) => {
    try {
      const minecraftPath = getMinecraftPath();
      if (!fs.existsSync(minecraftPath)) fs.mkdirSync(minecraftPath, { recursive: true });

      const optionsPath = path.join(minecraftPath, 'options.txt');
      let opts = {};
      if (fs.existsSync(optionsPath)) {
        try {
          const content = fs.readFileSync(optionsPath, 'utf-8');
          content.split(/\r?\n/).forEach(line => {
            if (!line) return;
            const idx = line.indexOf(':');
            if (idx > 0) opts[line.slice(0, idx)] = line.slice(idx + 1);
          });
        } catch (e) {
          console.warn('Failed to read existing options.txt:', e.message);
        }
      }

      const recommended = {
        graphics: 'fast',
        renderDistance: '8',
        fov: '70.0',
        guiScale: '2',
        chatColors: 'true',
        chatOpacity: '1.0',
        particles: 'decreased',
        useVbo: 'true',
        mipmapLevels: '0',
        biomeBlendRadius: '0',
        viewBob: 'false',
        entityDistance: '0'
      };

      for (const k in recommended) opts[k] = recommended[k];

      const out = Object.entries(opts).map(([k, v]) => `${k}:${v}`).join(os.EOL) + os.EOL;
      fs.writeFileSync(optionsPath, out, 'utf-8');

      const optimizeJson = {
        jvmArgs: [
          '-XX:+UseG1GC',
          '-XX:+UnlockExperimentalVMOptions',
          '-XX:G1NewSizePercent=20',
          '-XX:G1ReservePercent=20',
          '-XX:MaxGCPauseMillis=50',
          '-XX:+DisableExplicitGC',
          '-XX:+UseStringDeduplication'
        ],
        note: 'Generated by Amethyst - JVM args appended on launch if present'
      };

      fs.writeFileSync(path.join(minecraftPath, 'amethyst-optimize.json'), JSON.stringify(optimizeJson, null, 2), 'utf-8');

      event.reply('optimize-minecraft-response', { success: true, message: 'Оптимизация применена', path: minecraftPath });
    } catch (err) {
      console.error('optimize-minecraft error:', err);
      event.reply('optimize-minecraft-response', { success: false, message: String(err) });
    }
  });

  // Симуляция запуска игры
  ipcMain.on('launch-game', async (event, config) => {
    console.log('Main Process: Initiating launch sequence with config:', config);
    console.log('Minecraft versions path:', getMinecraftPath());
    
    const minecraftPath = getMinecraftPath();
    const versionsPath = path.join(minecraftPath, 'versions', config.versionId);
    const javaBin = config.javaPath || 'java'; // Используется Java из PATH
    
    // Проверка наличия Java
    const checkJava = spawn(javaBin, ['-version']);
    checkJava.on('error', (error) => {
      console.error('Java not found:', error.message);
      event.reply('launch-game-response', { 
        success: false, 
        message: 'Java не установлена. Пожалуйста, установите Java JDK 8 или выше.' 
      });
    });
    
    // Создание директории версии если её нет
    if (!fs.existsSync(versionsPath)) {
      fs.mkdirSync(versionsPath, { recursive: true });
      console.log('Created version directory at:', versionsPath);
    }
    
    console.log(`Launching Minecraft ${config.versionId}`);
    console.log(`Loader: ${config.loaderType}`);
    console.log(`Memory: ${config.memory}MB`);
    console.log(`Java Binary: ${javaBin}`);
    console.log(`Versions Path: ${versionsPath}`);
    
    // Аргументы для JVM (совместимо со старыми версиями Java)
    const jvmArgs = [
      `-Xmx${config.memory}M`,
      `-Xms${Math.floor(config.memory / 2)}M`,
      `-Djava.library.path=${path.join(versionsPath, 'natives')}`,
      `-Dminecraft.applet.TargetDirectory=${minecraftPath}`
    ];

    // If optimization file exists, append recommended JVM args
    try {
      const optimizePath = path.join(minecraftPath, 'amethyst-optimize.json');
      if (fs.existsSync(optimizePath)) {
        const optRaw = fs.readFileSync(optimizePath, 'utf-8');
        const optJson = JSON.parse(optRaw);
        if (Array.isArray(optJson.jvmArgs) && optJson.jvmArgs.length > 0) {
          jvmArgs.push(...optJson.jvmArgs);
          console.log('Applied optimization JVM args:', optJson.jvmArgs);
        }
      }
    } catch (e) {
      console.warn('Failed to apply optimization JVM args:', e.message);
    }
    
    // Аргументы для игры
    const gameArgs = [
      `--version=${config.versionId}`,
      `--gameDir=${minecraftPath}`,
      `--assetsDir=${path.join(minecraftPath, 'assets')}`,
      `--assetIndex=${config.versionId}`,
      `--username=${config.username || 'Player'}`,
      `--uuid=${config.uuid || '00000000-0000-0000-0000-000000000000'}`,
      `--accessToken=${config.accessToken || '0'}`,
      `--clientId=${config.clientId || '00000000-0000-0000-0000-000000000000'}`,
      `--xuid=${config.xuid || '00000000-0000-0000-0000-000000000000'}`,
      `--userType=${config.userType || 'offline'}`,
      '--versionType=release',
      '--width=854',
      '--height=480'
    ];
    
    try {
      console.log('Starting Minecraft process...');
      
      // Проверка наличия JAR файлов версии
      const jarFiles = fs.readdirSync(versionsPath).filter(f => f.endsWith('.jar'));
      if (jarFiles.length === 0) {
        const error = `Файлы версии Minecraft ${config.versionId} не найдены в ${versionsPath}. Пожалуйста, скачайте версию или используйте стандартный лаунчер Minecraft для загрузки файлов.`;
        console.error(error);
        event.reply('launch-game-response', { success: false, message: error });
        return;
      }
      
      // Проверка наличия libraries - это необходимо для запуска
      const librariesPath = path.join(minecraftPath, 'libraries');
      if (!fs.existsSync(librariesPath) || fs.readdirSync(librariesPath).length === 0) {
        const error = `⚠️ Библиотеки Minecraft не найдены!`;
        console.error(error);
        event.reply('launch-game-response', { success: false, message: error });
        return;
      }
      
      // Читаем version.json чтобы получить список библиотек
      const versionJsonPath = path.join(versionsPath, `${config.versionId}.json`);
      let versionJson = null;
      
      if (fs.existsSync(versionJsonPath)) {
        try {
          const jsonContent = fs.readFileSync(versionJsonPath, 'utf-8');
          versionJson = JSON.parse(jsonContent);
        } catch (e) {
          console.warn('Failed to parse version JSON:', e.message);
        }
      }
      
      // Формируем classpath
      let classPathArray = [];
      
      // Добавляем client JAR файл
      classPathArray.push(path.join(versionsPath, `${config.versionId}.jar`));
      
      // Добавляем все библиотеки из version.json
      if (versionJson && versionJson.libraries) {
        for (const lib of versionJson.libraries) {
          if (lib.downloads?.artifact?.path) {
            const libPath = path.join(librariesPath, lib.downloads.artifact.path);
            if (fs.existsSync(libPath)) {
              classPathArray.push(libPath);
            } else {
              console.warn(`Library not found: ${libPath}`);
            }
          }
        }
      } else {
        // Fallback: если нет version.json, рекурсивно добавляем все JAR файлы из libraries
        console.warn('Version JSON not found, falling back to recursive library search');
        const findJars = (dir) => {
          const files = fs.readdirSync(dir);
          for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
              findJars(fullPath);
            } else if (file.endsWith('.jar')) {
              classPathArray.push(fullPath);
            }
          }
        };
        if (fs.existsSync(librariesPath)) {
          findJars(librariesPath);
        }
      }
      
      const classPath = classPathArray.join(';');
      console.log(`Classpath contains ${classPathArray.length} entries`);
      console.log('First 5 entries:', classPathArray.slice(0, 5));
      console.log('Classpath length:', classPath.length);
      
      // Use classpath file if classpath is too long (Windows limit ~32KB)
      let classpathArg = classPath;
      if (classPath.length > 20000) {
        console.log('⚠️ Classpath exceeds 20KB, using classpath file instead of command line');
        const classPathFile = path.join(versionsPath, '.classpathfile');
        fs.writeFileSync(classPathFile, classPathArray.join('\n'), 'utf8');
        classpathArg = '@' + classPathFile;
      }
      
      // Запуск игры в отдельном процессе
      const minecraft = spawn(javaBin, [...jvmArgs, '-cp', classpathArg, 'net.minecraft.client.main.Main', ...gameArgs], {
        cwd: minecraftPath,
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe']
      });
      
      // Store game process reference
      gameProcess = minecraft;
      
      // Initialize Minecraft Discord RPC
      console.log('🎮 Initializing Minecraft Discord RPC for version:', config.versionId);
      console.log('🎮 Instance name:', config.instanceName);
      
      // Wait a moment for Discord to be ready, then initialize RPC
      setTimeout(() => {
        minecraftRPC.initialize().then(() => {
          console.log('🎮 Minecraft RPC initialized, updating presence...');
          minecraftRPC.updateGamePresence({
            instanceName: config.instanceName || 'Minecraft',
            version: config.versionId
          });
        }).catch(err => {
          console.error('❌ Failed to initialize Minecraft RPC:', err);
        });
      }, 1000);
      
      minecraft.stdout?.on('data', (data) => {
        console.log(`[Minecraft stdout]: ${data}`);
      });
      
      let stderrOutput = '';
      minecraft.stderr?.on('data', (data) => {
        const output = data.toString();
        console.error(`[Minecraft stderr]: ${output}`);
        stderrOutput += output;
      });
      
      minecraft.on('error', (error) => {
        console.error('Failed to start Minecraft process:', error);
        const errorMsg = error.message.includes('ENOENT') 
          ? 'Java не найдена. Пожалуйста, установите Java JDK.'
          : `Ошибка запуска: ${error.message}`;
        event.reply('launch-game-response', { success: false, message: errorMsg });
      });
      
      minecraft.on('exit', (code) => {
        console.log(`Minecraft process exited with code ${code}`);
        
        // Clean up Minecraft Discord RPC
        console.log('🔌 Cleaning up Minecraft Discord RPC');
        minecraftRPC.destroy();
        gameProcess = null;
        
        // Show the launcher window when game exits
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
          console.log('✓ Launcher shown');
        }
        
        // Проверяем наличие ошибки об отсутствии библиотек в stderr
        if (code !== 0 && stderrOutput.includes('NoClassDefFoundError')) {
          const missingClass = stderrOutput.match(/NoClassDefFoundError:\s*(\S+)/)?.[1] || 'unknown';
          const error = `❌ ОШИБКА ЗАПУСКА

Отсутствует библиотека: ${missingClass}

Решение:
1. Запустите стандартный лаунчер Minecraft
2. Выберите версию ${config.versionId} и нажмите Play
3. Дождитесь загрузки всех файлов (это может занять несколько минут)
4. Закройте стандартный лаунчер
5. Вернитесь к Amethyst и попробуйте снова

Полный вывод ошибки:
${stderrOutput}`;
          event.reply('launch-game-response', { success: false, message: error });
        }
      });
      
      console.log(`Minecraft process started with PID: ${minecraft.pid}`);
      
      // Hide the launcher window when game starts
      if (mainWindow) {
        mainWindow.hide();
        console.log('✓ Launcher hidden');
      }
      
      event.reply('launch-game-response', { success: true, message: 'Game launched successfully' });
    } catch (error) {
      console.error('Failed to launch game:', error);
      event.reply('launch-game-response', { success: false, message: `Ошибка: ${error.message}` });
    }
  });
}

app.whenReady().then(() => {
  initDiscordRPC();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  console.log('🔌 All windows closed - cleaning up');
  
  // Clean up Minecraft RPC
  if (gameProcess) {
    console.log('🎮 Terminating Minecraft process');
    gameProcess.kill();
    gameProcess = null;
  }
  minecraftRPC.destroy();
  
  // Clean up launcher RPC
  clearDiscordPresence();
  if (rpcClient) {
    try {
      rpcClient.destroy();
    } catch (error) {
      console.error('Error destroying RPC client:', error);
    }
  }
  if (process.platform !== 'darwin') app.quit();
});
