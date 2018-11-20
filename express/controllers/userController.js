const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const jsonParser = bodyParser.json();
const cookieParser = require("cookie-parser");

module.exports = function (app) {
  app.get("/api/user/:id", (req, res) => {
    var result = {
      firstName: "hieu",
      lastName: "hoang"
    };
    res.json(result);
  });

  /** 
 * product/:id
 * product/page/:pageNumber
 * user/:id
*/

  app.get("/user/:id", (req, res) => {
    // write cookies when client call this api
    res.cookie("username", req.params.id);
    res.send(`<h1>User: ${req.params.id}</h1>`);
    // res.send(req.params.id);
  });

  app.post("/api/user", jsonParser, (req, res) => {
    // create new and save to the database
  });

  app.put("/api/user", jsonParser, (req, res) => {
    // update user and save to the database
  });

  app.delete("/api/user/:id", (req, res) => {
    // delete user from database
  });
}