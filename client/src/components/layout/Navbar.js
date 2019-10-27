// React imports
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

// Action imports
import { logout } from '../../redux/actions';

const Navbar = ({ logout, auth: { isAuthenticated, loading } }) => {
  const authLinks = (
    <ul>
      <li>
        <Link className='btn' to='/filters'>
          <span className='fas fa-sort-amount-down'></span>
          <span className='hide-sm'> Filters</span>
        </Link>
      </li>
      <li>
        <Link className='btn' to='/eventlogs'>
          <span className='fas fa-tasks'></span>
          <span className='hide-sm'> Eventlogs</span>
        </Link>
      </li>
      <li>
        <Link className='btn' to='#!' onClick={logout}>
          <span className='fas fa-sign-out-alt'></span>
          <span className='hide-sm'> Logout</span>
        </Link>
      </li>
    </ul>
  );

  const guestLinks = (
    <ul>
      <li>
        <Link className='btn' to='/register'>
          <span className='fas fa-user-plus'></span>
          <span className='hide-sm'> Register</span>
        </Link>
        <Link className='btn' to='/login'>
          <span className='fas fa-sign-in-alt'></span>
          <span className='hide-sm'> Sign in</span>
        </Link>
      </li>
    </ul>
  );

  return (
    <nav id='navbar'>
      <div className='nav-logo'>
        <img src='/assets/img/openhab_logo.png' alt='' />
        <h1>
          Open<span className='bold'>REC</span>
        </h1>
      </div>
      <div className='nav-links'>{!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}</div>
    </nav>
  );
};

const mapStateToProps = state => ({
  auth: state.auth
});

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

export default connect(mapStateToProps, { logout })(Navbar);
