const userCtrl = require('../controllers/userCtrl')
const router = require('express').Router()

router.route('/login').get(userCtrl.login)
router.route('/signup').get(userCtrl.signup)

module.exports = router