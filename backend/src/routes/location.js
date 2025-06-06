// backend/src/routes/location.js
const express = require('express');
const router = express.Router();
const upload = require('../config/upload')
const { createLocation } = require('../controllers/locationController');

const locationController = require('../controllers/locationController');
const authMiddleware = require('../middleware/authMiddleware');


// Public
router.get('/', locationController.getLocations);
router.get('/:id', locationController.getLocationById);


router.post(
    '/', 
    authMiddleware,
    upload.array('images', 10),
    createLocation);

module.exports = router;
