const express = require('express')
const router = express.Router()
const { signup, 
        login, 
        logout, 
        currentUser, 
        updateSub, 
        uploadAvatar, 
        verifyUser, 
        repeatEmailForVerifyUser 
    } = require('../../controllers/users')
const { validateUser, validateUpdateSub} = require('./validation')
const guard = require('../../helpers/guard')
const loginLimit  = require('../../helpers/rate-limit-login')
const upload = require('../../helpers/uploads')
const wrapError = require('../../helpers/errorHandler')

router.post('/signup',validateUser, signup)
router.post('/login',validateUser, loginLimit, login)
router.post('/logout', guard, logout)
router.get("/current", guard, currentUser)
router.patch("/", guard, validateUpdateSub, updateSub)
router.patch('/avatar', guard, upload.single('avatar'), uploadAvatar)

router.get('/verify/:token', wrapError(verifyUser))
router.post('/verify', repeatEmailForVerifyUser)

module.exports = router