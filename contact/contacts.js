const Contact = require('./Contact');

async function listContacts() {
  const data = await Contact.find();
  return data;
}

async function getContactById(contactId) {
  const data = await Contact.findById(contactId);
  return data;
}

async function addContact(name, email, phone) {
  const data = await Contact.create({ name, email, phone });
  return data;
}

async function removeContact(contactId) {
  const data = await Contact.findByIdAndDelete(contactId);
  return data;
}

async function updateContact(contactId, data) {
  const updateData = await Contact.findByIdAndUpdate(
    contactId,
    { $set: data },
    { new: true }
  );
  return updateData;
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  updateContact,
  addContact,
  updateContact,
};
