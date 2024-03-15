const express = require("express");
const mysql = require("./mysqlconn");

const router = express.Router();

router.get("/", function (request, response) {
  if (!request.session.user) {
    response.send(
      "<script>alert('로그인 해주세요'); location.href = '/signin';</script>"
    );
  } else {
    mysql.query(
      "SELECT user.id, user.member_id, orderTable.product_id_lists FROM user, orderTable WHERE user.member_id = orderTable.member_id",
      async function (error1, results1) {
        if (!error1) {
          const found = results1.some(
            (item) =>
              item.id === request.session.user.user_id &&
              item.product_id_lists.includes(
                request.query.product_id.toString()
              )
          );
          if (found) {
            mysql.query(
              `SELECT name FROM product WHERE id = ${request.query.product_id};`,
              async function (error2, results2) {
                if (!error2) {
                  const result = await results2;
                  return response.render("write", {
                    product_name: result[0].name,
                    writer: request.session.user.user_id,
                    product_id: request.query.product_id,
                  });
                } else {
                  console.log("Error");
                  response.send(
                    "<script>alert('주문이력이 없습니다'); location.href = '/';</script>"
                  );
                }
              }
            );
          } else {
            response.send(
              "<script>alert('주문이력이 없습니다'); location.href = '/';</script>"
            );
          }
        } else {
          console.log("Error");
          response.send(
            "<script>alert('주문이력이 없습니다'); location.href = '/';</script>"
          );
        }
      }
    );
  }
});

router.post("/", function (request, response) {
  const body = request.body;
  mysql.query(
    "INSERT INTO reviews(product_id, review_content, review_wirter, review_date) VALUES(?,?,?,?)",
    [
      body.product_id,
      body.review_content,
      body.review_wirter,
      body.review_date,
    ],
    function (error, results) {
      if (!error) {
        response.send(
          "<script>alert('리뷰등록완료'); location.href = '/';</script>"
        );
      } else {
        console.log(error);
        console.log("Error");
      }
    }
  );
});

router.post("/delete", function (request, response) {
  if (!request.session.user) {
    return response.send(
      "<script>alert('로그인 후 이용해주세요'); location.href = '/';</script>"
    );
  }

  mysql.query(
    `SELECT review_wirter FROM reviews WHERE review_id = ${request.body.reviewId};`,
    function (error, results) {
      if (!error) {
        if (results[0].review_wirter === request.session.user.user_id) {
          mysql.query(
            "DELETE FROM reviews WHERE review_id=?",
            [request.body.reviewId],
            function (error, results) {
              if (!error) {
                response.send(
                  "<script>alert('리뷰삭제완료'); location.href = '/';</script>"
                );
              } else {
                console.log("Error");
              }
            }
          );
        } else {
          return response.send(
            "<script>alert('삭제 권환이 없습니다');</script>"
          );
        }
      } else {
        return response.send("<script>alert('삭제 권환이 없습니다');</script>");
      }
    }
  );
});

module.exports = router;
