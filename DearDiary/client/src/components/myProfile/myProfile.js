/****************************************
 * Title: myProfile
 * Intial Date:
 * Summary: user can see and update their profile.
 * Change 1:
 ***************************************/

import React, { useMemo, useReducer, useCallback, useContext } from "react";

import useHttp from "../../utils/apiCalls";
import LoadingIndicator from "../../UI/loading/LoadingIndicator";
import InputFields from "../../UI/inputFields/inputFields";
import Buttons from "../../UI/buttons/buttons";
import Card from "../../UI/card/card";
import PasswordUpdate from "./passwordUpdate/passwordUpdate";
import { userContext } from "../../utils/userContext";
import { Redirect } from "react-router-dom";

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
    case "USER NAME":
      return {
        ...state,
        userName: action.val,
      };
    case "EMAIL":
      return {
        ...state,
        email: action.val,
      };
    case "ABOUT ME":
      return {
        ...state,
        aboutMe: action.val,
      };
    default:
      break;
  }
};

const MyProfile = React.memo(() => {
  const { isLoading, data, error, sendRequest } = useHttp();
  const [state, dispatch] = useReducer(reducer, initialState);
  let profileDet = "";
  const getuserContext = useContext(userContext);

  //If we have data from db
  useMemo(() => {
    if (getuserContext.contextUser)
      dispatch({
        type: "SET",
        userName: getuserContext.contextUser.userName,
        email: getuserContext.contextUser.email,
        aboutMe: getuserContext.contextUser.aboutMe,
      });
  }, [getuserContext.contextUser]);

  const updateDetails = useCallback(
    (event) => {
      event.preventDefault();
      sendRequest(`/users/updateme`, "PATCH", state);
    },
    [sendRequest, state]
  );

  if (!error && data) {
    getuserContext.setUser(data.user);
    getuserContext.setError(false);
  }

  profileDet = useMemo(() => {
    return (
      <form onSubmit={(event) => updateDetails(event)}>
        <InputFields
          labelName={"User Name"}
          inputType={"user Name"}
          require={true}
          value={state.userName || ""}
          changed={(evt) =>
            dispatch({ type: "USER NAME", val: evt.currentTarget.value })
          }
          styling={"myProfile"}
        ></InputFields>

        <InputFields
          labelName={"email"}
          inputType={"email"}
          require={true}
          value={state.email || ""}
          changed={(evt) =>
            dispatch({ type: "EMAIL", val: evt.currentTarget.value })
          }
          styling={"myProfile"}
        ></InputFields>

        <InputFields
          labelName={"About me"}
          inputType={"About Me"}
          value={state.aboutMe || ""}
          changed={(evt) =>
            dispatch({ type: "ABOUT ME", val: evt.currentTarget.value })
          }
          styling={"myProfile"}
        ></InputFields>

        <Buttons title={"Update"} styleType={"Yellow"}></Buttons>
      </form>
    );
  }, [state, updateDetails]);

  if (error) console.log(error);
  if (isLoading) profileDet = <LoadingIndicator />;

  if (
    !getuserContext.contextUser &&
    getuserContext.contextError &&
    !getuserContext.isLoading
  )
    return <Redirect to="/" />;
  else
    return (
      <>
        <Card
          cardContent={profileDet}
          ForProfile={true}
          cardTitle={"My Profile"}
        ></Card>
        <PasswordUpdate />
      </>
    );
});

export default MyProfile;
