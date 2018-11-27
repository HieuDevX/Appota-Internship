import * as bodyParser from "body-parser";
import * as express from "express";
import { Routes } from "./routes/crmRoutes";
import * as mongoose from "mongoose";

class App {

  public mongoUrl: string = "mongodb://localhost:27017/CRMdb";
  // public mongoUrl: string = "mongodb://hieuht:12345678@localhost:27017/CRMdb";

  public app: express.Application;
  public routePrv: Routes = new Routes();

  constructor() {
    this.app = express();
    this.config();
    this.routePrv.routes(this.app);
    this.mongoSetup();
  }

  private config(): void {
    // support application/json type post data
    this.app.use(bodyParser.json());

    // support application/x-www-form-urlencoded post data
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private mongoSetup(): void {
    (mongoose as any).Promise = Promise;
    mongoose
      .connect(this.mongoUrl, { useNewUrlParser: true })
      .then(() => {
        console.log("Connect database successfully!");
      })
      .catch((error) => {
        console.log("Failed to connect database");
      });
  }
}

export default new App().app;
