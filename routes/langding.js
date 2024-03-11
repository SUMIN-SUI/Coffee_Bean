const express = require("express");
const mysql = require("./mysqlconn");

const router = express.Router();

router.get("/", function (request, response) {
  mysql.query(`SELECT * FROM product `, function (error, results) {
    if (!error) {
      response.render("landing", {
        products: results,
      });
    } else {
      console.log("Error");
    }
  });
});

module.exports = router;
