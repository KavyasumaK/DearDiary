/****************************************
 * Title: buttons
 * Intial Date:
 * Summary: uniform buttons throughout the application based on the styletype, color is changed.
 * Change 1:
 ***************************************/
import React from "react";
import { useHistory } from "react-router-dom";

import classes from "./buttons.module.css";

//upper case for functional component name as we are using hooks.
const Buttons = (props) => {
  let history = useHistory();
  const btnClass = [classes.Buttons];

  //Switching style of the button based on the prop style.
  switch (props.styleType) {
    case "Yellow":
      btnClass.push(classes.Yellow);
      break;
    case "Green":
      btnClass.push(classes.Green);
      break;
    case "Red":
      btnClass.push(classes.Red);
      break;
    case "smallCard":
      btnClass.push(classes.SmallCard);
      break;
    default:
      break;
  }

  const onClickHandler = () => {
    //redirecting to Login/signup on button click.
    if (props.redirectClicked) history.push(props.redirectClicked);
  };

  return (
    <button className={btnClass.join(" ")} onClick={props.customClickHandler?props.customClickHandler:onClickHandler}>
      {props.title}
    </button>
  );
};

export default Buttons;
