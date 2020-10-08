import React from "react";

import Classes from "./lastEntry.module.css";

import PrivacyIcons from "../../../UI/privacyIcons/privacyIcons";

const lastEntry = React.memo((props) => {
  return (
    <div className={Classes.LastEntry}>
      <PrivacyIcons privacy={props.privacy} />
      <div>{props.dear}</div>
      <div className={Classes.toRetainWhiteSpace}>{props.entry}</div>
    </div>
  );
});

export default lastEntry;
