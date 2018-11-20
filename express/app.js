const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();

const userController = require("./controllers/userController");
const homeController = require("./controllers/homeController");

const port = 3000;

// middleware
app.use("/assets", express.static(__dirname + "/public"));
app.use(cookieParser());

app.set("view engine", "ejs");

// custom middle
app.use("/", (req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  req.requestTime = new Date();
  next();
});

userController(app);
homeController(app);

// app.get("/user/:id", (req, res) => {
//   res.render('user', { ID: req.params.id, queryString: req.query.qstr });
// });

app.listen(port, () => {
  console.log("Server is listening on port 3000");
});