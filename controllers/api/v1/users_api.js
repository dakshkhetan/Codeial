const jwt = require('jsonwebtoken');
const User = require('../../../models/user');
const env = require('../../../config/environment');

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user || user.password != req.body.password) {
      return res.json(422, {
        // 422 : Unprocessable Entity
        message: 'Invalid username/password'
      });
    }

    return res.json(200, {
      message: 'Sign-in successful, here is your token, please keep it safe!',
      data: {
        // generating token (which contains the 'user' object)
        token: jwt.sign(user.toJSON(), env.jwt_secret, { expiresIn: '100000' })
      }
    });
  } catch (err) {
    console.log('Error: ', err);
    return res.json(500, {
      message: 'Interval Server Error'
    });
  }
};
