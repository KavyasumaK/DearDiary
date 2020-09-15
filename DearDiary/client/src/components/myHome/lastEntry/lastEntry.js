import React from "react";

import Classes from './lastEntry.module.css';

import privacyLocked from "../../../assets/icons/privacy_locked.svg";
import privacyUnlock from "../../../assets/icons/privacy_unlock.svg";

const lastEntry = React.memo((props) => {
  return (
    <div className={Classes.LastEntry}>
          <div>
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
          </div>

          <div>Dear {props.dear},</div>
          <div>{props.entry}</div>
        </div>
  );
});

export default lastEntry;