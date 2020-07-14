const express = require('express');
const bodyParser = require('body-parser');
const homeController = require('../controllers/home_controller');
const router = express.Router();

console.log("Route is loaded");
router.use(express.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/api', require('./api'));

module.exports = router;