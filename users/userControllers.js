const Joi = require('joi');
const ContactsFunctions = require('./contacts');

class ApiRequests {
  getContactList(req, res, next) {
    return res.status(200).json(ContactsFunctions.listContacts());
  }

  getContactById(req, res, next) {
    const id = req.params.contactId;
    return res.status(200).json(ContactsFunctions.getContactById(id));
  }

  createContact(req, res, next) {
    return res
      .status(201)
      .json(
        ContactsFunctions.addContact(
          req.body.name,
          req.body.email,
          req.body.phone
        )
      );
  }

  deleteContact(req, res, next) {
    const id = req.params.contactId;
    ContactsFunctions.removeContact(id);
    return res.status(200).json('contact deleted');
  }

  updateContacts(req, res, next) {
    const id = req.params.contactId;
    const data = req.body;

    return res.status(200).json(ContactsFunctions.updateContact(id, data));
  }

  getById(id) {
    return ContactsFunctions.getContactById(id);
  }

  validateContacts(req, res, next) {
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

  validateUpdateContacts(req, res, next) {
    const contactsRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });
    const result = contactsRules.validate(req.body);
    if (Object.keys(req.body).length === 0) {
      return res.status(400).send('missing fields');
    }
    if (result.error) {
      return res.status(400).send(result.error.message);
    }

    next();
  }

  validateContactId = (req, res, next) => {
    const { contactId } = req.params;
    const contactIndex = this.getById(contactId);

    if (contactIndex === undefined) {
      return res.status(404).send('Not found');
    }

    next();
  };
}

module.exports = new ApiRequests();
