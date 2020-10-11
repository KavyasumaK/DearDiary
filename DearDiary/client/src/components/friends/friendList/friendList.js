import React, { useCallback, useMemo } from "react";

import useHttp from "../../../utils/apiCalls";
import LoadingIndicator from "../../../UI/loading/LoadingIndicator";
import Classes from "./friendList.module.css";
import SmallCard from "../../../UI/smallCard/smallCard";

const FriendList = () => {
  const { data, error, sendRequest, isLoading } = useHttp();
  let friendListCard = "";
  useMemo(() => {
    sendRequest("/friends/getmyfriends");
  }, [sendRequest]);

  const unfriend = useCallback((email)=>{
   sendRequest("/friends/deletefriend", 'DELETE', {email});
  },[sendRequest])

  if (isLoading) friendListCard = <LoadingIndicator />;
  if (error) friendListCard = <div>Oops something went. Try again later</div>;
  if(data&&!data.friends){
    friendListCard = <div>You do not have any friends yet.</div>
  }
  if (data && data.friends) {
    friendListCard = data.friends.map((friend) => {
      return (
          <SmallCard
            key={friend._id}           
            userPicture={friend.profilePicture}
            userName={friend.userName}
            aboutMe={friend.aboutMe}
            title={"✖"}
            styleType={"SmallCard"}
            btnColor={"Red"}
            clicked = {()=>unfriend(friend.email)}
            redirectClicked={ {pathName: `/readfriendsentries`, email:friend.email}}
          />
      );
    });
  }
  return (
    <div className={Classes.FriendList}>
      <h3>My Friends</h3>
      {friendListCard}
    </div>
  );
};

export default FriendList;
