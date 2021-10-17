const express = require('express')
const router = express.Router()
const {
  getContacts,
  getContact,
  removeContact,
  saveContact,
  updateContact,
  updateStatusFavoriteContact
} = require('../../controllers/contacts')
const { validateContact, validateContactId, validateStatusContact } = require('./validation')
const guard = require('../../helpers/guard')

router.get('/', guard, getContacts)

router.get('/:contactId', guard, validateContactId, getContact)

router.post('/', guard, validateContact, saveContact)

router.delete('/:contactId', guard, validateContactId, removeContact)

router.put('/:contactId', guard, [validateContactId, validateContact], updateContact)

router.patch(
  '/:contactId/favorite/',
  guard,
  validateContactId, validateStatusContact,
  updateStatusFavoriteContact
)

module.exports = router
