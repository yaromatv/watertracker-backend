import Contact from "../schemas/contactsSchemas.js";

import HttpError from "../helpers/index.js";
import { ctrlWrapper } from "../helpers/index.js";


export const getAllContacts = ctrlWrapper(async (req, res) => {
    const result = await Contact.find();
    res.json(result);
});


export const getOneContact = ctrlWrapper(async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
        throw HttpError(404, `contact with id: ${contactId} not found`);
    }
    res.json(result);
});


export const deleteContact = ctrlWrapper(async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
        throw HttpError(404, `contact with id: ${contactId} not found`);
    }
    res.status(200).json(result);
});


export const createContact = ctrlWrapper(async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
});


export const updateContact = ctrlWrapper(async (req, res) => {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body);
    if (!result) {
        throw HttpError(404, `contact with id: ${contactId} not found`);
    }

    res.json(result);
});
