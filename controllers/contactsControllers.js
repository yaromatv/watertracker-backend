import Contact from "../schemas/contactsSchemas.js";

import HttpError from "../helpers/index.js";
import { ctrlWrapper } from "../helpers/index.js";

const getAllContacts = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const { _id: owner } = req.user;

    const result = await Contact.find(
        { owner },
        {},
        {
            skip,
            limit,
        }
    ).populate("owner", "email");
    res.json(result);
};

const getOneContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { contactId } = req.params;

    const result = await Contact.findOne({ _id: contactId, owner });
    if (!result) {
        throw HttpError(404, `contact with id: ${contactId} not found`);
    }
    res.json(result);
};

const deleteContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { contactId } = req.params;

    const result = await Contact.findOneAndDelete({ _id: contactId, owner });
    if (!result) {
        throw HttpError(404, `contact with id: ${contactId} not found`);
    }
    res.status(200).json(result);
};

const createContact = async (req, res) => {
    const { _id: owner } = req.user;

    const result = await Contact.create({ ...req.body, owner });
    res.status(201).json(result);
};

const updateContact = async (req, res) => {
    const { _id: owner } = req.user;
    const { contactId } = req.params;

    const result = await Contact.findOneAndUpdate(
        { _id: contactId, owner },
        req.body
    );
    if (!result) {
        throw HttpError(404, `contact with id: ${contactId} not found`);
    }

    res.json(result);
};

export default {
    getAllContacts: ctrlWrapper(getAllContacts),
    getOneContact: ctrlWrapper(getOneContact),
    deleteContact: ctrlWrapper(deleteContact),
    createContact: ctrlWrapper(createContact),
    updateContact: ctrlWrapper(updateContact),
};
