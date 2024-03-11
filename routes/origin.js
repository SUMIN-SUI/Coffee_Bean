const express = require("express");
const mysql = require("./mysqlconn");

const router = express.Router();

router.get("/", function (request, response) {
  mysql.query(
    `SELECT * FROM product WHERE sort_id = 2`,
    function (error, results) {
      if (!error) {
        response.render("product", {
          header: "ESPRESSO SINGLE ORIGIN",
          productList: results,
        });
      } else {
        console.log("Error");
      }
    }
  );
});

router.get("/:id", function (request, response) {
  response.send("okok");
});

module.exports = router;
