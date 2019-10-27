// Global imports
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Local imports
const auth = require('../../middleware/auth');
const OpenHABRecorder = require('../../openrecorder');

OpenHABRecorder.initialize();

// @route   GET api/eventlogs
// @desc    Get current logs
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    return res.json(await OpenHABRecorder.getEventLogs());
  } catch (err) {
    console.error(err.message);
    return res.status(400).send({ errors: [{ msg: err.message }] });
  }
});

// @route   GET api/eventlogs/[id]
// @desc    Get specific log
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    res.json(await OpenHABRecorder.getEventLog(req.params.id));
  } catch (err) {
    console.error(err.message);
    return res.status(400).send({ errors: [{ msg: err.message }] });
  }
});

// @route   POST api/eventlogs
// @desc    Create a new eventlog
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

    const { name, description, filters } = req.body;

    try {
      return res.json(await OpenHABRecorder.createEventLog(name, description, filters));
    } catch (err) {
      console.error(err.message);
      return res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

// @route   PUT api/eventlogs
// @desc    Update an existing eventlog
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

    const { id, name, description, filters } = req.body;

    try {
      return res.json(await OpenHABRecorder.updateEventLog(id, name, description, filters));
    } catch (err) {
      console.error(err.message);
      return res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

// @route   DELETE api/eventlogs
// @desc    Remove an eventlog
// @access  Private
router.delete(
  '/',
  [
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

    const { id } = req.body;

    try {
      return res.json(await OpenHABRecorder.removeEventLog(id));
    } catch (err) {
      console.error(err.message);
      return res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

// @route   POST api/eventlogs/startRecording
// @desc    Start recording of eventlog
// @access  Private
router.post(
  '/startRecording',
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

    const { id, autoStopRecording, duration } = req.body;

    try {
      return res.json(await OpenHABRecorder.startRecording(id, { autoStopRecording, duration }));
    } catch (err) {
      console.error(err.message);
      return res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

// @route   POST api/eventlogs/stopRecording
// @desc    Stop recording of eventlog
// @access  Private
router.post(
  '/stopRecording',
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

    const { id } = req.body;

    try {
      return res.json(await OpenHABRecorder.stopRecording(id));
    } catch (err) {
      console.error(err.message);
      return res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

// @route   POST api/eventlogs/play
// @desc    Playback eventlog
// @access  Private
router.post(
  '/play',
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

    const { id, immediate, daily, offset } = req.body;

    try {
      return res.json(await OpenHABRecorder.startPlayback(id, { immediate, daily, offset }));
    } catch (err) {
      console.error(err.message);
      return res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

// @route   POST api/eventlogs/stop
// @desc    Stop playback of eventlog
// @access  Private
router.post(
  '/stop',
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

    const { id } = req.body;

    try {
      return res.json(await OpenHABRecorder.stopPlayback(id));
    } catch (err) {
      console.log(err);
      console.error(err.message);
      return res.status(400).send({ errors: [{ msg: err.message }] });
    }
  }
);

module.exports = router;
