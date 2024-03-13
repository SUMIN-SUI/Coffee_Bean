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
          link: "origin",
          productList: results,
        });
      } else {
        console.log("Error");
      }
    }
  );
});

router.get("/:id", function (request, response) {
  mysql.query(
    "SELECT * FROM product WHERE id = ?",
    [request.params.id],
    function (error, results) {
      if (!error) {
        response.render("product_detail", {
          header: "ESPRESSO SINGLE ORIGIN",
          product: results[0],
        });
      } else {
        console.log("Error");
      }
    }
  );
});

router.post("/:id", function (request, response) {
  const body = request.body;
  let user_member_id;
  let product_id;

  function getUserData() {
    mysql.query(
      `SELECT member_id FROM user WHERE id = '${request.session.user.user_id}'`,
      async function (error, results) {
        if (!error) {
          let result = await results[0].member_id;
          user_member_id = result;
          getProductData();
        } else {
          console.log("getuserdata Error");
        }
      }
    );
  }
  getUserData();

  function getProductData() {
    mysql.query(
      `SELECT id FROM product WHERE name = '${body.product_name}'`,
      async function (error, results) {
        if (!error) {
          let result = await results[0].id;
          product_id = result;
          inputCartData();
        } else {
          console.log("getproductdata Error");
        }
      }
    );
  }

  function inputCartData() {
    const cartId = Math.floor(Math.random() * 1000);
    mysql.query(
      "INSERT INTO cart(member_id, product_id, product_name, kg, quantity, price) VALUES(?,?,?,?,?,?)",
      [
        user_member_id,
        product_id,
        body.product_name,
        body.product_option,
        body.product_quantity,
        body.product_price,
      ],
      function (error, results) {
        if (!error) {
          // response.redirect("/");
        } else {
          console.log(error);
          console.log("inputcartdata Error");
        }
      }
    );
  }
});

module.exports = router;
