const mysql = require("mysql");
const { ipcMain, BrowserWindow, dialog } = require("electron");

const { getConnectionString, dblost } = require("../db");
let subWindow = null;

const createRawMatStockRcvWindow = () => {
  if (!subWindow) {
    subWindow = new BrowserWindow({
      width: 450,
      height: 600,
      autoHideMenuBar: true,

      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    subWindow.loadFile("view/raw_material_stock/receive.html");

    subWindow.on("closed", function () {
      subWindow = null;
    });
  } else {
    subWindow.focus();
  }
};

const createPackageRcvWindow = () => {
  if (!subWindow) {
    subWindow = new BrowserWindow({
      width: 450,
      height: 600,
      autoHideMenuBar: true,

      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    });

    subWindow.loadFile("view/package_stock/receive.html");

    subWindow.on("closed", function () {
      subWindow = null;
    });
  } else {
    subWindow.focus();
  }
};


/**
 * Regarding Raw Materials Receive
 */

ipcMain.on("raw:material:rcv:loaded", function (e, msg) {
  get_raw_mat_list(function (rows) {
    e.reply("raw:material:rcv:fetched", rows);
  });
});

ipcMain.on("raw:material:rcv:submit", function (e, item) {
  insert_raw_material(item, function (reply) {
    e.reply("raw:material:rcv:reply", reply);
  });
});

/**
 * ./Regarding Raw Materials Receive
 */


/**
 * Regarding Package Receive
 */

 ipcMain.on("package:rcv:loaded", function (e, msg) {
    get_package_list(function (rows) {
      e.reply("package:rcv:fetched", rows);
    });
  });
  
  ipcMain.on("package:rcv:submit", function (e, item) {
    insert_package(item, function (reply) {
      e.reply("package:rcv:reply", reply);
    });
  });
  
/**
 * ./Regarding Package Receive
 */

/**
 * CRUD Operation
 */
function insert_raw_material(item, callback) {
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

  let matname = item[0].replace(/['"]+/g, "");

  // Perform a query

  query =
    "INSERT INTO raw_material_stock (raw_mat_id, stock_qty,stock_type,ref_source) VALUES \
   ('" +
    item[0] +
    "', '" +
    item[1] +
    "', 'received', 'GRN')";

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

function insert_package(item, callback) {
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

  let matname = item[0].replace(/['"]+/g, "");

  // Perform a query

  query =
    "INSERT INTO package_stock (package_id, stock_qty,stock_type,ref_source) VALUES \
   ('" +
    item[0] +
    "', '" +
    item[1] +
    "', 'received', 'GRN')";

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

/**
 * ./CRUD Operation
 */

function get_raw_mat_list(callback) {
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
  query = "select * from raw_material_list order by raw_mat_name";

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

function get_package_list(callback) {
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

module.exports = { createRawMatStockRcvWindow, createPackageRcvWindow };
