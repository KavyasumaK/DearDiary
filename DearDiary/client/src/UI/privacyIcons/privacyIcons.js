import React from "react";

import privacyLocked from "../../assets/icons/privacy_locked.svg";
import privacyUnlock from "../../assets/icons/privacy_unlock.svg";
import Classes from './privacyIcons.module.css';

const privacyIcons = (props) => {
  return (
    <>
      {props.privacy === "private" ? (
        <img
          alt={"Private"}
          src={privacyLocked}
          className={Classes.PrivacyIconSize}
        />
      ) : (
        <img
          alt={"Shared"}
          src={privacyUnlock}
          className={Classes.PrivacyIconSize}
        />
      )}
    </>
  );
};

export default privacyIcons;
