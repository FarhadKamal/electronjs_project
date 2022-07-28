
const {  BrowserWindow } = require("electron");

let subWindow=null;

const createAnotherWindow = () => {
  
if(!subWindow){


  subWindow = new BrowserWindow({
    width: 600,
    height: 400,
    autoHideMenuBar: true,

    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  subWindow.loadFile("index.html");

  subWindow.on("closed", function () {
    subWindow = null;
  }); }else{
    subWindow.focus()
 
  }
};


module.exports = { createAnotherWindow };
