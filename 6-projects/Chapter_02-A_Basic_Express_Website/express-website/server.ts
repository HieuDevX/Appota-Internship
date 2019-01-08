import * as express from "express";
import { Request, Response, NextFunction } from "express";

import * as path from "path";
import * as bodyParser from "body-parser";
import * as nodemailer from "nodemailer";

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req: Request, res: Response) => {
  res.render("index", { title: "Computer Not Working?" });
});

app.get("/about", (req: Request, res: Response) => {
  res.render("about");
});

app.get("/contact", (req: Request, res: Response) => {
  res.render("contact");
});

app.post("/contact/send", (req: Request, res: Response) => {
  const transporter: nodemailer.Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      //type: 'login',
      user: "tizen2.0@gmail.com",
      pass: "Dota133206"
    }
  });

  const mailOptions: nodemailer.SendMailOptions = {
    from: "Hieuht <tizen2.0@gmail.com>",
    to: "hoangtrunghieu10licbn@gmail.com",
    subject: "Website Submission",
    text:
      "You have a submission with the following details... Name: " +
      req.body.name +
      "Email: " +
      req.body.email +
      "Message: " +
      req.body.message,
    html:
      "<p>You have a submission with the following details...</p><ul><li>" +
      req.body.name +
      "</li><li>Email: " +
      req.body.email +
      "</li><li>Message: " +
      req.body.message +
      "</li></ul>"
  };

  transporter.sendMail(
    mailOptions,
    (error: any, info: nodemailer.SentMessageInfo) => {
      if (error) {
        console.log(error);
        res.redirect("/");
      } else {
        console.log("Message Sent: " + info.response);
        res.redirect("/");
      }
    }
  );
});

app.listen(3000);
console.log("Server is running on port 3000");
