// React imports
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

// Action imports
import { setAlert, register } from '../../redux/actions';

const Register = ({ isAuthenticated, setAlert, register }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = e => {
        e.preventDefault();
        if (password !== password2) {
            setAlert('Passwords do not match', 'danger');
        } else {
            register(name, email, password);
        }
    };

    if (isAuthenticated) {
        return <Redirect to='/eventlogs' />;
    }

    return (
        <div className='form-container'>
            <h1>Sign up</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis, quis.</p>
            <form className='form' onSubmit={e => onSubmit(e)}>
                <div className='form-group'>
                    <label htmlFor='name'>Name</label>
                    <input type='text' name='name' value={name} onChange={e => onChange(e)} required />
                </div>
                <div className='form-group'>
                    <label htmlFor='email'>Email</label>
                    <input autoComplete='username' type='text' name='email' value={email} onChange={e => onChange(e)} required />
                </div>
                <div className='form-group'>
                    <label htmlFor='password'>Password</label>
                    <input autoComplete='new-password' type='password' name='password' value={password} onChange={e => onChange(e)} required />
                </div>
                <div className='form-group'>
                    <label htmlFor='password2'>Verify password</label>
                    <input autoComplete='new-password' type='password' name='password2' value={password2} onChange={e => onChange(e)} required />
                </div>
                <button className='btn btn-dark'>Sign up</button>
            </form>
            <p className='footer'>
                Already have an account? <Link to='/login'>Sign in here</Link>
            </p>
        </div>
    );
};

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

export default connect(
    mapStateToProps,
    { setAlert, register }
)(Register);
