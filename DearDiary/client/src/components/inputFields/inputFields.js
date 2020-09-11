import React from "react";

import Classes from "./inputFields.module.css";

const inputFields = (props) => {
  let minimumLength=0;
  switch (props.inputType) {
    case 'password':
      minimumLength=8
      break;
    case 'user Name':
      minimumLength=3
      break;
    default:
      break;
  }
  return (
    <div className={Classes.InputFields}>
      <label>{props.labelName}</label>
      <input
        className={Classes.InputStyle}
        type={props.inputType === "user Name" ? "text" : props.inputType}
        required={props.require}
        value={props.value}
        onChange={(evt) => {
          props.changed(evt);
        }}
        minLength={minimumLength}
      ></input>
    </div>
  );
};

export default inputFields;
