// React imports
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Redux imports
import store from '../../redux';

// Component imports
import Spinner from '../layout/Spinner';

// Action imports
import {
  getEventlogs,
  removeEventlog,
  startRecordEventlog,
  stopRecordEventlog,
  startPlaybackEventlog,
  stopPlaybackEventlog,
  addEventlog
} from '../../redux/actions';

const Eventlogs = ({
  auth,
  eventlog: { eventlogs, loading },
  removeEventlog,
  startRecordEventlog,
  stopRecordEventlog,
  startPlaybackEventlog,
  stopPlaybackEventlog,
  addEventlog
}) => {
  // Load all state data when component is first loaded
  useEffect(() => {
    store.dispatch({
      type: 'GET_ALL'
    });
  }, []);

  const formInitialState = {
    name: '',
    description: ''
  };

  const [formData, setFormData] = useState(formInitialState);
  const [showAddEventlog, toggleShowAddEventlog] = useState(false);
  // const [displayDetails, toggleDisplayDetails] = useState(eventlogs !== null ? Object.assign({}, ...Object.keys(eventlogs).map(k => ({ [k]: false }))) : {});

  const { name, description } = formData;

  const startPlayback = id => {
    startPlaybackEventlog(id);
  };

  const stopPlayback = id => {
    stopPlaybackEventlog(id);
  };

  const record = id => {
    startRecordEventlog(id);
  };

  const stop = id => {
    stopRecordEventlog(id);
  };

  const remove = id => {
    removeEventlog(id);
  };

  const clearForm = () => setFormData({ ...formInitialState });
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onSubmit = e => {
    addEventlog(name, description);
    toggleShowAddEventlog(false);
    clearForm();
    e.preventDefault();
  };

  const eventLogStatus = eventLog => {
    let status = 'none';
    let icon = 'icon';

    if (eventLog.playback) {
      status = 'playback';
      icon += ' fas fa-play';
    } else if (eventLog.recording) {
      status = 'recording';
    }

    return (
      <div className={`status ${status}`}>
        <div className={icon}></div>
        <div className='animation'>
          <div className='loader'></div>
        </div>
      </div>
    );
  };

  const eventLogActionsButtons = eventLog => {
    return (
      <div className='action-buttons text-end'>
        {eventLog.playback ? (
          <span onClick={stopPlayback.bind(null, eventLog.id)} className='fas fa-pause'></span>
        ) : !eventLog.recording && eventLog.events.length > 0 ? (
          <span onClick={startPlayback.bind(null, eventLog.id)} className={`fas fa-play ${eventLog.events.length > 0 ? '' : 'inactive'}`}></span>
        ) : (
          <span className='fas fa-play inactive'></span>
        )}
        {eventLog.recording ? (
          <span onClick={stop.bind(null, eventLog.id)} className='fas fa-stop'></span>
        ) : eventLog.playback ? (
          <span className='fas fa-circle inactive'></span>
        ) : (
          <span onClick={record.bind(null, eventLog.id)} className={'fas fa-circle'}></span>
        )}
        {eventLog.recording || eventLog.playback ? <span className='far fa-edit inactive'></span> : <span className='far fa-edit'></span>}
        <span className='fa fa-ellipsis-h'></span>
        <Link to={`/eventlog/${eventLog.id}`}>
          <span className='fas fa-list-ul'></span>
        </Link>
        {eventLog.recording || eventLog.playback ? (
          <span className='fas fa-times inactive'></span>
        ) : (
          <span onClick={remove.bind(null, eventLog.id)} className='fas fa-times'></span>
        )}
      </div>
    );
  };

  const eventlogRow = eventLog => {
    return (
      <div key={eventLog.id} className='row'>
        {eventLogStatus(eventLog)}
        <div className='name'>{eventLog.name}</div>
        <div className='description'>
          <span>{eventLog.description}</span>
        </div>
        <div className='actions'>{eventLogActionsButtons(eventLog)}</div>
      </div>
    );
  };

  return loading && eventlogs === null ? (
    <Spinner />
  ) : (
    <>
      <div id='eventlogs'>
        <div className='eventlogs-header'>
          <h3 className='text-primary p-0'>Eventlogs</h3>
          <span
            onClick={() => {
              clearForm();
              toggleShowAddEventlog(!showAddEventlog);
            }}
            className={`add-eventlog ${showAddEventlog ? 'rotate' : ''} fas fa-plus fa-2x`}
          ></span>
        </div>
        <div className='eventlogs-content'>
          <div className='row header'>
            <div className='status'>Status</div>
            <div className='name'>Name</div>
            <div className='description'>Description</div>
            <div className='actions text-end'>Actions</div>
          </div>
          <form className='form' onSubmit={e => onSubmit(e)}>
            <div className={showAddEventlog ? 'row add' : 'row add hidden'}>
              <div className='status'>
                <button className='btn-nostyle' type='submit'>
                  <i className='fas fa-plus'></i>
                </button>
              </div>
              <div className='name'>
                <div className='form-group'>
                  <input type='text' name='name' placeholder='Name' value={name} onChange={e => onChange(e)} required />
                </div>
              </div>
              <div className='description'>
                <div className='form-group hide-sm'>
                  <input type='text' name='description' placeholder='Eventlog description' value={description} onChange={e => onChange(e)} />
                </div>
              </div>
            </div>
          </form>
          {(() => {
            var rows = [];
            if (eventlogs !== null) {
              for (var id in eventlogs) {
                rows.push(eventlogRow(eventlogs[id]));
              }
            }
            return rows;
          })()}
        </div>
        <div className='eventlogs-footer'></div>
      </div>
    </>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  eventlog: state.eventlog,
  job: state.job
});

Eventlogs.propTypes = {
  auth: PropTypes.object.isRequired,
  eventlog: PropTypes.object.isRequired,
  getEventlogs: PropTypes.func.isRequired,
  removeEventlog: PropTypes.func.isRequired,
  startRecordEventlog: PropTypes.func.isRequired,
  stopRecordEventlog: PropTypes.func.isRequired,
  startPlaybackEventlog: PropTypes.func.isRequired,
  stopPlaybackEventlog: PropTypes.func.isRequired,
  addEventlog: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  removeEventlog,
  getEventlogs,
  startRecordEventlog,
  stopRecordEventlog,
  startPlaybackEventlog,
  stopPlaybackEventlog,
  addEventlog
})(Eventlogs);
