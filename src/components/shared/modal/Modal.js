import React from 'react';

const Modal = ({ handleClose, show, children , modalType, close}) => {
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';

    return (
      <div className={showHideClassName} onClick={handleClose} id="closeModal">
        <section className='modal-main' id={modalType}>        
          <div className="modal-close" onClick={handleClose} >
          {!close && <i className="fas fa-times" id="closeModal"></i>}
          </div>
          {children}
        </section>
      </div>
    );
};

export default Modal;