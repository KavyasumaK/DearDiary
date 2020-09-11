import React, { useMemo, useReducer, useCallback } from "react";
import {Redirect} from "react-router-dom";

import Classes from "./myProfile.module.css";
import useHttp from "../../utils/apiCalls";
import LoadingIndicator from "../../components/loading/LoadingIndicator";
import ProfileComponent from "../../components/profileComponent/profileComponent";
import Buttons from "../../components/buttons/buttons";
import ErrorModal from "../errorModal/errorModal";

let initialState = {
  userName: "",
  email: "",
  aboutMe: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return {
        ...state,
        userName: action.userName,
        email: action.email,
        aboutMe: action.aboutMe,
      };
    case "NAME":
      return {
        ...state,
        userName: action.val,
      };
    case "EMAIL":
      return {
        ...state,
        email: action.val,
      };
    case "ABOUT":
      return {
        ...state,
        aboutMe: action.val,
      };
    default:
      break;
  }
};

const MyProfile = () => {
  const { isLoading, data, error, sendRequest } = useHttp();
  const [state, dispatch] = useReducer(reducer, initialState);

  //To avoid infinite rerenders.
  useMemo(() => {
    sendRequest(`http://localhost:1337/api/v1/users/getme`, "GET");
  }, [sendRequest]);

  useMemo(() => {
    if (data)
      dispatch({
        type: "SET",
        userName: data.user.userName,
        email: data.user.email,
        aboutMe: data.user.aboutMe,
      });
  }, [data]);

  const updateDetails = useCallback(()=>{
    sendRequest(`http://localhost:1337/api/v1/users/updateme`, "PATCH",state);
  },[sendRequest,state]);

  let profileDet = "";
  profileDet = useMemo(()=>{return(
    <div className={Classes.MyProfile}>
      <ProfileComponent
        title={"User Name"}
        changed={(evt) =>
          dispatch({ type: "NAME", val: evt.currentTarget.value })
        }
        type={"text"}
        isRequired={true}
        minLength={3}
        value={state.userName||''}
      />
      <ProfileComponent
        title={"Email"}
        changed={(evt) =>
          dispatch({ type: "EMAIL", val: evt.currentTarget.value })
        }
        type={"email"}
        isRequired={true}
        value={state.email||''}
      />
      <ProfileComponent
        title={"Line about me"}
        changed={(evt) =>
          dispatch({ type: "ABOUT", val: evt.currentTarget.value })
        }
        type={"textarea"}
        value={state.aboutMe||''}
      />
      <Buttons updateHandler={updateDetails} title={'Update'} styleType={"Yellow"}></Buttons>
    </div>
  );},[state, updateDetails]);
  
  console.log(data);
  if (error) profileDet = <ErrorModal show={true}/>
  if (isLoading) profileDet = <LoadingIndicator />;

  return (
    <>
      {profileDet}
    </>
  );
};

export default MyProfile;
