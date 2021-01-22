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
  userControllers.loginUser
);
userRouter.post(
  '/auth/logout',
  userControllers.authorize,
  userControllers.logoutUser
);
userRouter.get(
  '/users/current',
  userControllers.authorize,
  userControllers.getUser
);
userRouter.patch(
  '/users',
  userControllers.authorize,
  userControllers.validateUpdateUser,
  userControllers.updateUser
);

module.exports = userRouter;
