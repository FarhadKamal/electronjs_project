const mysql = require("mysql");
const { ipcMain, BrowserWindow, dialog } = require("electron");
const { getConnectionString, dblost } = require("../db");
let subWindow = null;
let trackData;

const createSemiGoodWindow = () => {
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

    subWindow.loadFile("view/semi_good/list.html");

    subWindow.on("closed", function () {
      subWindow = null;
    });
  } else {
    subWindow.focus();
  }
};

ipcMain.on("semi:good:delete:request", function (e, id) {
  let response = dialog.showMessageBoxSync(subWindow, {
    type: "question",
    buttons: ["Yes", "No"],
    title: "Confirm",
    message: "Are you sure you want to delete?",
  });
  if (response == 0) {
    deleteQuery(id, function (reply) {
      if (reply == "success") subWindow.loadFile("view/semi_good/list.html");
      else e.reply("semi:good:list:deleted", reply);
    });
  }
});

ipcMain.on("semi:good:edit:request", function (e, id) {
  get_by_id(id, function (row) {
    trackData = row;
    subWindow.loadFile("view/semi_good/edit.html");
  });
});

ipcMain.on("semi:good:edit:loaded", function (e, id) {
  e.reply("semi:good:edit:fetched", trackData);
});

ipcMain.on("semi:good:add:submit", function (e, item) {
  insert(item, function (reply) {
    e.reply("semi:good:add:reply", reply);
  });
});

ipcMain.on("semi:good:edit:submit", function (e, item) {
  update(item, function (reply) {
    e.reply("semi:good:edit:reply", reply);
  });
});

ipcMain.on("semi:good:add:click", function (e, item) {
  subWindow.loadFile("view/semi_good/add.html");
});

ipcMain.on("semi:good:list:click", function (e, item) {
  subWindow.loadFile("view/semi_good/list.html");
});

ipcMain.on("semi:good:list:loaded", function (e, item) {
  let html = "";

  get_list(function (rows) {
    let sl = 1;
    rows.forEach(function (row) {
      html += "<tr>";
      html += "<td>";
      html += sl;
      html += "</td>";
      html += "<td>";
      html += row.semi_good_name;
      html += "</td>";
      html += "<td>";
      html += row.semi_good_unit;
      html += "</td>";

      html += "<td>";
      html +=
        '<button type="button" class="btn btn-danger btn-sm rounded-0" onClick="deleteMe(\'' +
        row.semi_good_id +
        "')\" ><i class='material-icons'>&#xE872;</i></button> &nbsp;";

      html +=
        '<button type="button" class="btn btn-success btn-sm rounded-0" onClick="editMe(\'' +
        row.semi_good_id +
        "')\" ><i class='material-icons'>&#xE254;</i></button>";
      html += "</td>";

      html += "</tr>";
      sl++;
    });

    e.reply("semi:good:list:table", html);
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

  let seminame = item[0].replace(/['"]+/g, "");

  // Perform a query

  query =
    "INSERT INTO semi_good_list (semi_good_name, semi_good_unit) VALUES \
   ('" +
    seminame +
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

  let matname = item[1].replace(/['"]+/g, "");

  // Perform a query

  query =
    "update  semi_good_list \
    set \
    semi_good_name = '" +
    matname +
    "' , \
    semi_good_unit = '" +
    item[2] +
    "'\
    where\
    semi_good_id = '" +
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

  query = "delete from semi_good_list where semi_good_id=" + id;

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
  query = "select * from semi_good_list order by semi_good_name";

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
  query = "select * from semi_good_list where semi_good_id=" + id;

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

module.exports = { createSemiGoodWindow };
