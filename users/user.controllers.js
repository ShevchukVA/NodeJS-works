const {
  Types: { ObjectId },
} = require('mongoose');
const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./User');
const { avatarGenerator } = require('../helpers/avatarGeneration');

async function createUser(req, res) {
  try {
    const {
      body: { email, password },
    } = req;

    const findEmail = await User.findOne({ email });

    if (findEmail) {
      return res.status(409).send('Email in use');
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const avatarURL = await avatarGenerator(req);
    const data = await User.create({
      ...req.body,
      password: hashedPassword,
      avatarURL,
    });

    res
      .status(201)
      .json({ user: { email: data.email, subscription: data.subscription } });
  } catch (error) {
    console.log('error', error);
  }
}

async function loginUser(req, res) {
  const {
    body: { email, password },
  } = req;

  const user = await User.findOne({
    email,
  });

  if (!user) {
    return res.status(401).send('Email or password is wrong');
  }

  const passwordCheckResult = await bcryptjs.compare(password, user.password);

  if (!passwordCheckResult) {
    return res.status(401).send('Email or password is wrong');
  }

  const userToken = await jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET
  );

  const data = await User.findByIdAndUpdate(
    user._id,
    {
      $set: {
        token: userToken,
      },
    },
    { new: true }
  );

  res.status(200).json({
    token: data.token,
    user: { email: data.email, subscription: user.subscription },
  });
}

async function authorize(req, res, next) {
  try {
    const authorizationHeader = req.get('Authorization');
    const token = authorizationHeader.replace('Bearer ', '');
    const { userId } = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(userId);

    if (user === null) {
      return res.status(401).send('Not authorized');
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).send('Not authorized');
  }
}

async function logoutUser(req, res) {
  const {
    user: { _id },
  } = req;

  const user = await User.findByIdAndUpdate(_id, {
    $set: {
      token: '',
    },
  });

  if (!user) {
    res.status(404).send('Not Found');
  }

  res.status(204).send('No Content');
}

async function getUser(req, res) {
  const {
    user: { email, subscription },
  } = req;
  res.status(200).json({ email, subscription });
}

async function updateUser(req, res) {
  const {
    user: { _id, email },
  } = req;

  const data = await User.findByIdAndUpdate(_id, {
    $set: { subscription: req.body.subscription },
  });

  if (!data) {
    return res.status(404).send('User is not found');
  }

  res.json({ user: { email, subscription: req.body.subscription } });
}

function validateUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    subscription: Joi.string().required(),
    gender: Joi.boolean().required(),
    token: Joi.string(),
  });

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error.message);
  }

  next();
}

function validateUpdateUser(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string(),
    password: Joi.string(),
    subscription: Joi.string(),
    token: Joi.string(),
  }).min(1);

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send(validationResult.error.message);
  }

  next();
}

async function validateUserId(req, res, next) {
  const {
    body: { email },
  } = req;

  const user = await User.findOne({
    email,
  });

  if (user === null) {
    return res.status(404).send('User is not found');
  }

  if (!ObjectId.isValid(user._id)) {
    return res.status(400).send('Id is not valid');
  }

  next();
}

module.exports = {
  createUser,
  loginUser,
  logoutUser,
  authorize,
  getUser,
  updateUser,
  validateUser,
  validateUpdateUser,
  validateUserId,
};
