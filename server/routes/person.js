const express = require('express');
const router = express.Router();
const {
  getPersons,
  getPerson,
  createPerson,
  updatePerson,
  deletePerson,
  uploadPersonPhoto
} = require('../controllers/personController');
const { protect } = require('../middleware/auth');
const { uploadPhoto } = require('../middleware/upload');

router.use(protect);

router.route('/')
  .get(getPersons)
  .post(createPerson);

router.route('/:id')
  .get(getPerson)
  .put(updatePerson)
  .delete(deletePerson);

router.post('/:id/photo', uploadPhoto, uploadPersonPhoto);

module.exports = router;
