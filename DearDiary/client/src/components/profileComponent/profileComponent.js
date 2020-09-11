import React from "react";

import Classes from "./profileComponent.module.css";

const profileComponent = (props) => {
  return (
    <div className={Classes.ProfileComponent}>
      <label className={Classes.ProfileLabel}>{props.title}</label>
      <input
        className={Classes.ProfileInput}
        onChange={props.changed}
        type={props.type}
        required={props.isRequired}
        minLength={props.minimumLength}
        value={props.value}
      >
      </input>
    </div>
  );
};

export default profileComponent;
