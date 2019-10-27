// Global imports
const express = require('express');
const SSE = require('express-sse');
const router = express.Router();

// Local imports
const OpenHABRecorder = require('../../openrecorder');

const sse = new SSE();

OpenHABRecorder.initialize();

// Create SSE end point
router.get('/', sse.init);

OpenHABRecorder.on('EVENTLOG_UPDATED', message => {
  sse.send({ type: 'EVENTLOG_UPDATED', data: message });
});

OpenHABRecorder.on('EVENTLOG_ADDED', message => {
  sse.send({ type: 'EVENTLOG_ADDED', data: message });
});

OpenHABRecorder.on('EVENTLOG_REMOVED', message => {
  sse.send({ type: 'EVENTLOG_REMOVED', data: message });
});

OpenHABRecorder.on('JOB_ADDED', message => {
  sse.send({ type: 'JOB_ADDED', data: message });
});

OpenHABRecorder.on('JOB_UPDATED', message => {
  sse.send({ type: 'JOB_UPDATED', data: message });
});

OpenHABRecorder.on('JOB_REMOVED', message => {
  sse.send({ type: 'JOB_REMOVED', data: message });
});

module.exports = router;
