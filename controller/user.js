const mysql = require("mysql");
const { ipcMain, BrowserWindow, session } = require("electron");
const { getConnectionString, dblost } = require("../db");

let subWindow = null;

const createAnotherWindow = () => {
  if (!subWindow) {
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
    });
  } else {
    subWindow.focus();
  }
};



ipcMain.on("user:name:request", function (e, item) {
  session.defaultSession.cookies
    .get({ url: "http://myapp.com" })
    .then((cookies) => {
      get_by_user_name(cookies[0].name, function (row) {
        console.log(row);
        e.reply("user:name:send", row);
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

function get_by_user_name(user, callback) {
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
  $query = "select * from users where username='" + user + "'";

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

module.exports = { createAnotherWindow };
