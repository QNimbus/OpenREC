// React imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// Action imports
import { login } from '../../redux/actions';

// Component imports
import Spinner from '../layout/Spinner';

const Login = ({ login, auth: { isAuthenticated, loading } }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = e => {
        e.preventDefault();
        login(email, password);
    };

    if (isAuthenticated && !loading) {
        return <Redirect to='/eventlogs' />;
    }

    if (loading) {
        return <Spinner className='my-5' size='lg' />;
    }

    return (
        <div className='form-container'>
            <h1>Sign in</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, quis.</p>
            <form className='form' onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <label forhtml='email'>Email</label>
                    <input autoComplete='username' type='text' name='email' value={email} onChange={e => onChange(e)} required />
                </div>
                <div className='form-group'>
                    <label forhtml='password'>Password</label>
                    <input autoComplete='current-password' type='password' name='password' value={password} onChange={e => onChange(e)} required />
                </div>
                <button className='btn btn-dark'>Sign in</button>
            </form>
            <p className='footer'>
                Don't have an account? <Link to='/register'>Sign up here</Link>
            </p>
        </div>
    );
};

const mapStateToProps = state => ({
    auth: state.auth
});

Login.propTypes = {
    login: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

export default connect(
    mapStateToProps,
    { login }
)(Login);
