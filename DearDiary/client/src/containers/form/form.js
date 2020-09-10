import React, { useReducer } from "react";
import { useLocation } from "react-router-dom";

import Classes from "./form.module.css";
import Card from "../../components/card/card";
import Buttons from "../../components/buttons/buttons";
import InputLabel from "../../components/inputFields/inputFields";

const formDetails = {
  email: "",
  password: "",
};
const reducer = (state, action) => {
  switch (action.type) {
    case "email":
      return { ...state, email: action.val };
    case "password":
      return { ...state, password: action.val };
    case "user Name":
      return { ...state, password: action.val };
    default:
      break;
  }
};

const Login = () => {
  const [state, dispatch] = useReducer(reducer, formDetails);

  const currentPath = useLocation().pathname;
  console.log(currentPath);
  let elements = ["email", "password"];
  if (currentPath === "/signup") elements.unshift("user Name");

  const loginHandler=()=>{}

  const signupHandler=()=>{}

  const submitEventHandler = (event) => {
    event.preventDefault();
    if(currentPath==='/signup') signupHandler();
    else loginHandler();
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

  let formDets = (
    <form className={Classes.Login} onSubmit={(event)=>submitEventHandler(event)}>
      {formInputs}
      <Buttons title={"Submit"} styleType={"Red"}></Buttons>
      {/* TBD: forgot password logic */}
      {(()=>{if(currentPath==='/login')return <div style={{fontSize:'1rem',marginTop:'1rem'}}>Forgot password</div>})()}
    </form>
  );

  return <Card formDets={formDets}></Card>;
};

export default Login;
