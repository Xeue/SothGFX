/* eslint-disable no-unused-vars */

const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const {version} = require('./package.json');
const electronEjs = require('electron-ejs');

const __static = __dirname+'/static';


/* Globals */

let mainWindow = null;
let popWindow = null;
const devEnv = app.isPackaged ? './' : './';
const __main = path.resolve(__dirname, devEnv);

/* Start App */

(async () => {
    app.commandLine.appendSwitch("disable-gpu");
	await app.whenReady();
	await setUpApp();
	await createWindow();

})().catch(error => {
	console.log(error);
});


const ejs = new electronEjs({
	'static': __static,
	'version': version
}, {});


/* Electron */


async function setUpApp() {
	ipcMain.on('window', (event, message) => {
		switch (message) {
		case 'exit':
			app.quit();
			break;
		case 'minimise':
			mainWindow.hide();
			break;
		case 'reset':
			mainWindow.setSize(1920, 1080);
			break;
		case 'popout':
			createPopoutWindow();
			break;
		case 'hide':
			if (mainWindow.getOpacity() == 0) {
				mainWindow.setOpacity(1);
			} else {
				mainWindow.setOpacity(0);
			}
			break;
		default:
			break;
		}
	});

	ipcMain.on('link', (event, link) => {
		mainWindow.webContents.send('setLink', link);
	});

	ipcMain.on('clear', () => {
		mainWindow.webContents.send('doClear');
	});

	ipcMain.on('sponsor', () => {
		mainWindow.webContents.send('doSponsor');
	});

	app.on('before-quit', function () {
		isQuiting = true;
	});

	app.on('activate', async () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
}

async function createWindow() {
    mainWindow = new BrowserWindow({
		width: 1920,
		height: 1080,
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true,
			preload: path.resolve(__main, 'preload.js')
		},
		icon: path.join(__static, 'icon.ico'),
		show: false,
		frame: false,
		titleBarStyle: 'hidden',
		titleBarOverlay: false,
		opacity: 1
	}
	);

	if (!app.commandLine.hasSwitch('hidden')) {
		mainWindow.show();
	} else {
		mainWindow.hide();
	}

	mainWindow.loadURL(path.resolve(__main, 'views/app.ejs'));
	createPopoutWindow();
}

async function createPopoutWindow() {
    popWindow = new BrowserWindow({
		width: 1450,
		height: 500,
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true,
			preload: path.resolve(__main, 'preload.js')
		},
		icon: path.join(__static, 'icon.ico'),
		show: false,
		frame: true
	}
	);

	if (!app.commandLine.hasSwitch('hidden')) {
		popWindow.show();
	} else {
		popWindow.hide();
	}

	popWindow.loadURL(path.resolve(__main, 'views/popout.ejs'));
}