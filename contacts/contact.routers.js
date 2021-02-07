const { Router } = require('express');
const contactRouter = Router();
const ContactRequests = require('./contact.controllers');
const UserControllers = require('../users/user.controllers');

contactRouter.get(
  '/',
  UserControllers.authorize,
  ContactRequests.getContactList
);
contactRouter.get(
  '/:contactId',
  UserControllers.authorize,
  ContactRequests.validateContactId,
  ContactRequests.getContactById
);
contactRouter.post(
  '/',
  UserControllers.authorize,
  ContactRequests.validateContacts,
  ContactRequests.createContact
);
contactRouter.delete(
  '/:contactId',
  UserControllers.authorize,
  ContactRequests.validateContactId,
  ContactRequests.deleteContact
);
contactRouter.patch(
  '/:contactId',
  UserControllers.authorize,
  ContactRequests.validateContactId,
  ContactRequests.validateUpdateContacts,
  ContactRequests.updateContacts
);

module.exports = contactRouter;
