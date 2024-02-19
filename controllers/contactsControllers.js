import contactsService from "../services/contactsServices.js";

import HttpError from "../helpers/index.js";
import { ctrlWrapper } from "../helpers/index.js";

export const getAllContacts = ctrlWrapper(async (req, res) => {
    const result = await contactsService.listContacts();
    res.json(result);
});

export const getOneContact = ctrlWrapper(async (req, res) => {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    console.log(result);
    if (!result) {
        throw HttpError(404, `contact with id: ${contactId} not found`);
    }
    res.json(result);
});

export const deleteContact = ctrlWrapper(async (req, res) => {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);
    if (!result) {
        throw HttpError(404, `contact with id: ${contactId} not found`);
    }
    res.status(200).json(result);
});

export const createContact = ctrlWrapper(async (req, res) => {
    const result = await contactsService.addContact(req.body);
    res.status(201).json(result);
});

export const updateContact = ctrlWrapper(async (req, res) => {
    const { contactId } = req.params;

    const result = await contactsService.updateContact(contactId, req.body);
    if (!result) {
        throw HttpError(404, `contact with id: ${contactId} not found`);
    }

    res.json(result);
});
