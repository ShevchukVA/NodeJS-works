const { Router } = require('express');
const contactRouter = Router();
const ApiRequests = require('./contactControllers');

contactRouter.get('/', ApiRequests.getContactList);
contactRouter.get(
  '/:contactId',
  ApiRequests.validateContactId,
  ApiRequests.getContactById
);
contactRouter.post(
  '/',
  ApiRequests.validateContacts,
  ApiRequests.createContact
);
contactRouter.delete(
  '/:contactId',
  ApiRequests.validateContactId,
  ApiRequests.deleteContact
);
contactRouter.patch(
  '/:contactId',
  ApiRequests.validateContactId,
  ApiRequests.validateUpdateContacts,
  ApiRequests.updateContacts
);

module.exports = contactRouter;
