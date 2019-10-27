// React imports
import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

const Landing = ({ isAuthenticated }) => {
    if (isAuthenticated) {
        return <Redirect to='/eventlogs' />;
    }

    return (
        <div className='container'>
            <h1>Landing</h1>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

Landing.propTypes = {
    isAuthenticated: PropTypes.bool
};

export default connect(mapStateToProps)(Landing);
