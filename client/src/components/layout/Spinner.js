// React imports
import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ size, className, ...rest }) => {
    className = className ? className : '';
    return (
        <>
            <div className={size && ['xs', 'sm', 'm', 'lg'].includes(size) ? `${className} spinner-${size}` : `${className} spinner-m`} {...rest}></div>
        </>
    );
};

Spinner.propTypes = {
    size: PropTypes.string,
    className: PropTypes.string
};

export default Spinner;
