import express from 'express';

const controller = require('../controllers/user.controller');
const router = express.Router();

router.post('/register', controller.registerUser,);
router.post('/login', controller.loginUser);

router.get('/users', controller.getUsers);
router.get('/registration', controller.getRegistration);
router.get('/', controller.getData);

export = router;
