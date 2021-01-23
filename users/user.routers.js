const { Router } = require('express');
const userRouter = Router();
const userControllers = require('./user.controllers');

userRouter.post(
  '/auth/register',
  userControllers.validateUser,
  userControllers.createUser
);
userRouter.post(
  '/auth/login',
  userControllers.validateUser,
  userControllers.validateUserId,
  userControllers.loginUser
);
userRouter.post(
  '/auth/logout',
  userControllers.authorize,
  userControllers.validateUserId,
  userControllers.logoutUser
);
userRouter.get(
  '/users/current',
  userControllers.authorize,
  userControllers.validateUserId,
  userControllers.getUser
);
userRouter.patch(
  '/users',
  userControllers.authorize,
  userControllers.validateUserId,
  userControllers.validateUpdateUser,
  userControllers.updateUser
);

module.exports = userRouter;
