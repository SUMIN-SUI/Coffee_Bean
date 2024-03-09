const express = require("express");
const mysql = require("./mysqlconn");

const router = express.Router();

router.get("/", function (request, response) {
  response.render("signin");
});

router.post("/", function (request, response) {
  mysql.query(
    `SELECT * FROM user WHERE id = '${request.body.id}' and '${request.body.pw}'`,
    function (error, results) {
      if (!error) {
        request.session.user = {
          user_id: results[0].id,
          user_pw: results[0].pw,
        };
        response.redirect("/");
      } else {
        console.log("Error");
      }
    }
  );
});

module.exports = router;
