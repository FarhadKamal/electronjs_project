// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, Menu, session } = require("electron");
const path = require("path");

const { createRawMaterialWindow } = require("./controller/raw_material");
const { get_user_details } = require("./controller/user");
const { createLoginWindow } = require("./controller/login");

// development or production
process.env.NODE_ENV = "development";

let mainWindow;
let userRole;

//Menu ITEM After Login
const mainMenuTemplate = [
  {
    label: "Profile",
    submenu: [
      {
        label: "logout",

        click() {
          destroySession();
        },
      },
      {
        label: "Exit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
  {
    label: "Items",
    submenu: [
      {
        label: "Raw Material",

        click() {
          createRawMaterialWindow();
        },
      },
      {
        label: "Get User Details",

        click() {
          
          console.log(get_user_details())
       
        },
      },
    ],
  },
];



// Do not touch below!
// Do not touch below!
// Do not touch below!
// Do not touch below!
// Do not touch below!
// Do not touch below!
// Do not touch below!

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on("closed", function () {
    app.quit();
  });
  const mainMenu = Menu.buildFromTemplate(dummyMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

const dummyMenuTemplate = [
  {
    label: "Profile",
    submenu: [
      {
        label: "login",

        click() {
          createLoginWindow();
        },
      },
      {
        label: "Exit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        click() {
          app.quit();
        },
      },
    ],
  },
];

function checkSession() {
  let rtn = false;
  session.defaultSession.cookies
    .get({ url: "http://myapp.com" })
    .then((cookies) => {
      if (cookies.length > 0) rtn = true;
    })
    .catch((error) => {
      console.log(error);
    });

  return rtn;
}

function destroySession() {
  session.defaultSession.clearStorageData([], (data) => {});
  const mainMenu = Menu.buildFromTemplate(dummyMenuTemplate);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.loadFile("index.html");
}

if (process.platform == "darwin") {
  mainMenuTemplate.unshift({});
  dummyMenuTemplate.unshift({});
}

if (process.env.NODE_ENV != "production") {
  mainMenuTemplate.push({
    label: "Developer Tools",
    submenu: [
      {
        label: "Toggle DevTools",
        accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        role: "reload",
      },
    ],
  });
}

ipcMain.on("login:success", function (e, item) {
  if (!checkSession()) {
    session.defaultSession.cookies
      .get({ url: "http://myapp.com" })
      .then((cookies) => {
        userRole=cookies[0].value
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
        Menu.setApplicationMenu(mainMenu);
        mainWindow.loadFile("dashboard.html");
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;
