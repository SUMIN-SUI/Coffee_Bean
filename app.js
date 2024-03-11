const express = require("express");
const mysql = require("./routes/mysqlconn");
const session = require("express-session");

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

app.use((req, res, next) => {
  res.locals.user_id = "";
  if (req.session.user) {
    res.locals.user_id = req.session.user.user_id;
  }
  next();
});

const landingRouter = require("./routes/langding");
const signinRouter = require("./routes/signin");
const signupRouter = require("./routes/signup");
const logoutRouter = require("./routes/logout");
const blendRouter = require("./routes/blend");
const originRouter = require("./routes/origin");
const decafRouter = require("./routes/decaf");

app.use("/", landingRouter);
app.use("/signin", signinRouter);
app.use("/signup", signupRouter);
app.use("/logout", logoutRouter);
app.use("/blend", blendRouter);
app.use("/origin", originRouter);
app.use("/decaf", decafRouter);

app.listen(3000, function () {
  console.log("Server Running at http://127.0.0.1:3000");
});
