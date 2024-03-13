const express = require("express");
const mysql = require("./mysqlconn");

const router = express.Router();

router.get("/", function (request, response) {
  response.render("signup");
});

router.post("/", function (request, response) {
  const body = request.body;

  mysql.query(
    "INSERT INTO user(id, pw, name, tel, birth, email, address) VALUES(?,?,?,?,?,?,?)",
    [
      body.id,
      body.pw,
      body.name,
      body.tel,
      body.birth,
      body.email,
      body.address,
    ],
    function (error, results) {
      if (!error) {
        response.redirect("/");
      } else {
        console.log(error);
        console.log("Error");
      }
    }
  );
});

module.exports = router;
