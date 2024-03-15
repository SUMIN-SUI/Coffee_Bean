const express = require("express");
const mysql = require("./mysqlconn");

const router = express.Router();

// router.get("/", function (request, response) {
//   mysql.query("SELECT SUM(price) FROM cart;", function (error, results) {
//     if (!error) {
//       const totalPrice = results[0]["SUM(price)"];
//       mysql.query("SELECT * FROM cart", function (error, results) {
//         if (!error) {
//           response.render("cart", {
//             products: results,
//             totalPrice: totalPrice,
//           });
//         } else {
//           console.log("Error");
//         }
//       });
//     } else {
//       console.log("Error");
//     }
//   });
// });

router.get("/", function (request, response) {
  if (!request.session.user) {
    return response.render("emptyCart");
  }
  mysql.query("SELECT SUM(price) FROM cart;", function (error, results) {
    if (!error) {
      const totalPrice = results[0]["SUM(price)"];
      mysql.query("SELECT * FROM cart", function (error, results) {
        if (!error) {
          response.render("cart", {
            products: results,
            totalPrice: totalPrice,
          });
        } else {
          console.log("Error");
        }
      });
    } else {
      console.log("Error");
    }
  });
});

router.post("/", function (request, response) {
  mysql.query(
    "DELETE FROM cart WHERE cart_id=?",
    [request.body.itemID],
    function (error, results) {
      if (!error) {
        newCart();
      } else {
        console.log(error);
        console.log("Error");
      }
    }
  );

  function newCart() {
    mysql.query("SELECT SUM(price) FROM cart;", function (error, results) {
      if (!error) {
        const totalPrice = results[0]["SUM(price)"];
        mysql.query("SELECT * FROM cart", function (error, results) {
          if (!error) {
            response.render("cart", {
              products: results,
              totalPrice: totalPrice,
            });
          } else {
            console.log("Error");
          }
        });
      } else {
        console.log("Error");
      }
    });
  }
});

module.exports = router;
