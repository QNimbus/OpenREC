// Global imports
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Local imports
const auth = require('../../middleware/auth');
const OpenHABRecorder = require('../../openrecorder');

// @route   GET api/filters
// @desc    Get current filters
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    return res.json(await OpenHABRecorder.getEventLogFilters());
  } catch (err) {
    console.error(err.message);
    return res.status(400).send({ errors: [{ msg: err.message }] });
  }
});

// @route   POST api/filters
// @desc    Create a new eventlog filter
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, filter } = req.body;

    try {
      const eventLogFilter = await OpenHABRecorder.createEventLogFilter(name, description, filter);

      return res.json(eventLogFilter);
    } catch (err) {
      console.error(err.message);
      return res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

// @route   PUT api/filters
// @desc    Update an existing eventlog filter
// @access  Private
router.put(
  '/',
  [
    auth,
    [
      check('id', 'ID is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, name, description, filter } = req.body;

    try {
      const eventLogFilter = await OpenHABRecorder.updateEventLogFilter(id, name, description, filter);

      return res.json(eventLogFilter);
    } catch (err) {
      console.error(err.message);
      return res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

// @route   DELETE api/filters
// @desc    Remove an eventlog filter
// @access  Private
router.delete(
  '/',
  [
    auth,
    [
      check('name', 'Name is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      const eventLogFilter = await OpenHABRecorder.removeEventLogFilter(name);

      return res.json(eventLogFilter);
    } catch (err) {
      console.error(err.message);
      return res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

module.exports = router;
