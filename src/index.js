const { app, BrowserWindow, ipcMain } = require("electron");
const windowStateKeeper = require("electron-window-state");
const path = require("node:path");

let isDev;
let mainWindow;

(async () => {
  isDev = (await import("electron-is-dev")).default;

  if (require("electron-squirrel-startup")) {
    app.quit();
  }

  const createWindow = () => {
    let mainWindowState = windowStateKeeper({
      defaultWidth: 1000,
      defaultHeight: 800,
    });

    mainWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      title: "This is title",
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));

    if (isDev) mainWindow.webContents.openDevTools();

    mainWindowState.manage(mainWindow);
  };

  app.whenReady().then(() => {
    createWindow();

    setTimeout(() => {
      ipcMain.handle("data", (event, data) => {
        console.log(data);
      });
    }, 3000);

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
})();

mainWindow?.webContents?.send();
