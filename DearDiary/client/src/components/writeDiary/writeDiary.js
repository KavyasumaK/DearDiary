import React, { useCallback, useContext, useReducer } from "react";
import { Redirect } from "react-router-dom";

import useHTTP from "../../utils/apiCalls";
import Classes from "./writeDiary.module.css";
import Buttons from "../../UI/buttons/buttons";
import LoadingIndicator from "../../UI/loading/LoadingIndicator";
import PrivacyIcons from "../../UI/privacyIcons/privacyIcons";
import { userContext } from "../../utils/userContext";

let intialState = {
  privateChecked: true,
  shareChecked: false,
  dear: "",
  diaryEntry: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "privateClicked":
      return { ...state, privateChecked: true, shareChecked: false };
    case "shareClicked":
      return { ...state, privateChecked: false, shareChecked: true };
    case "dearChanged":
      return { ...state, dear: action.value };
    case "diaryEntryChanged":
      return { ...state, diaryEntry: action.value };
    default:
      break;
  }
};

const WriteDiary = () => {
  const [state, dispatch] = useReducer(reducer, intialState);
  const { sendRequest, error, data, isLoading } = useHTTP();
  const getuserContext = useContext(userContext);
  let errorMessage = "";
  const diaryEntrySubmitHandler = useCallback(
    (event) => {
      event.preventDefault();
      const dear = state.dear?state.dear:undefined;
      const entry = state.diaryEntry;
      const privacy = state.privateChecked ? "private" : "share";
      sendRequest(`/diaryentry/makeentry`, "POST", {
        dear,
        entry,
        privacy,
      });
    },
    [sendRequest, state]
  );
  if (data) {
    return <Redirect to="/myhome" />;
  }
  if (error) {
    errorMessage = error;
  }
  if (isLoading) {
    return <LoadingIndicator />;
  }
  if (
    !getuserContext.contextUser &&
    getuserContext.contextError &&
    !getuserContext.isLoading
  ) {
    return <Redirect to="/" />;
  } else {
    return (
      <>
        <form
          className={Classes.WriteDiary}
          onSubmit={(evt) => diaryEntrySubmitHandler(evt)}
        >
          <div className={Classes.ErrorMessage}>{errorMessage}</div>
          <div className={Classes.Paraphernalia}>
            <label>
              Dear{""}
              <input
                type={"text"}
                placeholder="Diary"
                value={state.dear}
                onChange={(evt) =>
                  dispatch({ type: "dearChanged", value: evt.target.value })
                }
              />,
            </label>
            <div
              onClick={() => {
                state.privateChecked
                  ? dispatch({ type: "shareClicked" })
                  : dispatch({ type: "privateClicked" });
              }}
            >
              <PrivacyIcons privacy={state.privateChecked?'private':'shared'}/>
            </div>
          </div>
          <textarea
            className={Classes.DiaryEntry}
            value={state.diaryEntry}
            onChange={(evt) =>
              dispatch({ type: "diaryEntryChanged", value: evt.target.value })
            }
          />
          <Buttons title="Enter" buttonColor={"Green"} />
        </form>
      </>
    );
  }
};

export default WriteDiary;
