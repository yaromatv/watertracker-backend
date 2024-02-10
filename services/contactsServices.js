import fs from "fs/promises";
import path from "path";

import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const rewriteContacts = (contacts) =>
    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

const listContacts = async () => {
    const buffer = await fs.readFile(contactsPath);
    return JSON.parse(buffer);
};

const getContactById = async (id) => {
    const contacts = await listContacts();
    const foundContact = contacts.find((contact) => contact.id === id);
    return foundContact || null;
};

const addContact = async ({ name, email, phone }) => {
    const contacts = await listContacts();
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    rewriteContacts(contacts);
    return newContact;
};

const updateContact = async (id, body) => {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1) {
        return null;
    }
    contacts[index] = { id, ...contacts[index], ...body };
    rewriteContacts(contacts);
    return contacts[index];
};

const removeContact = async (id) => {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === id);
    if (index === -1) {
        return null;
    }
    const [removedContact] = contacts.splice(index, 1);
    rewriteContacts(contacts);
    return removedContact;
};

const contactsService = {
    listContacts,
    getContactById,
    addContact,
    updateContact,
    removeContact,
};
export default contactsService;
