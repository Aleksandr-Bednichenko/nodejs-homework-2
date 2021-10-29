const jwt = require('jsonwebtoken')
const fs = require('fs/promises')
// const path = require('path')
// const mkdirp = require('mkdirp')
const Users = require('../repository/users.js')
// const UploadService = require('../services/file-upload')
const { HttpCode } = require('../config/constants')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET_KEY
const UploadService = require('../services/cloud-upload')
const EmailService = require('../services/email/service')
const {
  CreateSenderSendGrid,
  CreateSenderNodemailer,
} = require('../services/email/sender')





const signup = async (req, res, next) => {
  const { email, password, subscription} = req.body
  const user = await Users.findByEmail(email)
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email is already exist',
    })
  }
  try {
    const newUser = await Users.create({ email, password, subscription })
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderSendGrid(),
    )
    const statusEmail = await emailService.sendVerifyEmail(
      newUser.email,
      newUser.verifyToken,
    )
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
        successEmail: statusEmail
      },
    })
  } catch (e) {
    next(e)
  }
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await Users.findByEmail(email)
  const isValidPassword = await user?.isValidPassword(password)
  if (!user || !isValidPassword || !user?.isVerified) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Invalid credentials',
    })
  }
  const id = user._id
  const payload = { id }
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
  await Users.updateToken(id, token)
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    date: {
      token,
    },
  })
}

const logout = async (req, res, next) => {
  const id = req.user._id
  await Users.updateToken(id, null)
  return res.status(HttpCode.NO_CONTENT).json({ test: 'test' })
}

const currentUser = async (req, res, next) => {
  const id = req.user.id;
  try {
    const user = await Users.findById(id);

    return res.status(HttpCode.OK).json({
      status: "success",
      code: HttpCode.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

const updateSub = async (req, res, next) => {
  const id = req.user.id;
  try {
    await Users.updateSubUser(id, req.body.subscription);
    const user = await Users.findById(id);
    return res.json({
      status: "success",
      code: HttpCode.OK,
      data: {
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      },
    });
  } catch (e) {
    if (e.name === "CastError") {
      return next({
        status: HttpCode.NOT_FOUND,
        message: "Not Found",
      });
    }
    next(e);
  }
}

// Local storage
// const uploadAvatar = async (req, res, next) => {
//   const id = String(req.user._id)
//   const file = req.file
//   const AVATAR_OF_USERS = process.env.AVATAR_OF_USERS
//   const destination = path.join(AVATAR_OF_USERS, id)
//   await mkdirp(destination)
//   const uploadService = new UploadService(destination)
//   const avatarUrl = await uploadService.save(file, id)
//   await Users.updateAvatar(id, avatarUrl)

//   return res.status(HttpCode.OK).json({
//     status: 'success',
//     code: HttpCode.OK,
//     date: {
//       avatar: avatarUrl,
//     },
//   })
// }


// Cloud Storage
const uploadAvatar = async (req, res, next) => {
  const { id, idUserCloud } = req.user
  const file = req.file

  const destination = 'Avatars'
  const uploadService = new UploadService(destination)
  const { avatarUrl, returnIdUserCloud } = await uploadService.save(
    file.path,
    idUserCloud,
  )

  await Users.updateAvatar(id, avatarUrl, returnIdUserCloud)
  try {
    await fs.unlink(file.path)
  } catch (error) {
    console.log(error.message)
  }
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    date: {
      avatar: avatarUrl,
    },
  })
}

const verifyUser = async (req, res, next) => {
  const user = await Users.findUserByVerifyToken(req.params.token)
  if (user) {
    await Users.updateTokenVerify(user._id, true, null)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        message: 'Success',
      },
    })
  }
  return res.status(HttpCode.BAD_REQUEST).json({
    status: 'error',
    code: HttpCode.BAD_REQUEST,
    message: 'Invalid token',
  })
}

const repeatEmailForVerifyUser = async (req, res, next) => {
  const { email } = req.body
  const user = await Users.findByEmail(email)
  if (user) {
    const { email, verifyToken } = user
    const emailService = new EmailService(
      process.env.NODE_ENV,
      new CreateSenderSendGrid(),
    )
    const statusEmail = await emailService.sendVerifyEmail(
      email,
      verifyToken,
    )
  }
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    data: {
      message: 'Success',
    },
  })
}

module.exports = {
  signup,
  login,
  logout,
  currentUser,
  updateSub,
  uploadAvatar,
  verifyUser,
  repeatEmailForVerifyUser
}