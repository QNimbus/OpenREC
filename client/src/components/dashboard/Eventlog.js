// React imports
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Redux imports
import store from '../../redux';

// Component imports
import Spinner from '../layout/Spinner';

// Action imports

const Eventlog = ({
  auth,
  eventlog: { eventlogs, loading },
  job: { jobs, jobsLoading },
  match: {
    params: { id }
  }
}) => {
  const [eventLogJobs, setEventLogJobs] = useState({});

  // Load all state data when component is first loaded
  useEffect(() => {
    store.dispatch({
      type: 'GET_ALL'
    });
  }, []);

  useEffect(() => {
    // Start with an empty jobs object
    let newJobs = {};

    // Check every job if it belongs to current eventLog
    Object.entries(jobs).forEach(([jobId, job]) => {
      if (job.eventLog === id) {
        newJobs[jobId] = job;
      }
    });

    setEventLogJobs(newJobs);
  }, [jobs]);

  const getDuration = duration => {
    duration /= 1000;
    let remaining = duration % 3600;
    const hours = Math.floor(duration / 3600).toString();
    const minutes = Math.floor(remaining / 60).toString();
    const seconds = Math.floor(remaining % 60).toString();
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`;
  };

  const joblist = jobs => {
    let list = [];
    Object.entries(jobs).forEach(([id, job]) => {
      if (job.nextInvocation) {
        list.push(
          <li key={id}>
            <span>{job.name}</span>
          </li>
        );
      }
    });
    return (
      <>
        <div></div>
        <div>
          <ul>{list}</ul>
        </div>
      </>
    );
  };

  if (loading || !eventlogs) {
    return <Spinner />;
  } else {
    if (!eventlogs || !eventlogs.hasOwnProperty(id)) {
      return (
        <>
          <div id='eventlog'>
            <div className='eventlog-header'>
              <h3 className='text-primary p-0'>Not found</h3>
            </div>
            <p>Eventlog with ID '{id}' not found</p>
            <div className='eventlog-footer'></div>
          </div>
        </>
      );
    } else {
      let name, description, recording, playback, filters, start, end, duration, events;
      ({ name, description, recording, playback, filters, start, end, duration, events } = eventlogs[id]);

      return (
        <>
          <div id='eventlog'>
            <div className='eventlog-header'>
              <h3 className='text-primary p-0'>{name}</h3>
            </div>
            <div className='eventlog-content'>
              <div>Property</div>
              <div>Value</div>
              <div>description</div>
              <div>{description}</div>
              <div>recording</div>
              <div>{recording ? 'true' : 'false'}</div>
              <div>playback</div>
              <div>{playback ? 'true' : 'false'}</div>
              <div>start</div>
              <div>{start}</div>
              <div>end</div>
              <div>{end}</div>
              <div>duration</div>
              <div>{getDuration(duration)}</div>
              <div>jobs</div>
              <div>{Object.keys(eventLogJobs).length}</div>
              {joblist(eventLogJobs)}
              <div>filters</div>
              <div>{filters.length}</div>
              <div>events</div>
              <div>{events.length}</div>
            </div>
            <div className='eventlog-footer'></div>
          </div>
        </>
      );
    }
  }
};

const mapStateToProps = state => ({
  auth: state.auth,
  eventlog: state.eventlog,
  job: state.job
});

Eventlog.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default connect(mapStateToProps, {})(Eventlog);
