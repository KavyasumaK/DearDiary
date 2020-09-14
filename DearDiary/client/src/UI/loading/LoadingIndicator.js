/****************************************
 * Title: Loading Indicator
 * Intial Date:
 * Summary: A ring show something is happening in the background.
 * Change 1:
 ***************************************/
import React from 'react';

import './LoadingIndicator.css';

const LoadingIndicator = () => (
  <div className="lds-ring">
    <div />
    <div />
    <div />
    <div />
  </div>
);

export default LoadingIndicator;
