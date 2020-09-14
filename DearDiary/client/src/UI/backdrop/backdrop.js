/****************************************
 * Title: backdrop
 * Intial Date: 09/13/2020
 * Summary: darkens the screen with an opacity.
 * Change 1:
 ***************************************/
import React from 'react';

import classes from './backdrop.module.css';

const backdrop = (props) => (
    props.show ? <div className={classes.Backdrop} onClick={props.clicked}></div> : null
);

export default backdrop;