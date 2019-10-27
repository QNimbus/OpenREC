// Global imports
const express = require('express');
const router = express.Router();

// Local imports
const auth = require('../../middleware/auth');
const OpenHABRecorder = require('../../openrecorder');

// @route   GET api/status
// @desc    Get OpenREC status
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const status = await OpenHABRecorder.getStatus();
        res.json(status);
    } catch (err) {
        console.error(err.message);
        return res.status(400).send({ errors: [{ msg: err.message }] });
    }
});

module.exports = router;
