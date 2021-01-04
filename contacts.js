const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'db/contacts.json');

// TODO: задокументировать каждую функцию
function listContacts() {
  fs.readFile(contactsPath, 'utf-8', (err, data) => {
    if (err) {
      console.log('listContacts', err);
    }
    console.table(JSON.parse(data));
  });
}

function getContactById(contactId) {
  fs.readFile(contactsPath, 'utf-8', (err, data) => {
    if (err) {
      console.log('getContactById', err);
    }
    const contactById = JSON.parse(data).find(
      contact => contact.id === contactId
    );
    console.log(contactById);
  });
}

function removeContact(contactId) {
  fs.readFile(contactsPath, 'utf-8', (err, data) => {
    if (err) {
      console.log('removeContact', err);
    }
    const removeContact = JSON.parse(data).filter(
      contact => contact.id !== contactId
    );
    fs.writeFile(contactsPath, JSON.stringify(removeContact), err => {
      if (err) {
        console.log(err);
      }
    });
    console.table(removeContact);
  });
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath, 'utf-8', (err, data) => {
    if (err) {
      console.log('addContact', err);
    }
    const newContactList = [
      ...JSON.parse(data),
      { id: uuidv4(), name, email, phone },
    ];
    fs.writeFile(contactsPath, JSON.stringify(newContactList), err => {
      if (err) {
        console.log(err);
      }
      console.table(newContactList);
    });
  });
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
