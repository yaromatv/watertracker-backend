import Contact from "../schemas/contactsSchemas.js";

import HttpError from "../helpers/index.js";
import { ctrlWrapper } from "../helpers/index.js";

const getAllContacts = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
};

const getOneContact = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
        return next(HttpError(404, `Contact with id: ${contactId} not found`));
    }
    res.json(result);
};

const deleteContact = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
        return next(HttpError(404, `Contact with id: ${contactId} not found`));
    }
    res.status(200).json(result);
};

const createContact = async (req, res) => {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body);
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
