import express from "express";
import {
    getAllContacts,
    getOneContact,
    deleteContact,
    createContact,
    updateContact,
} from "../controllers/contactsControllers.js";

import {
    authenticate,
    isEmptyBody,
    validateBody,
    isValidId,
} from "../helpers/index.js";
import {
    createContactSchema,
    updateContactSchema,
    updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactCreateValidate = validateBody(createContactSchema);
const contactUpdateValidate = validateBody(updateContactSchema);
const updateFavoriteValidate = validateBody(updateFavoriteSchema);

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:contactId", isValidId, getOneContact);

contactsRouter.delete("/:contactId", isValidId, deleteContact);

contactsRouter.post("/", isEmptyBody, contactCreateValidate, createContact);

contactsRouter.put(
    "/:contactId",
    isValidId,
    isEmptyBody,
    contactUpdateValidate,
    updateContact
);

contactsRouter.patch(
    "/:contactId/favorite",
    isValidId,
    isEmptyBody,
    updateFavoriteValidate,
    updateContact
);

export default contactsRouter;
