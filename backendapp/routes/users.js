var express = require('express');
const bcrypt = require("bcrypt");
const { createJwt } = require('./../middleware/check-jwt');
const User = require('./../model/user');
const convertAddress = require('../model/geo-converter');
var router = express.Router();

var BCRYPTFinal = 12;

router.post('/signin', async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return next({ status: 401, message: 'Authentication fail' });
    }

    if (!await bcrypt.compare(password, user.password)) {
      return next({ status: 401, message: 'unsuccessful login attempt' });
    }

    const token = createJwt({ email: user.email, id: user._id, location: user.location, name: user.name });
    res.status(200).json({ token: token, email });
  } catch (err) {
    next({ status: 500, message: err });
  }

})

router.post('/signup', async (req, res, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, BCRYPTFinal);
    if (!!req.body?.address) {
      const address = `${req.body.address.city},${req.body.address.state},${req.body.address.zip}`;
      req.body.location = await convertAddress(address);
    }

    const user = new User(req.body);
    await user.save();
    res.json({ message: 'Account user successfully created!!!' });
  } catch (err) {
    next({ status: 500, message: err });
  }

})

// /* GET users listing. */
// router.get('/api/protected', checkJwt, (req, res) => {
//   res.json(token);
// });

module.exports = router;
