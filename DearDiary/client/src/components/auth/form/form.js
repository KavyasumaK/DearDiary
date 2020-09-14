/****************************************
 * Title: form
 * Intial Date: 
 * Summary: Generates login, signup update form based on the path. 
 * Change 1:
 ***************************************/

import React, { useReducer, useCallback } from "react";
import { useLocation, Redirect } from "react-router-dom";

import Classes from "./form.module.css";
import Card from "../../../UI/card/card";
import Buttons from "../../../UI/buttons/buttons";
import InputLabel from "../../../UI/inputFields/inputFields";
import useHTTP from "../../../utils/apiCalls";
// import { myProfile } from "../../../../server/controller/userController";
import MyProfile from "../../myProfile/myProfile";

const formDetails = {
  email: "",
  password: "",
  userName: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "email":
      return { ...state, email: action.val };
    case "password":
      return { ...state, password: action.val };
    case "user Name":
      return { ...state, userName: action.val };
    default:
      break;
  }
};

/*
Default export function
 */
const Form = () => {
  const [state, dispatch] = useReducer(reducer, formDetails);
  const { isLoading, error, sendRequest, data } = useHTTP();

  const currentPath = useLocation().pathname;
  console.log(currentPath);
  let elements = ["email", "password"];
  if (currentPath === "/signup") elements.unshift("user Name");

  const httpCallHandler = useCallback(
    (body) => {
      const newBody =
        currentPath === "login"
          ? { email: body.email, password: body.password }
          : { ...body };
      sendRequest(
        `http://localhost:1337/api/v1/users${currentPath}`,
        "POST",
        newBody
      );
    },
    [sendRequest, currentPath]
  );

  const SubmitEventHandler = (event) => {
    event.preventDefault();
    httpCallHandler({ ...state });
  };

  const formInputs = elements.map((el) => (
    <InputLabel
      key={el}
      value={state.el}
      changed={(evt) => dispatch({ type: el, val: evt.currentTarget.value })}
      inputType={el}
      labelName={el}
      require={true}
    />
  ));

  let formDets = "";
  let errorMessage = "";
  if (isLoading) formDets = <div>Loading...</div>;
  if (error) errorMessage = error;
  if(!error&&data) {return <Redirect to='/myprofile' component={MyProfile}/>;}
  formDets = (
    <form
      className={Classes.Login}
      onSubmit={(event) => SubmitEventHandler(event)}
    >
      {formInputs}
      <Buttons title={"Submit"} styleType={"Red"}></Buttons>
      {/* TBD: forgot password logic for signup*/}
      {(() => {
        if (currentPath === "/login")
          return (
            <div style={{ fontSize: "1rem", marginTop: "1rem" }}>
              Forgot password //TBD//
            </div>
          );
      })()}
    </form>
  );

  return <Card cardContent={formDets} message={errorMessage}></Card>;
};

export default Form;
