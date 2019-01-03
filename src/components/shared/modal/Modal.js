import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Modal = ({ handleClose, show, children , modalType}) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';

    return (
      <div className={showHideClassName} onClick={handleClose} id="closeModal">
        <section className='modal-main' id={modalType}>        
          <div className="modal-close" onClick={handleClose} >
            <FontAwesomeIcon icon="times" id="closeModal"/>
          </div>
          {children}
        </section>
      </div>
    );
};

export default Modal;