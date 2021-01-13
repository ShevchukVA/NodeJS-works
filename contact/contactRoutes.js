const { Router } = require('express');
const contactRouter = Router();
const ContactRequests = require('./contactControllers');

contactRouter.get('/', ContactRequests.getContactList);
contactRouter.get(
  '/:contactId',
  ContactRequests.validateContactId,
  ContactRequests.getContactById
);
contactRouter.post(
  '/',
  ContactRequests.validateContacts,
  ContactRequests.createContact
);
contactRouter.delete(
  '/:contactId',
  ContactRequests.validateContactId,
  ContactRequests.deleteContact
);
contactRouter.patch(
  '/:contactId',
  ContactRequests.validateContactId,
  ContactRequests.validateUpdateContacts,
  ContactRequests.updateContacts
);

module.exports = contactRouter;
