// React imports
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Redux imports
import store from '../../redux';

// Component imports
import Spinner from '../layout/Spinner';

// Action imports
import { getFilters } from '../../redux/actions';

const Filters = ({ auth, filter: { filters, loading } }) => {
    useEffect(() => {
        store.dispatch(getFilters());
    }, []);
    const formInitialState = {
        name: '',
        description: ''
    };

    const [showAddFilter, toggleShowAddFilter] = useState(false);
    const [formData, setFormData] = useState(formInitialState);

    const { name, description } = formData;

    const clearForm = () => setFormData({ ...formInitialState });
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = e => {
        // addEventlog(name, description);
        toggleShowAddFilter(false);
        clearForm();
        e.preventDefault();
    };

    return loading && filters === null ? (
        <Spinner />
    ) : (
        <>
            <div className='filters'>
                <div className='filters-header'>
                    <h3 className='text-primary p-0'>Filters</h3>
                    <span
                        onClick={() => {
                            clearForm();
                            toggleShowAddFilter(!showAddFilter);
                        }}
                        className={`add-filter ${showAddFilter ? 'rotate' : ''} fas fa-plus fa-2x`}
                    ></span>
                </div>
                <div className='row'>
                    <div className='item'>Name</div>
                    <div className='item align-right'>Actions</div>
                </div>
                <form className='form' onSubmit={e => onSubmit(e)}>
                    <div className={showAddFilter ? 'row-add active' : 'row-add'}>
                        <div className='item'></div>
                        <div className='form-group'>
                            <input type='text' name='name' placeholder='Name' value={name} onChange={e => onChange(e)} required />
                        </div>
                        <div className='action'>
                            <button type='submit'>
                                <span className='fas fa-check fa-2x'></span>
                            </button>
                        </div>
                    </div>
                </form>
                <div className='row active'>
                    <div className='item'>Dimmers</div>
                    <div className='action'>
                        <span className='far fa-edit'></span>
                        <span className='fas fa-times'></span>
                    </div>
                    <div className='row-detail'>
                        <div className='shortcut'></div>
                        <div className='label'>Description</div>
                        <div className='shortcut'></div>
                        <div className='detail'>Yet another description</div>
                    </div>
                    <div className='row-detail'>
                        <div className='shortcut'></div>
                        <div className='label'>Groups</div>
                        <div className='shortcut'></div>
                        <div className='detail'>
                            <select className='js-example-basic-single' name='state'>
                                <option value='AL'>Alabama</option>
                                <option value='WY'>Wyoming</option>
                            </select>
                        </div>
                    </div>
                    <div className='row-detail'>
                        <div className='shortcut'></div>
                        <div className='label'>Filters</div>
                        <div className='shortcut'></div>
                        <div className='detail'>1</div>
                    </div>
                </div>
                <div className='filters-footer'></div>
            </div>
        </>
    );
};

const mapStateToProps = state => ({
    auth: state.auth,
    filter: state.filter
});

Filters.propTypes = {
    auth: PropTypes.object.isRequired,
    getFilters: PropTypes.func.isRequired
};

export default connect(
    mapStateToProps,
    { getFilters }
)(Filters);
