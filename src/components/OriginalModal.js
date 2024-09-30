import React from 'react';

import Modal from './Modal';

const OriginalModal = (props) => {
    return (
        <div>
            <Modal
                onCancel={props.onClear}
                header={props.header}
                show={!!props.message}
                footer={
                    <button  onClick={props.onClear}>
                        Okay
                    </button>
                }
            >
                <p>{props.message}</p>
            </Modal>
        </div>
    );
};

export default OriginalModal;