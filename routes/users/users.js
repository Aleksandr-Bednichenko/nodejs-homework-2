const express = require('express')
const router = express.Router()
const { signup, login, logout, currentUser, updateSub } = require('../../controllers/users')
const { validateUser, validateUpdateSub} = require('./validation')
const guard = require('../../helpers/guard')

router.post('/signup',validateUser, signup)
router.post('/login',validateUser, login)
router.post('/logout', guard, logout)
router.get("/current", guard, currentUser)
router.patch("/", guard, validateUpdateSub, updateSub);

module.exports = router