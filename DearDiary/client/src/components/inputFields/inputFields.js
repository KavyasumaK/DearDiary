import React from "react";

import Classes from "./inputFields.module.css";

const inputFields = (props) => {
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
      ></input>
    </div>
  );
};

export default inputFields;
