const express = require('express');
const SettingsController = require('../controllers/settings/SettingsController');
const { authMiddleware, requireAdminUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware, requireAdminUser);

router.get('/', SettingsController.getAll);
router.put('/', SettingsController.updateSettings);

module.exports = router;
