const Joi = require('joi')

const schemaUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(16).required()
})



const schemaValidateUpdateSub = Joi.object({
    subscription: Joi.any().valid("free", "pro", "premium").required(),
  });

const validate = async (schema, obj, res, next) => {
  try {
    await schema.validateAsync(obj)
    next()
  } catch (err) {
    res.status(400).json({
      status: 'error',
      code: 400,
      message: `Field ${err.message.replace(/"/g, '')}`,
    })
  }
}

module.exports.validateUser = async (req, res, next) => {
  return await validate(schemaUser, req.body, res, next)
}

module.exports.validateUpdateSub = (req, _res, next) => {
    return validate(schemaValidateUpdateSub, req.body, next);
  };

// module.exports.validateStatusContact = async (req, res, next) => {
//   return await validate(schemaStatusContact, req.body, res, next)
// }