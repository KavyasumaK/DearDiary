import React, { useMemo, useReducer, useCallback } from "react";

import useHttp from "../../utils/apiCalls";
import LoadingIndicator from "../../components/loading/LoadingIndicator";
import InputFields from "../../components/inputFields/inputFields";
import Buttons from "../../components/buttons/buttons";
import ErrorModal from "../errorModal/errorModal";
import Card from '../../components/card/card';

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

  //To avoid infinite rerenders.
  useMemo(() => {
    console.log('making the db call');
    //Getting the user profile from db
    sendRequest(`http://localhost:1337/api/v1/users/getme`, "GET");
  }, [sendRequest]);

  //If we have data from db
  useMemo(() => {
    if (data)
      dispatch({
        type: "SET",
        userName: data.user.userName,
        email: data.user.email,
        aboutMe: data.user.aboutMe,
      });
  }, [data]);

  const updateDetails = useCallback(() => {
    sendRequest(`http://localhost:1337/api/v1/users/updateme`, "PATCH", state);
  }, [sendRequest, state]);



  profileDet = useMemo(() => {
    return (
      <>
        <InputFields
          labelName={"User Name"}
          inputType={"user Name"}
          require={true}
          value={state.userName || ""}
          changed={(evt) =>
            dispatch({ type: "NAME", val: evt.currentTarget.value })
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
          labelName={"About Me"}
          inputType={"About Me"}
          value={state.aboutMe || ""}
          changed={(evt) =>
            dispatch({ type: "ABOUT", val: evt.currentTarget.value })
          }
          styling={"myProfile"}
        ></InputFields>

        <Buttons
          updateHandler={updateDetails}
          title={"Update"}
          styleType={"Yellow"}
        ></Buttons>
      </>
    );
  }, [state, updateDetails]);

  console.log(data);
  // if(!data) profileDet='';
  if(error) console.log(error);
  if (isLoading) profileDet = <LoadingIndicator />;

  return (
    <>
      <ErrorModal show={error ? true : false} />
      <Card cardContent={profileDet} ForProfile={true}></Card>
    </>
  );
});

export default MyProfile;
