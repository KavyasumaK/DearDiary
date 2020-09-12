import React, {useState, useCallback} from "react";

import useHttp from '../../utils/apiCalls';
import InputLabel from '../../components/inputFields/inputFields';
import Buttons from '../../components/buttons/buttons';


const PasswordUpdate = () => {
  let [oldPassword, setOldPassword] = useState('');
  let [newPassword, setNewPassword] = useState('');
  const { isLoading, data, error, sendRequest } = useHttp();

  const onUpdateHandler= useCallback(() => {
    // {TBD: old password and new password shouldn't match}
    sendRequest(`http://localhost:1337/api/v1/users/updatepassword`, "PATCH", {oldPassword, newPassword});
  }, [sendRequest, oldPassword, newPassword]);
  let message ='';
  if(data) message=<div>Password has been updated.</div>
  if(error) message=<div>{error}</div>
  if(isLoading) message=<div>isLoading.........</div>
  return (
    // TBD wrap in a card
    <>
      <InputLabel
        value={oldPassword}
        changed={(evt) => setOldPassword(evt.currentTarget.value)}
        inputType={'password'}
        labelName={'Old Password'}
        require={true}
      />
       <InputLabel
        value={newPassword}
        changed={(evt) => setNewPassword(evt.currentTarget.value)}
        inputType={'password'}
        labelName={'New Password'}
        require={true}
      />
      <Buttons styleType="Red" title="Update" updateHandler={onUpdateHandler}></Buttons>
      {message}
    </>
  );
};

export default PasswordUpdate;