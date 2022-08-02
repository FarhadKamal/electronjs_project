const mysql = require("mysql");
const { ipcMain, BrowserWindow, dialog } = require("electron");
const { getConnectionString, dblost } = require("../db");
let subWindow = null;
let trackData;
let trackUnitData;

const createPackageWindow = () => {
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

    subWindow.loadFile("view/package/list.html");

    subWindow.on("closed", function () {
      subWindow = null;
    });
  } else {
    subWindow.focus();
  }
};

ipcMain.on("pack:delete:request", function (e, id) {
  let response = dialog.showMessageBoxSync(subWindow, {
    type: "question",
    buttons: ["Yes", "No"],
    title: "Confirm",
    message: "Are you sure you want to delete?",
  });
  if (response == 0) {
    deleteQuery(id, function (reply) {
      if (reply == "success") subWindow.loadFile("view/package/list.html");
      else e.reply("pack:list:deleted", reply);
    });
  }
});

ipcMain.on("pack:edit:request", function (e, id) {
  get_by_id(id, function (row) {
    trackData = row;
    subWindow.loadFile("view/package/edit.html");
  });
});

ipcMain.on("pack:add:loaded", function (e, id) {
  e.reply("pack:add:fetched", trackUnitData);
});

ipcMain.on("pack:edit:loaded", function (e, id) {
  e.reply("pack:edit:fetched", [trackData, trackUnitData]);
});

ipcMain.on("pack:add:submit", function (e, item) {
  insert(item, function (reply) {
    e.reply("pack:add:reply", reply);
  });
});

ipcMain.on("pack:edit:submit", function (e, item) {
  update(item, function (reply) {
    e.reply("pack:edit:reply", reply);
  });
});

ipcMain.on("pack:add:click", function (e, item) {
  subWindow.loadFile("view/package/add.html");
});

ipcMain.on("pack:list:click", function (e, item) {
  subWindow.loadFile("view/package/list.html");
});

ipcMain.on("pack:list:loaded", function (e, item) {
  let html = "";

  get_list(function (rows) {
    let sl = 1;
    rows.forEach(function (row) {
      html += "<tr>";
      html += "<td>";
      html += sl;
      html += "</td>";
      html += "<td>";
      html += row.package_name;
      html += "</td>";
      html += "<td>";
      html += row.package_unit;
      html += "</td>";

      html += "<td>";
      html +=
        '<button type="button" class="btn btn-danger btn-sm rounded-0" onClick="deleteMe(\'' +
        row.package_id +
        "')\" ><i class='material-icons'>&#xE872;</i></button> &nbsp;";

      html +=
        '<button type="button" class="btn btn-success btn-sm rounded-0" onClick="editMe(\'' +
        row.package_id +
        "')\" ><i class='material-icons'>&#xE254;</i></button>";
      html += "</td>";

      html += "</tr>";
      sl++;
    });

    e.reply("pack:list:table", html);
  });
  get_units(function (rows) {
    trackUnitData = rows;
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

  let packname = item[0].replace(/['"]+/g, "");

  // Perform a query

  query =
    "INSERT INTO package_list (package_name, package_unit) VALUES \
   ('" +
    packname +
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

function update(item, callback) {
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

  let packname = item[1].replace(/['"]+/g, "");

  // Perform a query

  query =
    "update  package_list \
    set \
    package_name = '" +
    packname +
    "' , \
    package_unit = '" +
    item[2] +
    "'\
    where\
    package_id = '" +
    item[0] +
    "' ";

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

  query = "delete from package_list where package_id=" + id;

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
  query = "select * from package_list order by package_name";

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

function get_by_id(id, callback) {
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
  query = "select * from package_list where package_id=" + id;

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

function get_units(callback) {
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

module.exports = { createPackageWindow };
