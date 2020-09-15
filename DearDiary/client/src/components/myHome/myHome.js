/****************************************
 * Title: myHome
 * Intial Date:
 * Summary: TBD, Hopem page for logged in user.
 * Change 1:
 ***************************************/

import React, { useContext, useMemo } from "react";

import ErrorModal from "../errorModal/errorModal";
import LoadingIndicator from "../../UI/loading/LoadingIndicator";

import useHTTP from "../../utils/apiCalls";
import Greetings from "./greetings/greetings";
import LastEntry from "./lastEntry/lastEntry";
import Tasks from "./tasks/tasks";
import { userContext } from "../../utils/userContext";
import { Redirect } from "react-router-dom";

const MyHome = () => {
  const { sendRequest, error, data, isLoading } = useHTTP();
  const getuserContext = useContext(userContext);
  let created_at = "";
  let dear = "";
  let entry = "";
  let privacy = "";
  let myHomeDet = "";

  useMemo(() => {
    sendRequest(
      "http://localhost:1337/api/v1/diaryentry/getMyLatestEntry",
      "GET"
    );
  }, [sendRequest]);

  if (data) {
    created_at = new Date(data.latestEntry.created_at).toDateString();
    dear = data.latestEntry.dear;
    entry = data.latestEntry.entry;
    privacy = data.latestEntry.privacy;
  }

  myHomeDet = useMemo(() => {
    return (
      <>
        <Greetings createdAt={created_at} />
        <LastEntry dear={dear} entry={entry} privacy={privacy} />
        <Tasks />
      </>
    );
  }, [created_at, dear, entry, privacy]);

  if (isLoading) myHomeDet = <LoadingIndicator />;

  if (!getuserContext.contextUser&&getuserContext.contextError&&!getuserContext.isLoading) return <Redirect to="/" />;

  else {
    return (
      <div>
        <ErrorModal show={error ? true : false} />
        {myHomeDet}
      </div>
    );
  }
};

export default MyHome;
