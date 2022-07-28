const mysql = require("mysql");
const { session, BrowserWindow, ipcMain, dialog } = require("electron");
const { getConnectionString, dblost } = require("../db");

let user = "";
let pass = "";
let loginWindow = null;

const createLoginWindow = () => {
  if (!loginWindow) {
    loginWindow = new BrowserWindow({
      width: 400,
      height: 400,
      autoHideMenuBar: true,

      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    loginWindow.loadFile("view/login.html");

    loginWindow.on("closed", function () {
      loginWindow = null;
    });
  } else {
    loginWindow.focus();
  }
};

ipcMain.on("login:submit", function (e, item) {
  user = item[0].replace(/['"]+/g, "");
  pass = item[1].replace(/['"]+/g, "");

  login(function (rows) {
    // console.log(rows[0].displayname)
    if (rows.length > 0) {
      e.reply("login:reply", "success");
      setSession(rows[0].username, rows[0].role);
      checkSession();
    } else e.reply("login:reply", "faled");
  });
});

function checkSession() {
  session.defaultSession.cookies
    .get({ url: "http://myapp.com" })
    .then((cookies) => {
      console.log(cookies);
    })
    .catch((error) => {
      console.log(error);
    });
}

function setSession(name, value) {
  session.defaultSession.clearStorageData([], (data) => {});

  let cookie = {
    url: "http://myapp.com",
    name: name,
    value: value,
    expirationDate: 99999999999,
  };
  session.defaultSession.cookies.set(cookie).then(
    () => {},
    (error) => {
      console.error(error);
    }
  );
}

function login(callback) {
  const connection = mysql.createConnection(getConnectionString());

  // connect to mysql
  connection.connect(function (err) {
    // in case of error
    if (err) {
      console.log(err.code);
      console.log(err.fatal);

      dblost();
    }
  });

  // Perform a query
  $query =
    "select * from users where username='" +
    user +
    "' and users.password=sha1('" +
    pass +
    "')";

  connection.query($query, function (err, rows, fields) {
    if (err) {
      console.log("An error ocurred performing the query.");
      console.log(err);
      return;
    }

    callback(rows);
  });

  // Close the connection
  connection.end(function () {
    // The connection has been closed
  });
}

module.exports = { createLoginWindow };
