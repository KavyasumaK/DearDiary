import React from 'react';
import CSSTransition from 'react-transition-group/CSSTransition';

import Classes from './errorModal.module.css';

const errorModal = (props) => {
  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      in={props.show}
      timeout={3000}
      classNames={{
        enterActive: Classes['fadeslide-enter-active'],
      }}
    >
      <div className={Classes.ErrorModal}>
        <p>Oops! Something went wrong,</p>
        <p>
          looks like you are not{' '}
          <a href="/login" className={Classes.ErrorLink}>
            logged in
          </a>
          .
        </p>
        If you do not have an account with us, please{' '}
        <a href="/signup" className={Classes.ErrorLink}>
          Sign up
        </a>
        .
      </div>
    </CSSTransition>
  );
};

export default errorModal;