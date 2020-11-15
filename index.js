var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
require('dotenv').config();

const express = require('express')
const app = express()
const port = process.env.APP_PORT

const config = {
  server: process.env.DB_SERVER,
  options: {
    trustServerCertificate: true,
    database: process.env.DB_NAME
  },
  authentication: {
    type: "default",
    options: {  
      userName: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    }
  }
};

var connection = new Connection(config)

const route = function() {
  app.get('/person', (req, res) => {
    let array = [];
    const request = new Request("SELECT * FROM Persons", function (err, rowCount) { //SELECT TOP(100) * FROM INV_STOCK
      if (err) {
        console.log(err)
      }
    }).on('row', function (columns) {
      array.push(columns);
    }).on('doneProc', function(){
      let jsonArray = []
      array.forEach((columns) => {
        let rowObject ={};
        columns.forEach((column) => {
            rowObject[column.metadata.colName] = column.value;
        });
        jsonArray.push(rowObject)
      });
      res.json(jsonArray, 200);
    })    

    connection.execSql(request)
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
}

connection.on('connect', function (err) {
  if (err) {
    console.log(err)
  } else {
    route(); 
  }
})