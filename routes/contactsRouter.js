import express from "express";
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
} from "../controllers/contactsControllers.js";

import { isEmptyBody, validateBody } from "../helpers/index.js";
import {
    createContactSchema,
    updateContactSchema,
} from "../schemas/contactsSchemas.js";
const contactCreateValidate = validateBody(createContactSchema);
const contactUpdateValidate = validateBody(updateContactSchema);

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:contactId", getOneContact);

contactsRouter.delete("/:contactId", deleteContact);

contactsRouter.post("/", isEmptyBody, contactCreateValidate, createContact);

contactsRouter.put(
    "/:contactId",
    isEmptyBody,
    contactUpdateValidate,
    updateContact
);

export default contactsRouter;
