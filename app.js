const express = require("express");
const mysql = require("./routes/mysqlconn");
// 로그인
const session = require("express-session");
//
const app = express();

mysql.connect();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    name: "user",
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
  })
);

const landingRouter = require("./routes/langding");
const signinRouter = require("./routes/signin");
const signupRouter = require("./routes/signup");

app.use("/", landingRouter);
app.use("/signin", signinRouter);
app.use("/signup", signupRouter);

app.listen(3000, function () {
  console.log("Server Running at http://127.0.0.1:3000");
});
