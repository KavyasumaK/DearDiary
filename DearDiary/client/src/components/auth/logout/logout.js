/****************************************
 * Title: logout
 * Intial Date: 
 * Summary: If the user is logged in logs the user out and redirects to landing page. No UI.
 * Change 1:
 ***************************************/

import React, { useMemo } from 'react';
import { Redirect } from 'react-router-dom';

import useHTTP from '../../../utils/apiCalls';

const Logout = ()=>{
  const {sendRequest, error, data} = useHTTP();
  useMemo(()=>{
    sendRequest(`http://localhost:1337/api/v1/users/logout`,
    "GET")
  },[sendRequest]);
  if(!error||data) {
    return <Redirect to='/'/>
  }
  else if(error) alert('Something went wrong');
}

export default Logout;