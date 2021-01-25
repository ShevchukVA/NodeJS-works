const {
  Types: { ObjectId },
} = require('mongoose');
const Joi = require('joi');

const Contact = require('./Contact');

async function getContactList(req, res) {
  const { query } = req;
  if (Object.keys(query).length !== 0) {
    const data = await Contact.paginate(
      {},
      { page: query.page, limit: query.limit }
    ).then(result => {
      if (result.limit !== 0) {
        return result.docs;
      }
      return Contact.find({ subscription: query.sub });
    });
    res.json(data);
  } else {
    const data = await Contact.find();
    res.json(data);
  }
}

async function getContactById(req, res) {
  const {
    params: { contactId },
  } = req;
  const data = await Contact.findById(contactId);

  if (!data) {
    return res.status(404).send('Not Found');
  }
  res.json(data);
}

async function createContact(req, res) {
  try {
    const {
      body: { name, email, phone },
    } = req;
    const data = await Contact.create({ name, email, phone });
    res.status(201).json(data);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send('Email is duplicated');
    }

    return res.status(400).send(error.message);
  }
}

async function deleteContact(req, res) {
  const {
    params: { contactId },
  } = req;
  const data = await Contact.findByIdAndDelete(contactId);

  if (!data) {
    return res.status(404).send('Not Found');
  }
  res.json(data);
}

async function updateContacts(req, res) {
  try {
    const {
      params: { contactId },
    } = req;
    const data = await Contact.findByIdAndUpdate(
      contactId,
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    if (!data) {
      return res.status(404).send('Not Found');
    }
    res.json(data);
  } catch (error) {
    return res.status(400).send(error.message);
  }
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
