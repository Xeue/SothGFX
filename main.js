/* eslint-disable no-unused-vars */

const path = require('path');
const {app, BrowserWindow, ipcMain} = require('electron');
const {version} = require('./package.json');
const electronEjs = require('electron-ejs');

const __static = __dirname+'/static';


/* Globals */

let isQuiting = false;
let mainWindow = null;
const devEnv = app.isPackaged ? './' : './';
const __main = path.resolve(__dirname, devEnv);

/* Start App */

(async () => {

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
		default:
			break;
		}
	});

	app.on('before-quit', function () {
		isQuiting = true;
	});

	app.on('activate', async () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
}

async function createWindow() {
	const windowOptions = {
		width: 1920,
		height: 1080,
		autoHideMenuBar: true,
		webPreferences: {
			contextIsolation: true
		},
		icon: path.join(__static, 'img/icon/icon.png'),
		show: false,
		frame: false,
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: '#002349',
			symbolColor: '#002349',
			height: 56
		}
	}
	
    mainWindow = new BrowserWindow(windowOptions);

	if (!app.commandLine.hasSwitch('hidden')) {
		mainWindow.show();
	} else {
		mainWindow.hide();
	}

	mainWindow.on('close', function (event) {
	});

	mainWindow.on('minimize', function (event) {
	});

	mainWindow.loadURL(path.resolve(__main, 'views/app.ejs'));
}