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

router.get('/', getContacts)

router.get('/:contactId', validateContactId, getContact)

router.post('/', validateContact, saveContact)

router.delete('/:contactId', validateContactId, removeContact)

router.put('/:contactId', [validateContactId, validateContact], updateContact)

router.patch(
  '/:contactId/favorite/',
  validateContactId, validateStatusContact,
  updateStatusFavoriteContact
)

module.exports = router
