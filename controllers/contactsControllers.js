import contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/index.js";
import { ctrlWrapper } from "../helpers/index.js";

export const getAllContacts = async (req, res) => {
    const result = await contactsService.listContacts();
    res.json(result);
};

export const getOneContact = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    console.log(result);
    if (!result) {
        return next(HttpError(404, `Contact with id: ${contactId} not found`));
    }
    res.json(result);
};

export const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);
    if (!result) {
        return next(HttpError(404, `Contact with id: ${contactId} not found`));
    }
    res.status(200).json(result);
};

export const createContact = async (req, res) => {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
};

export const updateContact = async (req, res, next) => {
    const { contactId } = req.params;

    const result = await contactsService.updateContact(contactId, req.body);
    if (!result) {
        return next(HttpError(404, `Contact with id: ${contactId} not found`));
    }

    res.json(result);
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    createContact: ctrlWrapper(createContact),
    deleteContact: ctrlWrapper(deleteContact),
    updateContact: ctrlWrapper(updateContact),
};
