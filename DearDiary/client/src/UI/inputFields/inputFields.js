/****************************************
 * Title: imputFields
 * Intial Date:
 * Summary: common label and input text combination for all forms. Styling is changed for auth and non auth forms
 * Change 1:
 ***************************************/
import React from "react";

import Classes from "./inputFields.module.css";

const inputFields = (props) => {
  let minimumLength = 0;
  let typeofInput = props.inputType.toUpperCase();
  switch (typeofInput) {
    case "PASSWORD":
      minimumLength = 8;
      break;
    case "USER NAME":
      minimumLength = 3;
      break;
    default:
      break;
  }
  return (
    <div className={props.styling?Classes.ProfileComponent:Classes.InputFields}>
      <label className={props.styling?Classes.ProfileLabel:''}>
        {props.labelName.charAt(0).toUpperCase() + props.labelName.slice(1)}
      </label>
      <input
        className={props.styling?Classes.ProfileInput:Classes.InputStyle}
        type={
          typeofInput === ("USER NAME" || "ABOUT ME")
            ? "text"
            : props.inputType
        }
        required={props.require}
        value={props.value}
        onChange={(evt) => {
          props.changed(evt);
        }}
        minLength={minimumLength}
        maxLength={150}
      ></input>
    </div>
  );
};

export default inputFields;
