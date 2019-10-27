// Global imports
const express = require('express');
const router = express.Router();

// Local imports
const auth = require('../../middleware/auth');
const OpenHABRecorder = require('../../openrecorder');

// @route   GET api/jobs
// @desc    Get current scheduled jobs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    return res.json(OpenHABRecorder.getJobs());
  } catch (err) {
    console.error(err.message);
    return res.status(400).send({ errors: [{ msg: err.message }] });
  }
});

// @route   GET api/jobs/[id]
// @desc    Get current scheduled jobs for specific log
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    res.json(await OpenHABRecorder.getJobs(req.params.id));
  } catch (err) {
    console.error(err.message);
    return res.status(400).send({ errors: [{ msg: err.message }] });
  }
});

module.exports = router;
