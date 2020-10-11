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
import Classes from "./myProfile.module.css";

let initialState = {
  userName: "",
  email: "",
  aboutMe: "",
  picture: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET":
      return {
        ...state,
        userName: action.userName,
        email: action.email,
        aboutMe: action.aboutMe,
        picture: action.picture,
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
    case "PICTURE":
      return {
        ...state,
        picture: action.val,
      };
    default:
      break;
  }
};

const MyProfile = React.memo(() => {
  const { isLoading, data, error, sendRequest } = useHttp();
  const [state, dispatch] = useReducer(reducer, initialState);
  let profileDet = "";
  // let previewPhoto="";
  const getuserContext = useContext(userContext);

  //If we have data from db
  useMemo(() => {
    if (getuserContext.contextUser)
      dispatch({
        type: "SET",
        userName: getuserContext.contextUser.userName,
        email: getuserContext.contextUser.email,
        aboutMe: getuserContext.contextUser.aboutMe,
        picture: "",
      });
  }, [getuserContext.contextUser]);

  const updateDetails = useCallback(
    (event) => {
      event.preventDefault();
      console.log("file", state.picture);
      const form = new FormData();
      var imageData = document.querySelector('input[type="file"]').files[0];
      form.append("picture", imageData);
      form.append("userName", state.userName);
      form.append("email", state.email);
      form.append("aboutMe", state.aboutMe);
      sendRequest(`/users/updateme`, "PATCH", form);
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
            dispatch({ type: "USER NAME", val: evt.currentTarget.files[0] })
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

        <div className={Classes.ImageCombo}>
          <img
            className={Classes.EditPhoto}
            src={
              state.picture
                ? state.picture
                : `${process.env.REACT_APP_SERVER_USERPICTURE}/${getuserContext.contextUser.profilePicture}`
            }
            alt={"user"}
          ></img>
          <label htmlFor={"uploadPicture"} className={Classes.UploadLabel}>
            Edit photo{"..."}
            <input
              id={"uploadPicture"}
              type="file"
              accept="image/*"
              onChange={(evt) =>
                dispatch({
                  type: "PICTURE",
                  val: URL.createObjectURL(evt.currentTarget.files[0]),
                })
              }
              className={Classes.uploadInput}
            ></input>
          </label>
        </div>
        <div />
        <Buttons title={"Update"} buttonColor={"Yellow"}></Buttons>
      </form>
    );
  }, [state, updateDetails, getuserContext.contextUser.profilePicture]);

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
        <userContext.Provider>
          {error ? (
            <div style={{ color: "#FF5E5B", marginTop: "4rem" }}>{error}</div>
          ) : (
            ""
          )}
          <Card
            cardContent={profileDet}
            ForProfile={true}
            cardTitle={"My Profile"}
          ></Card>
          <PasswordUpdate />
        </userContext.Provider>
      </>
    );
});

export default MyProfile;
