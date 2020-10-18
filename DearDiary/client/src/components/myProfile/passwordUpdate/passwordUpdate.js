/****************************************
 * Title: passwordIpdate
 * Intial Date:
 * Summary: component for updateing passwords. required the user to have oldpassword as well.
 * Change 1:
 ***************************************/
import React, { useState, useCallback } from "react";

import useHttp from "../../../utils/apiCalls";
import InputLabel from "../../../UI/inputFields/inputFields";
import Buttons from "../../../UI/buttons/buttons";
import Card from "../../../UI/card/card";
import LoadingIndicator from "../../../UI/loading/LoadingIndicator";

const PasswordUpdate = () => {
  let [oldPassword, setOldPassword] = useState("");
  let [newPassword, setNewPassword] = useState("");
  const { isLoading, data, error, sendRequest } = useHttp();

  const onUpdateHandler = useCallback(
    (event) => {
      event.preventDefault();
      // {old password and new password shouldn't match handled on server side}
      sendRequest(`/users/updatepassword`, "PATCH", {
        oldPassword,
        newPassword,
      });
    },
    [sendRequest, oldPassword, newPassword]
  );

  let successMessage = "";
  if (data) successMessage = <div>Password has been updated.</div>;

  let passwordContent = (
    <form onSubmit={(event) => onUpdateHandler(event)}>
      <InputLabel
        value={oldPassword}
        changed={(evt) => setOldPassword(evt.currentTarget.value)}
        inputType={"password"}
        labelName={"Old Password"}
        require={true}
        styling={"myProfile"}
      />
      <InputLabel
        value={newPassword}
        changed={(evt) => setNewPassword(evt.currentTarget.value)}
        inputType={"password"}
        labelName={"New Password"}
        require={true}
        styling={"myProfile"}
      />
      <Buttons buttonColor="Red" title="Update"></Buttons>
      {successMessage}
    </form>
  );
  if (isLoading) passwordContent = <LoadingIndicator />;

  return (
    <Card
      cardContent={passwordContent}
      ForProfile={true}
      message={error}
      cardTitle={"Update Password"}
    ></Card>
  );
};

export default PasswordUpdate;
