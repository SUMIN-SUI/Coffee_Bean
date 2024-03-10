const express = require("express");
const router = express.Router();

router.get("/", function (request, response) {
  request.session.user = null;
  response.send(
    "<script>alert('로그아웃 되었습니다'); location.href = '/';</script>"
  );
});

module.exports = router;
