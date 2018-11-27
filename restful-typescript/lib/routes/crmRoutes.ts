import { Request, Response } from "express";
import { ContactController } from "../controllers/crmController";
import { NextFunction } from "connect";

export class Routes {
  public contactController: ContactController = new ContactController();

  public routes(app): void {
    app.route("/")
      .get((req: Request, res: Response) => {
        res.status(200).send({
          message: "GET request successfully!",
        });
      });

    // app.route("/contact")
    //   .post(this.contactController.addNewContact)
    //   .get(this.contactController.getContacts);

    app.route("/contact")
      .post(this.contactController.addNewContact)
      .get((req: Request, res: Response, next: NextFunction) => {
        // middleware
        if (req.query.key !== "03f8c37c679503e88bf00688f0a11f4eddc468a4") {
          res.status(401).send("You shall not pass!");
        } else {
          next();
        }
      }, this.contactController.getContacts);

    app.route("/contact/:contactId")
      .get(this.contactController.getContactById)
      .put(this.contactController.updateContact)
      .delete(this.contactController.deleteContact);
  }
}

// export class Routes {
//   public routes(app): void {
//     app.route("/")
//       .get((req: Request, res: Response) => {
//         res.status(200).send({
//           message: "GET request successfully!",
//         });
//       });

//     // Contact
//     app.route("/contact")
//       // GET endpoint
//       .get((req: Request, res: Response) => {
//         // Get all contacts
//         res.status(200).send({
//           message: "GET request successfully!",
//         });
//       })
//       // POST endpoint
//       .post((req: Response, res: Response) => {
//         // Create new contact
//         res.status(200).send({
//           message: "POST request successfully!",
//         });
//       });

//       // Contact detail
//     app.route("/contact/:contactId")
//       // get specific contact
//       .get((req: Request, res: Response) => {
//         // Get a single contact detail
//         res.status(200).send({
//           mesage: "GET request successfully!",
//         });
//       })
//       .put((req: Request, res: Response) => {
//         // Update a contact
//         res.status(200).send({
//           message: "DELETE request successfully!",
//         });
//       })
//       .delete((req: Request, res: Response) => {
//         // Delete a contact
//         res.status(200).send({
//           message: "DELETE request successfully!",
//         });
//       });
//   }
// }
