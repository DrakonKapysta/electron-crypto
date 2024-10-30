const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const { sha1 } = require("./functions/sha1");
const {
  generateParameters,
  generateKeys,
  signMessage,
  verifySignature,
} = require("./functions/dss");

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

let privateKey = 0;

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    // autoHideMenuBar: true,
  });

  mainWindow.setMenuBarVisibility(false);
  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  // Open the DevTools.
  const isDebug =
    process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";
  if (isDebug) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.webContents.on("will-navigate", () => {
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  ipcMain.handle("sha-1", async (event, payload) => {
    const res = sha1(payload.message);
    return { status: "success", data: res };
  });
  ipcMain.handle("sign-dss", async (event, payload) => {
    const params = generateParameters();
    const keys = generateKeys(params);
    const signature = signMessage(params, keys, payload.message);
    privateKey = keys.x;

    return {
      status: "success",
      data: {
        params,
        publicKey: keys.y,
        signature,
        message: payload.message,
      },
    };
  });
  ipcMain.handle("verify-dss", async (event, payload) => {
    const verified = verifySignature(
      payload.params,
      { y: payload.publicKey },
      payload.message,
      payload.signature
    );
    return { status: "success", data: verified };
  });
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
