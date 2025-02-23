const Contact = require('../model/contact')

const listContacts = async (userId, query) => {
  // const results = await Contact.find({ owner: userId }).populate({
  //   path: 'owner',
  //   select: 'email subscription createdAt updatedAt'
  // })
  const {favorite = null, limit = 3, page = 1 } = query
  const searchOptions = { owner: userId }
  if (favorite !== null) {
    searchOptions.favorite = favorite
  }
  const results = await Contact.paginate(searchOptions, { 
    limit, 
    page, 
    populate:{
    path: 'owner',
    select: 'email subscription createdAt updatedAt'
  } 
})
  const {docs: contacts} = results
  delete results.docs
  return {...results, contacts}
}

const getContactById = async (contactId, userId) => {
  const result = await Contact.findOne({ _id: contactId, owner: userId }).populate({
    path: 'owner',
    select: 'email subscription createdAt updatedAt'
  })
  return result
}

const removeContact = async (contactId) => {
  const result = await Contact.findOneAndRemove({ _id: contactId, owner: userId })
  return result
}
const addContact = async (body) => {
  const result = await Contact.create(body)
  return result
}

const updateContact = async (contactId, body, userId) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  )
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
