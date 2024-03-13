const express = require("express");
const mysql = require("./mysqlconn");

const router = express.Router();

router.post("/", function (request, response) {
  mysql.query("SELECT SUM(price) FROM cart;", function (error, results) {
    if (!error) {
      const totalPrice = results[0]["SUM(price)"];
      mysql.query(
        "SELECT cart.product_id,  cart.product_name, cart.kg, cart.quantity, user.member_id, user.name, user.tel, user.address FROM cart, user WHERE cart.member_id  = user.member_id;",
        function (error, results) {
          if (!error) {
            response.render("order", {
              orderInfo: results,
              totalPrice: totalPrice,
            });
          } else {
            console.log("Error");
          }
        }
      );
    } else {
      console.log("Error");
    }
  });
});

router.post("/checkout", function (request, response) {
  const body = request.body;
  let product_id =
    typeof body.product_id === "string"
      ? body.product_id
      : body.product_id.join();
  mysql.query(
    "INSERT INTO orderTable(member_id, product_id_lists, orderDate, totalPrice) VALUES(?,?,?,?)",
    [body.user_member_id, product_id, body.order_date, body.totalPrice],
    function (error, results) {
      if (!error) {
        clearCart();
        response.send(
          "<script>alert('주문완료'); location.href = '/';</script>"
        );
      } else {
        console.log("Error");
      }
    }
  );

  function clearCart() {
    mysql.query("DELETE FROM cart", function (error, results) {
      if (!error) {
        console.log("ok");
      } else {
        console.log("Error");
      }
    });
  }
});

module.exports = router;
