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
    function (error1, results1) {
      if (!error1) {
        mysql.query(
          "SELECT * FROM reviews WHERE product_id = ?",
          [request.params.id],
          function (error2, results2) {
            if (!error2) {
              response.render("product_detail", {
                header: "ESPRESSO SINGLE ORIGIN",
                product: results1[0],
                reviews: results2,
              });
            } else {
              console.log("Error");
            }
          }
        );
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

  if (!request.session.user) {
    return response.send(
      "<script>alert('로그인 해주세요'); location.href = '/';</script>"
    );
  }

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
    mysql.query(
      "INSERT INTO cart(member_id, product_id, product_name, kg, quantity, price) VALUES(?,?,?,?,?,?)",
      [
        user_member_id,
        product_id,
        body.product_name,
        body.product_option,
        body.product_quantity,
        body.product_totalPrice,
      ],
      function (error, results) {
        if (!error) {
          response.send(
            "<script>alert('장바구니에 상품이 담겼습니다'); location.href = '/';</script>"
          );
        } else {
          console.log("inputcartdata Error");
        }
      }
    );
  }
});

module.exports = router;
