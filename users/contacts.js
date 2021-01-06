const path = require('path');
const fs = require('fs');

const contactsPath = path.join(__dirname, '../db/contacts.json');

function listContacts() {
  return (contacts = require(contactsPath));
}

function getContactById(contactId) {
  const contacts = require(contactsPath);
  const id = parseInt(contactId);
  return contacts.find(contact => contact.id === id);
}

function addContact(name, email, phone) {
  const contacts = require(contactsPath);
  const newContact = {
    id: contacts.length + 1,
    name,
    email,
    phone,
  };
  fs.readFile(contactsPath, 'utf-8', (err, data) => {
    if (err) {
      console.log('addContact', err);
    }
    const newContactList = [...JSON.parse(data), newContact];
    fs.writeFile(contactsPath, JSON.stringify(newContactList), err => {
      if (err) {
        console.log(err);
      }
      console.table(newContactList);
    });
  });
  return newContact;
}

function removeContact(contactId) {
  const contacts = require(contactsPath);
  const id = parseInt(contactId);
  const deleteContact = contacts.filter(contact => contact.id !== id);
  fs.writeFile(contactsPath, JSON.stringify(deleteContact), err => {
    console.log(err);
  });
}

function updateContact(contactId, data) {
  const contacts = require(contactsPath);
  const id = parseInt(contactId);
  const contactIndex = contacts.findIndex(contact => contact.id === id);
  contacts[contactIndex] = {
    ...contacts[contactIndex],
    ...data,
  };
  const contactUpdate = contacts[contactIndex];
  fs.writeFile(contactsPath, JSON.stringify(contacts), err => {
    if (err) throw err;
  });
  return contactUpdate;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
