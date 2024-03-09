const express = require("express");
const mysql = require("./mysqlconn");

const router = express.Router();

router.get("/", function (request, response) {
  response.render("signup");
});

let memberId = 0;

router.post("/", function (request, response) {
  const body = request.body;

  mysql.query(
    "INSERT INTO user(member_id, id, pw, name, tel, birth, email, address) VALUES(?,?,?,?,?,?,?,?)",
    [
      memberId,
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
        memberId++;
        response.redirect("/");
      } else {
        console.log(error);
        console.log("Error");
      }
    }
  );
});

module.exports = router;
