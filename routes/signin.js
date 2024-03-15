const express = require("express");
const mysql = require("./mysqlconn");

const router = express.Router();

router.get("/", function (request, response) {
  response.render("signin");
});

router.post("/", function (request, response) {
  mysql.query(
    `SELECT * FROM user WHERE id = '${request.body.inputId}' and pw = '${request.body.inputPw}'`,
    function (error, results) {
      if (!error) {
        if (results.length === 0) {
          return response.send(
            "<script>alert('아이디와 비밀번호를 확인해주세요'); location.href = '/';</script>"
          );
        }
        request.session.user = {
          user_id: results[0].id,
          user_pw: results[0].pw,
        };
        response.send(
          "<script>alert('로그인 되었습니다'); location.href = '/';</script>"
        );
      } else {
        console.log("Error");
      }
    }
  );
});

module.exports = router;
