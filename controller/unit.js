const mysql = require("mysql");
const { ipcMain, session, BrowserWindow, dialog } = require("electron");
const { getConnectionString, dblost } = require("../db");
let subWindow = null;

const createUnitWindow = () => {
  session.defaultSession.cookies
    .get({ url: "http://myapp.com" })
    .then((cookies) => {
      if (cookies[0].value == "Admin") {
        if (!subWindow) {
          subWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            autoHideMenuBar: true,

            webPreferences: {
              nodeIntegration: true,
              contextIsolation: false,
            },
          });

          subWindow.loadFile("view/unit/list.html");

          subWindow.on("closed", function () {
            subWindow = null;
          });
        } else {
          subWindow.focus();
        }
      } else {
        dialog.showErrorBox(
          "Unauthorized Access",
          "You don't have permission to access it!"
        );
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

ipcMain.on("unit:delete:request", function (e, id) {
  let response = dialog.showMessageBoxSync(subWindow, {
    type: "question",
    buttons: ["Yes", "No"],
    title: "Confirm",
    message: "Are you sure you want to delete?",
  });
  if (response == 0) {
    deleteQuery(id, function (reply) {
      if (reply == "success") subWindow.loadFile("view/unit/list.html");
      else e.reply("unit:list:deleted", reply);
    });
  }
});

ipcMain.on("unit:add:submit", function (e, item) {
  insert(item, function (reply) {
    e.reply("unit:add:reply", reply);
  });
});

ipcMain.on("unit:add:click", function (e, item) {
  subWindow.loadFile("view/unit/add.html");
});

ipcMain.on("unit:list:click", function (e, item) {
  subWindow.loadFile("view/unit/list.html");
});

ipcMain.on("unit:list:loaded", function (e, item) {
  let html = "";

  get_list(function (rows) {
    let sl = 1;
    rows.forEach(function (row) {
      html += "<tr>";
      html += "<td>";
      html += sl;
      html += "</td>";
      html += "<td>";
      html += row.unit_name;
      html += "</td>";
      html += "<td>";
      html += row.unit_details;
      html += "</td>";

      html += "<td>";
      html +=
        '<button type="button" class="btn btn-danger btn-sm rounded-0" onClick="deleteMe(\'' +
        row.unit_name +
        "')\" ><i class='material-icons'>&#xE872;</i></button>";
      html += "</td>";

      html += "</tr>";
      sl++;
    });

    e.reply("unit:list:table", html);
  });
});

function insert(item, callback) {
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

  //data cleaning

  let unitname = item[0].replace(/['"]+/g, "");
  let unitdetails = item[1].replace(/['"]+/g, "");
  // Perform a query

  query =
    "INSERT INTO unit_list (unit_name, unit_details) VALUES \
   ('" +
    unitname +
    "', '" +
    unitdetails +
    "')";

  connection.query(query, function (err, result) {
    if (err) {
      console.log("An error ocurred performing the query.");
      console.log(err);
      callback(err.sqlMessage);
      return;
    }

    callback("success");
  });

  // Close the connection
  connection.end(function () {
    // The connection has been closed
  });
}

function deleteQuery(id, callback) {
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

  query = "delete from unit_list where unit_name='" + id + "'";

  connection.query(query, function (err, result) {
    if (err) {
      console.log("An error ocurred performing the query.");
      console.log(err);
      callback(err);
      return;
    }

    callback("success");
  });

  // Close the connection
  connection.end(function () {
    // The connection has been closed
  });
}

function get_list(callback) {
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
  query = "select * from unit_list order by unit_name";

  connection.query(query, function (err, rows, fields) {
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

module.exports = { createUnitWindow };
