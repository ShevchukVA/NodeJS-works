const path = require('path');
const { promises: fsPromises } = require('fs');
const Avatar = require('avatar-builder');

async function avatarGenerator(req, res) {
  const {
    body: { email, gender },
  } = req;

  const avatarName = email.split('@')[0] + `_${Date.now()}`;
  const srcPath = path.join(__dirname, '../tmp', avatarName);
  const destPath = path.join(__dirname, '../public/images', avatarName);

  if (gender) {
    const avatar = Avatar.male8bitBuilder(128, {
      cache: Avatar.Cache.folder('tmp'),
    });

    await avatar.create(avatarName);
  } else {
    const avatar = Avatar.female8bitBuilder(128, {
      cache: Avatar.Cache.folder('tmp'),
    });

    await avatar.create(avatarName);
  }

  try {
    await fsPromises.copyFile(srcPath, destPath);
    console.log('Successfully copied and moved the file!');
  } catch (err) {
    throw err;
  }

  return `images/${avatarName}`;
}

module.exports = {
  avatarGenerator,
};
