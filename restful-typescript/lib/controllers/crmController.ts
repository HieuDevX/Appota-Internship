import * as mongoose from "mongoose";
import { ContactSchema } from "../models/crmModel";
import { Request, Response } from "express";

const Contact = mongoose.model("Contacts", ContactSchema);

export class ContactController {
  public addNewContact = async (req: Request, res: Response): Promise<void> => {
    const newContact = new Contact(req.body);
    const contacts = await newContact.save();
    res.status(200).json(contacts);
  }
}

// export class ContactController {
//   public addNewContact(req: Request, res: Response): void {
//     const newContact = new Contact(req.body);

//     newContact
//       .save()
//       .then((contacts) => {
//         res.status(200).json(contacts);
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).send("Failed to add new contact");
//       });
//   }

//   public getContacts(req: Request, res: Response): void {
//     Contact
//       .find()
//       .exec()
//       .then((contacts) => {
//         res.status(200).json(contacts);
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).send("Failed to get contacts");
//       });
//   }

//   public getContactById(req: Request, res: Response): void {
//     Contact
//       .findById(req.params.contactId)
//       .exec()
//       .then((contacts) => {
//         res.status(200).json(contacts);
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).send("Failed to get contact");
//       });
//   }

//   public updateContact(req: Request, res: Response): void {
//     Contact
//       .findOneAndUpdate(
//         { _id: req.params.contactId },
//         req.body,
//         { new: true },
//       )
//       .exec()
//       .then((contacts) => {
//         res.status(200).json(contacts);
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).send("Failed to update the contact");
//       });
//   }

//   public deleteContact(req: Request, res: Response): void {
//     Contact
//       .deleteOne({ _id: req.params.contactId })
//       .exec()
//       .then((contacts) => {
//         res.status(200).json(contacts);
//       })
//       .catch((error) => {
//         console.log(error);
//         res.status(500).send("Failed to delete the contact");
//       });
//   }
// }
