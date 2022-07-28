const mysql = require("mysql");
const { ipcMain, BrowserWindow } = require("electron");
const { getConnectionString, dblost } = require("../db");
let subWindow = null;

const createRawMaterialWindow = () => {
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

    subWindow.loadFile("view/raw_material_list.html");

    subWindow.on("closed", function () {
      subWindow = null;
    });
  } else {
    subWindow.focus();
  }
};

ipcMain.on("raw:material:delete:request", function (e, id) {
  deleteQuery(id, function (reply) {
    e.reply("raw:material:list:deleted", reply);
    subWindow.loadFile("view/raw_material_list.html");
  });
});

ipcMain.on("raw:material:add:submit", function (e, item) {
  insert(item, function (reply) {
    e.reply("raw:material:add:reply", reply);
  });
});

ipcMain.on("raw:material:add:click", function (e, item) {
  subWindow.loadFile("view/raw_material_add.html");
});

ipcMain.on("raw:material:add:submit:success", function (e, item) {
  subWindow.loadFile("view/raw_material_list.html");
  e.reply("raw:material:add:submit:reply", "added");
});

ipcMain.on("raw:material:list:loaded", function (e, item) {
  let html = "";

  get_raw_material_list(function (rows) {
    let sl = 1;
    rows.forEach(function (row) {
      html += "<tr>";
      html += "<td>";
      html += sl;
      html += "</td>";
      html += "<td>";
      html += row.raw_mat_name;
      html += "</td>";
      html += "<td>";
      html += row.raw_mat_unit;
      html += "</td>";

      html += "<td>";
      html +=
        '<button type="button" class="btn btn-danger" onClick="deleteMe(\'' +
        row.raw_mat_id +
        "')\" >Delete</button>";
      html += "</td>";

      html += "</tr>";
      sl++;
    });

    e.reply("raw:material:list:table", html);
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

  // Perform a query

  query =
    "INSERT INTO raw_material_list (raw_mat_name, raw_mat_unit) VALUES \
   ('" +
    item[0] +
    "', '" +
    item[1] +
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

  query = "delete from raw_material_list where raw_mat_id=" + id;

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

function get_raw_material_list(callback) {
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
  $query = "select * from raw_material_list order by raw_mat_id desc";

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

module.exports = { createRawMaterialWindow };
