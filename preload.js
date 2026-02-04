
const { contextBridge, ipcRenderer } = require('electron');

let downloadPromiseResolve = null;
let downloadPromiseReject = null;

contextBridge.exposeInMainWorld('electron', {
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  openFolder: (path) => ipcRenderer.send('open-folder', path),
  launchGame: (config) => ipcRenderer.send('launch-game', config),
  downloadVersion: (versionUrl) => {
    return new Promise((resolve, reject) => {
      downloadPromiseResolve = resolve;
      downloadPromiseReject = reject;
      ipcRenderer.send('download-version', versionUrl);
    });
  },
  optimizeMinecraft: () => {
    return new Promise((resolve, reject) => {
      ipcRenderer.once('optimize-minecraft-response', (event, response) => resolve(response));
      ipcRenderer.send('optimize-minecraft');
    });
  },
  updatePresence: (data) => ipcRenderer.send('update-discord-rpc', data),
  onLaunchResponse: (callback) => {
    ipcRenderer.on('launch-game-response', (event, response) => callback(response));
  },
  onDownloadProgress: (callback) => {
    ipcRenderer.on('download-progress', (event, data) => callback(data));
  },
  onDownloadResponse: (callback) => {
    ipcRenderer.on('download-version-response', (event, response) => callback(response));
  },
  ipcRenderer: ipcRenderer
});

// Слушаем ответ о завершении скачивания
ipcRenderer.on('download-version-response', (event, response) => {
  if (downloadPromiseResolve) {
    if (response.success) {
      downloadPromiseResolve(response);
    } else {
      downloadPromiseReject(new Error(response.message));
    }
    downloadPromiseResolve = null;
    downloadPromiseReject = null;
  }
});
