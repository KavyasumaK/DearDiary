import React, { useCallback, useMemo } from "react";

import Classes from "./requests.module.css";
import defaultUser from "../../../assets/images/DefaultUser.png";
import useHTTP from "../../../utils/apiCalls";
import LoadingIndicator from "../../../UI/loading/LoadingIndicator";
import SmallCard from "../../../UI/smallCard/smallCard";

const Requests = () => {
  const { data, error, isLoading, sendRequest } = useHTTP(); 
  let notifications = "";

  useMemo(() => {
    sendRequest("/friends/getnotifications");
  }, [sendRequest]);

  const rescindRequest = useCallback((email, type)=>{
    sendRequest('/friends/rescindrequest','POST',{email,type})
  },[sendRequest]);

  const addFriend = useCallback((email)=>{
    sendRequest('/friends/acceptfriendrequest','POST',{email})
  }, [sendRequest]);

  if (isLoading) notifications = <LoadingIndicator />;
  if (error)
    notifications = (
      <div>Oops something went wrong. Please try again later</div>
    );

  if (data) {
    let requestNotifications = <div>No new received requests</div>;
    let sentNotifications = <div>No sent requests</div>;

    if (data.receivedRequests) {
      requestNotifications = data.receivedRequests.map((request) => {
        return (
          <SmallCard
            key={request._id}
            userPicture={defaultUser}
            userName={request.userName}
            aboutMe={request.aboutMe}
            title={"✖"}
            special={true}
            clicked={()=>rescindRequest(request.email, 'received')}            
            addClicked = {()=>addFriend(request.email)}
          />
        );
      });
    }
    if (data.sentRequests) {
      sentNotifications = data.sentRequests.map((request) => {
        return (
          <SmallCard
            key={request._id}
            userPicture={defaultUser}
            userName={request.userName}
            aboutMe={request.aboutMe}
            title={"✖"}
            clicked={()=>rescindRequest(request.email, 'sent')}
          />
        );
      });
    }
    notifications = (
      <>
      <div>
        <h3>Received Requests</h3>
        {requestNotifications}
      </div>
      <div>
        <h3>Sent Requests</h3>
        {sentNotifications}
      </div>
      </>
    );
  }
  return <div className={Classes.Requests}>{notifications}</div>;
};

export default Requests;
