// backend/src/routes/guide.js
const express = require('express');
const router  = express.Router();
const {
  getGuides,
  getGuidesByLocation,
  getGuideById,
  assignLocation
} = require('../controllers/guideController');
const authMiddleware = require('../middleware/authMiddleware');
const bodyParser = require('body-parser');

router.use(bodyParser.json());

// 1) Khi có ?locationId thì dùng getGuidesByLocation, ngược lại getGuides
router.get('/', (req, res, next) => {
  if (req.query.locationId) {
    return getGuidesByLocation(req, res, next);
  }
  return getGuides(req, res, next);
});

// 2) Chi tiết 1 guide
router.get('/:id', getGuideById);
router.put('/:id/assign-location', authMiddleware, assignLocation);



module.exports = router;
