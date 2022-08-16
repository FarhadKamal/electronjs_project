const mysql = require("mysql");
const { ipcMain, BrowserWindow, dialog } = require("electron");
const { getConnectionString, dblost } = require("../db");
let subWindow = null;
let trackData;
let trackUnitData;
let trackSemiData;
let trackPackData;

const createFinishedGoodWindow = () => {
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

    subWindow.loadFile("view/finished_good/list.html");

    subWindow.on("closed", function () {
      subWindow = null;
    });
  } else {
    subWindow.focus();
  }
};

ipcMain.on("finished:good:delete:request", function (e, id) {
  let response = dialog.showMessageBoxSync(subWindow, {
    type: "question",
    buttons: ["Yes", "No"],
    title: "Confirm",
    message: "Are you sure you want to delete?",
  });
  if (response == 0) {
    deleteQuery(id, function (reply) {
      if (reply == "success")
        subWindow.loadFile("view/finished_good/list.html");
      else e.reply("finished:good:list:deleted", reply);
    });
  }
});

ipcMain.on("finished:good:edit:request", function (e, id) {
  get_by_id(id, function (row) {
    trackData = row;
    subWindow.loadFile("view/finished_good/edit.html");
  });
});

ipcMain.on("finished:good:add:loaded", function (e, id) {
  
  e.reply("finished:good:add:fetched", [trackUnitData, trackSemiData,trackPackData]);
});

ipcMain.on("finished:good:edit:loaded", function (e, id) {
  e.reply("finished:good:edit:fetched", [trackData, trackUnitData,trackSemiData,trackPackData]);
});

ipcMain.on("finished:good:add:submit", function (e, item) {
  insert(item, function (reply) {
    e.reply("finished:good:add:reply", reply);
  });
});

ipcMain.on("finished:good:edit:submit", function (e, item) {
  update(item, function (reply) {
    e.reply("finished:good:edit:reply", reply);
  });
});

ipcMain.on("finished:good:add:click", function (e, item) {
  subWindow.loadFile("view/finished_good/add.html");
});

ipcMain.on("finished:good:list:click", function (e, item) {
  subWindow.loadFile("view/finished_good/list.html");
});

ipcMain.on("finished:good:list:loaded", function (e, item) {
  let html = "";

  get_list(function (rows) {
    let sl = 1;
    rows.forEach(function (row) {
      html += "<tr>";
      html += "<td>";
      html += sl;
      html += "</td>";
      html += "<td>";
      html += row.finished_good_name;
      html += "</td>";
      html += "<td>";
      html += row.semi_good_name;
      html += "</td>";
      html += "<td>";
      html += row.package_name;
      html += "</td>";
      html += "<td>";
      html += row.finished_good_unit;
      html += "</td>";

      html += "<td>";
      html +=
        '<button type="button" class="btn btn-danger btn-sm rounded-0" onClick="deleteMe(\'' +
        row.finished_good_id +
        "')\" ><i class='material-icons'>&#xE872;</i></button> &nbsp;";

      html +=
        '<button type="button" class="btn btn-success btn-sm rounded-0" onClick="editMe(\'' +
        row.finished_good_id +
        "')\" ><i class='material-icons'>&#xE254;</i></button>";
      html += "</td>";

      html += "</tr>";
      sl++;
    });

    e.reply("finished:good:list:table", html);
  });
  get_units(function (rows) {
    trackUnitData = rows;
  });
  get_semi_goods(function (rows) {
    trackSemiData = rows;
  });
  get_pack_list(function (rows) {
    trackPackData = rows;
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

  let finishedname = item[0].replace(/['"]+/g, "");

  // Perform a query

  query =
    "INSERT INTO finished_good_list (finished_good_name,semi_good_id ,finished_good_unit,package_id) VALUES \
   ('" +
    finishedname +
    "', '" +
    item[1] +
    "', '" +
    item[2] +
    "', '" +
    item[3] +
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
    "update  finished_good_list \
    set \
    finished_good_name = '" +
    matname +
    "' , \
    semi_good_id = '" +
    item[2] +
    "',\
    finished_good_unit = '" +
    item[3] + 
    "',\
    package_id = '" +
    item[4] + "'\
     where finished_good_id = '" +
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

  query = "delete from finished_good_list where finished_good_id=" + id;

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
  query =
    "select finished_good_list.*,semi_good_name,package_name from finished_good_list inner \
     join semi_good_list on semi_good_list.semi_good_id=finished_good_list.semi_good_id \
     join package_list on package_list.package_id=finished_good_list.package_id \
      order by finished_good_name";

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
  query = "select * from finished_good_list where finished_good_id=" + id;

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

function get_semi_goods(callback) {
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

function get_pack_list(callback) {
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

module.exports = { createFinishedGoodWindow };
