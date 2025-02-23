const Joi = require('joi')

const schemaContact = Joi.object({
  name: Joi.string().min(1).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(10).max(15).required()
})

const schemaStatusContact = Joi.object({
  favorite: Joi.boolean().required(),
})

// const pattern = '\\w{8}-\\w{4}-\\w{4}-\\w{4}-\\w{12}'

const schemaContactId = Joi.object({
  contactId: Joi.string().required(),
})

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

module.exports.validateContact = async (req, res, next) => {
  return await validate(schemaContact, req.body, res, next)
}

module.exports.validateContactId = async (req, res, next) => {
  return await validate(schemaContactId, req.params, res, next)
}

module.exports.validateStatusContact = async (req, res, next) => {
  return await validate(schemaStatusContact, req.body, res, next)
}
