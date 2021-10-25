const multer  = require('multer')
const { CustomError } = require('./customError')
require('dotenv').config()
const TMP_DIR = process.env.TMP_DIR

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, TMP_DIR)
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now().toString()}_${file.originalname}`)
    },
  })
  
  const upload = multer({
    storage: storage,
    limits: { fieldSize: 2000000 },
    fileFilter: (req, file, cb) => {
      if (file.mimetype.includes('image')) {
        return cb(null, true)
      }
  
      // Вы можете всегда вернуть ошибку, если что-то пошло не так:
      cb(new CustomError(400, 'Wrong format for avatar'))
    },
  })

// const upload = multer({ dest: 'tmp/' })

module.exports = upload