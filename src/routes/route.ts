import express from 'express';
const controller = require('../controllers/user.controller');
const router = express.Router();

router.post('/register', controller.registerUser,);
router.post('/login', controller.loginUser);
router.get('/users', controller.getUsers);

router.get('/registration', (req, res) => {
  res.render('registration.ejs', {
    data: {},
    errors: {}
  })
})

router.get('/', (req, res) => {
  res.render('index.ejs', {
    data: req.body,
    errors: {}
  });
})
router.get('/contact', (req, res) => {
    res.render('contact.ejs', {
      data: req.body,
      errors: {}
    })
})

export = router;
