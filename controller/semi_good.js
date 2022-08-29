const mysql = require("mysql");
const { ipcMain, BrowserWindow, dialog } = require("electron");
const { getConnectionString, dblost } = require("../db");
let subWindow = null;
let trackData;
let trackUnitData;
let raw_material_table;

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
    raw_material_table = "";
    // Raw Material List
    get_raw_material_list_by_id(id, function (row2) {
      let sl = 1;
      row2.forEach(function (raw_material) {
        raw_material_table += "<tr>";
        raw_material_table += "<td>";
        raw_material_table += sl;
        raw_material_table += "</td>";
        raw_material_table += "<td>";
        raw_material_table += raw_material.raw_mat_name;
        raw_material_table +=
          "<input type='hidden' name='raw_materials_id[]' id='raw_materials_id' value = '" +
          raw_material.raw_mat_id +
          "' />";
        raw_material_table += "</td>";
        raw_material_table += "<td>";
        raw_material_table +=
          "<input type='number' name='raw_materials_qty[]' id='raw_materials_qty' value='" +
          raw_material.qty +
          "' class='form-control' min='0' step='Any' />";
        raw_material_table += "</td>";
        raw_material_table += "</tr>";

        sl++;
      });
    });
    subWindow.loadFile("view/semi_good/edit.html");
  });
});

ipcMain.on("semi:good:add:loaded", function (e, id) {
  let html = "";
  // Raw Material List
  get_raw_material_list(function (rows) {
    let sl = 1;
    rows.forEach(function (row) {
      html += "<tr>";
      html += "<td>";
      html += sl;
      html += "</td>";
      html += "<td>";
      html += row.raw_mat_name;
      html +=
        "<input type='hidden' name='raw_materials_id[]' id='raw_materials_id' value = '" +
        row.raw_mat_id +
        "' />";
      html += "</td>";
      html += "<td>";
      html +=
        "<input type='number' name='raw_materials_qty[]' id='raw_materials_qty' value='0' class='form-control' min='0' step='Any' />";
      html += "</td>";
      html += "</tr>";

      sl++;
    });
    // console.log(html);
    e.reply("semi:good:add:fetched", [trackUnitData, html]);
  });
});

ipcMain.on("semi:good:edit:loaded", function (e, id) {
  e.reply("semi:good:edit:fetched", [
    trackData,
    trackUnitData,
    raw_material_table,
  ]);
});

ipcMain.on("semi:good:add:submit", function (e, item) {
  // console.log(item);

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
  get_units(function (rows) {
    trackUnitData = rows;
  });
});

function insert(item, callback) {
  const connection = mysql.createConnection(getConnectionString());

  // console.log(item);

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
      callback(err.sqlMessage);

      // Close the connection
      connection.end(function () {});

      return console.error(error.message);
    } else {
      const insertid = result.insertId;

      // console.log(insertid);

      let raw_material_id = item[2];
      let raw_material_qty = item[3];
      let insert_query = "";

      for (let index = 0; index < raw_material_id.length; index++) {
        const semi_item_id = insertid;
        const raw_mat_id = raw_material_id[index];
        const qty = raw_material_qty[index];
        insert_query +=
          "(" + semi_item_id + "," + raw_mat_id + "," + qty + "),";
      }

      let test_query = insert_query.slice(0, -1);
      query_semi_good_component =
        "INSERT INTO semi_good_components (semi_good_id, raw_mat_id, qty) VALUES " +
        test_query;
      // console.log(query_semi_good_component);

      connection.query(query_semi_good_component, function (err, result) {
        if (err) {
          console.log("An error ocurred performing the query.");
          callback(err.sqlMessage);

          // Close the connection
          connection.end(function () {});
          return console.error(error.message);
        }
        return;
      });
    }
    // Close the connection
    connection.end(function () {});
    callback("success");
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
      callback(err.sqlMessage);

      // Close the connection
      connection.end(function () {});

      return console.error(error.message);
    }
    // console.log(item);

    let raw_material_id = item[3];
    let raw_material_qty = item[4];
    let semi_item_id = item[0];
    // deleting all previous component of semi goods.
    //delete_semi_goods_componenet(semi_item_id);

    delete_semi_goods_componenet(semi_item_id, function (res) {
      if (res == "deleted")
        insert_semi_goods_component_after_update(
          raw_material_id,
          raw_material_qty,
          semi_item_id
        );
    });

    // Inserting New Components After Deleting The Previous One

    connection.end(function () {});
    callback("success");
  });
}

function deleteQuery(id, callback) {
  delete_semi_goods_componenet(id, function (res) {
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
  query =
    "select raw_material_list.raw_mat_id, CONCAT(raw_material_list.raw_mat_name,' (',raw_material_list.raw_mat_unit,')') AS raw_mat_name, 0 AS qty From raw_material_list";
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

function get_raw_material_list_by_id(id, callback) {
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
    "SELECT semi_good_components.raw_mat_id, CONCAT(raw_material_list.raw_mat_name,' (',raw_material_list.raw_mat_unit,')') AS raw_mat_name, \
           semi_good_components.qty \
            from semi_good_components \
            INNER JOIN raw_material_list ON raw_material_list.raw_mat_id = semi_good_components.raw_mat_id \
            WHERE semi_good_components.semi_good_id = " +
    id +
    " AND semi_good_components.qty > 0 \
            UNION \
            SELECT raw_material_list.raw_mat_id, CONCAT(raw_material_list.raw_mat_name,' (',raw_material_list.raw_mat_unit,')') AS raw_mat_name, 0 AS qty FROM raw_material_list WHERE raw_material_list.raw_mat_id NOT IN \
            (SELECT raw_mat_id from semi_good_components WHERE semi_good_components.semi_good_id = " +
    id +
    " AND semi_good_components.qty > 0)";

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

function delete_semi_goods_componenet(id, callback) {
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
  // Deleting All Components
  query = "delete from semi_good_components where semi_good_id=" + id;
  // console.log(query);
  connection.query(query, function (err, result) {
    if (err) {
      console.log("An error ocurred performing the query.");
      console.log(err);
      callback(err);
      return;
    } else callback("deleted");
  });

  // Close the connection
  connection.end(function () {
    // The connection has been closed
  });

  return;
}

function insert_semi_goods_component_after_update(
  raw_material_id_list,
  raw_material_qty_list,
  semi_good_id
) {
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

  const raw_material_id = raw_material_id_list;
  const raw_material_qty = raw_material_qty_list;
  const item_id = semi_good_id;

  let insert_query = "";

  for (let index = 0; index < raw_material_id.length; index++) {
    const semi_item_id = item_id;
    const raw_mat_id = raw_material_id[index];
    const qty = raw_material_qty[index];
    insert_query += "(" + semi_item_id + "," + raw_mat_id + "," + qty + "),";
  }

  let test_query = insert_query.slice(0, -1);
  query =
    "insert into semi_good_components (semi_good_id, raw_mat_id, qty) VALUES " +
    test_query;

  connection.query(query, function (err, result) {
    if (err) {
      console.log("An error ocurred performing the query.");
      console.log(err);
      callback(err);
      return;
    }
  });

  // Close the connection
  connection.end(function () {
    // The connection has been closed
  });

  return;
}

module.exports = { createSemiGoodWindow };
