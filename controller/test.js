const mysql = require("mysql");
const { ipcMain, BrowserWindow, dialog } = require("electron");
const { getConnectionString, dblost } = require("../db");
let subWindow = null;
let trackData;
let trackUnitData;
let trackRawMaterialsData;

const createTestWindow = () => {
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

    subWindow.loadFile("view/test/list.html");

    subWindow.on("closed", function () {
      subWindow = null;
    });
  } else {
    subWindow.focus();
  }
};

ipcMain.on("test:delete:request", function (e, id) {
  let response = dialog.showMessageBoxSync(subWindow, {
    type: "question",
    buttons: ["Yes", "No"],
    title: "Confirm",
    message: "Are you sure you want to delete?",
  });
  if (response == 0) {
    deleteQuery(id, function (reply) {
      if (reply == "success") subWindow.loadFile("view/test/list.html");
      else e.reply("test:list:deleted", reply);
    });
  }
});

ipcMain.on("test:edit:request", function (e, id) {
  get_by_id(id, function (row) {
    trackData = row;
    subWindow.loadFile("view/test/edit.html");
  });
});

ipcMain.on("test:add:loaded", function (e, id) {
  e.reply("test:add:fetched", trackUnitData);
  e.reply("test:add:fetched", trackRawMaterialsData);
});

ipcMain.on("test:edit:loaded", function (e, id) {
  e.reply("test:edit:fetched", [trackData, trackUnitData, trackRawMaterialsData]);
});

ipcMain.on("test:add:submit", function (e, item) {
  // console.log(item);
  insert(item, function (reply) {
    e.reply("test:add:reply", reply);
  });
});

ipcMain.on("test:edit:submit", function (e, item) {
  update(item, function (reply) {
    e.reply("test:edit:reply", reply);
  });
});

ipcMain.on("test:add:click", function (e, item) {
  subWindow.loadFile("view/test/add.html");
});

ipcMain.on("test:list:click", function (e, item) {
  subWindow.loadFile("view/test/list.html");
});

ipcMain.on("test:list:loaded", function (e, item) {
  let html = "";

  get_list(function (rows) {
    let sl = 1;
    rows.forEach(function (row) {
      html += "<tr>";
      html += "<td>";
      html += sl;
      html += "</td>";
      html += "<td>";
      html += row.test_name;
      html += "</td>";
      html += "<td>";
      html += row.unit_name;
      html += "</td>";

      html += "<td>";
      html +=
        '<button type="button" class="btn btn-danger btn-sm rounded-0" onClick="deleteMe(\'' +
        row.id +
        "')\" ><i class='material-icons'>&#xE872;</i></button> &nbsp;";

      html +=
        '<button type="button" class="btn btn-success btn-sm rounded-0" onClick="editMe(\'' +
        row.id +
        "')\" ><i class='material-icons'>&#xE254;</i></button>";
      html += "</td>";

      html += "</tr>";
      sl++;
    });

    e.reply("test:list:table", html);
  });
   
  get_units(function (rows) {
    trackUnitData = rows;
  });

  get_raw_materials(function (rows) {
    trackRawMaterialsData = rows;
  });

  
});

function insert(item, callback) {
  const connection = mysql.createConnection(getConnectionString());

  console.log(item[0]);
  console.log(item[1]);
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

  let testname = item[0].replace(/['"]+/g, "");
  let testUnit = item[1].replace(/['"]+/g, "");

  // Perform a query

  query =
    "INSERT INTO test (test_name, unit_name) VALUES \
   ('" +
   testname +
    "', '" +
    testUnit +
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

  let matname = item[1].replace(/['"]+/g, "");

  // Perform a query

  query =
    "update  test \
    set \
    test_name = '" +
    matname +
    "' , \
    unit_name = '" +
    item[2] +
    "'\
    where\
    test.id = '" +
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

  query = "delete from test where test.id=" + id;

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
  query = "select * from test order by test.id";

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
  query = "select * from test where test.id=" + id;

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


function get_raw_materials(callback) {
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
  query = "Select * from raw_material_list ORDER BY raw_material_list.raw_mat_name";
  // console.log(query);
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

module.exports = { createTestWindow };
