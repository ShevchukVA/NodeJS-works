const {
  Types: { ObjectId },
} = require('mongoose');
const Joi = require('joi');
const contactsFunctions = require('./contacts');

function getContactList(req, res) {
  const result = contactsFunctions.listContacts();
  result.then(data => res.json(data));
}

function getContactById(req, res) {
  const {
    params: { contactId },
  } = req;
  const result = contactsFunctions.getContactById(contactId);
  result.then(data => {
    if (!data) {
      return res.status(404).send('Not Found');
    }
    res.json(data);
  });
}

function createContact(req, res) {
  const {
    body: { name, email, phone },
  } = req;
  const result = contactsFunctions.addContact(name, email, phone);
  result
    .then(data => res.status(201).json(data))
    .catch(error => {
      if (error.code === 11000) {
        return res.status(400).send('Contact is duplicated');
      }
    });
}

function deleteContact(req, res) {
  const {
    params: { contactId },
  } = req;
  const result = contactsFunctions.removeContact(contactId);
  result.then(data => {
    if (!data) {
      return res.status(404).send('Not Found');
    }
    res.json(data);
  });
}

function updateContacts(req, res) {
  const {
    params: { contactId },
  } = req;
  const result = contactsFunctions.updateContact(contactId, req.body);
  result
    .then(data => {
      if (!data) {
        return res.status(404).send('Not Found');
      }
      res.json(data);
    })
    .catch(error => {
      if (error.code === 11000) {
        return res.status(400).send('Contact is duplicated');
      }
    });
}

function validateContactId(req, res, next) {
  const {
    params: { contactId },
  } = req;

  if (!ObjectId.isValid(contactId)) {
    return res.status(400).send('Id is not valid');
  }

  next();
}

function validateContacts(req, res, next) {
  const contactsRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
  });
  const result = contactsRules.validate(req.body);
  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  next();
}

function validateUpdateContacts(req, res, next) {
  const contactsRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).min(1);
  const result = contactsRules.validate(req.body);

  if (result.error) {
    return res.status(400).send(result.error.message);
  }

  next();
}

module.exports = {
  getContactList,
  getContactById,
  createContact,
  deleteContact,
  updateContacts,
  validateContactId,
  validateContacts,
  validateUpdateContacts,
};
