const express = require('express')
const router = express.Router()
const {adminLogin, studentLogin, logout} = require('../Controllers/auth')

router.post('/admin', adminLogin)
router.post('/student', studentLogin)
router.post('/logout', logout)

module.exports = router;