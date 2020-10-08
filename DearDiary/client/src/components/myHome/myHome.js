/****************************************
 * Title: myHome
 * Intial Date:
 * Summary: TBD, Hopem page for logged in user.
 * Change 1:
 ***************************************/

import React, { useContext, useMemo } from "react";

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
  let createdAt = "";
  let dear = "";
  let entry = "";
  let privacy = "";
  let myHomeDet = "";
  let myHomeError='';

  useMemo(() => {
    sendRequest("/diaryentry/getMyLatestEntry", "GET");
  }, [sendRequest]);

  if (data) {
    if(data.latestEntry){
      createdAt = ` Welcome back!, Your last entry was on ${new Date(data.latestEntry.createdAt).toDateString()}`;
      dear = `Dear ${data.latestEntry.dear},`;
      entry = data.latestEntry.entry;
      privacy = data.latestEntry.privacy;
    }else{
      createdAt = `Welcome, Your first diary entry can be today!`;
      dear = 'Your latest diary entry will be shown here.';
      entry = `Why wait? let's a start!`
      privacy ='';
    }
  }
if(error) myHomeError = <div style={{padding:'4rem'}}>{error}</div>;

  myHomeDet = useMemo(() => {
    return (
      <>
        <Greetings createdAt={createdAt} />
        <LastEntry dear={dear} entry={entry} privacy={privacy} />
        <Tasks />
      </>
    );
  }, [createdAt, dear, entry, privacy]);

  if (isLoading) myHomeDet = <LoadingIndicator />;

  if (
    !getuserContext.contextUser &&
    getuserContext.contextError &&
    !getuserContext.isLoading
  )
    return <Redirect to="/" />;
  else {
    return (
      <div>
        {myHomeError}
        {myHomeDet}
      </div>
    );
  }
};

export default MyHome;
