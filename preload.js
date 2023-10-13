const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
	window: message => ipcRenderer.send('window', message),
	link: message => ipcRenderer.send('link', message),
	clear: message => ipcRenderer.send('clear', message),
	setLink: (callback) => ipcRenderer.on('setLink', callback),
	doClear: (callback) => ipcRenderer.on('doClear', callback)
});