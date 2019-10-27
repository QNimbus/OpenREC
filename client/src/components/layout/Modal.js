// React imports
import React from 'react';

const Modal = () => {
    return (
        <div className='modal-content'>
            <div className='modal-header'>
                <h1>Modal header</h1>
                <span className='btn-close'>&times;</span>
            </div>
            <div className='modal-body'>
                <p>Hello I am a modal</p>
                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. At quasi corrupti et voluptatem nostrum id
                    sed nesciunt saepe. Deleniti labore molestiae dolor? Error optio nobis labore doloremque
                    consequuntur, voluptatem vel.
                </p>
            </div>
            <div className='modal-footer'>
                <h3>Modal footer</h3>
            </div>
        </div>
    );
};

export default Modal;
