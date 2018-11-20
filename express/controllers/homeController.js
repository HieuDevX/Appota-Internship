const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const cookieParser = require("cookie-parser");

module.exports = function (app) {
  // other...
  app.get("/", (req, res) => {
    // print cookies received from client, after written when /user/:id called
    console.log("Cookies: ", req.cookies);
    res.send(`
    <link href="/assets/style.css" rel="stylesheet" type="text/css"/>
    <h1>Hello friend!</h1>
    <p>Request time: ${ req.requestTime}</p>
  `);
  });

  app.get("/index", (req, res) => {
    // remember render
    res.render('index');
  });

  app.get("/api", (req, res) => {
    res.json({
      name: "hieuht",
      role: "intership"
    });
  });

  app.post("/login", urlencodedParser, (req, res) => {
    res.send("Welcome, " + req.body.username);
    console.log(req.body.username);
    console.log(req.body.password);
  });

  app.post("/loginjson", jsonParser, (req, res) => {
    res.send("ok");
    console.log(req.body.firstName);
    console.log(req.body.lastName);
  })
}
