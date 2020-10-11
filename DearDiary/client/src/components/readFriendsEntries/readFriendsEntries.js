import React, { useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";

// import FriendEntry from "./friendEntry/friendEntry";
import LoadingIndicator from "../../UI/loading/LoadingIndicator";
import Comments from "../comments/comments";
import useHTTP from "../../utils/apiCalls";
import Classes from "./readFriendsEntries.module.css";
import UserPicture from "../../UI/userPicture/userPicture";

const ReadFriendsEntries = () => {
  const { data, error, isLoading, sendRequest } = useHTTP();
  let friendsDiaryEntries = null;
  const [short, setShort] = useState([]);
  const location = useLocation();
  let history = useHistory();

  useMemo(() => {
    sendRequest("/diaryentry/getfriendsdiaryentry", "GET");
  }, [sendRequest]);

  const toggleShort = (ID) => {
    setShort((short) => ({
      ...short,
      settings: short.settings.map((item) =>
        item.id === ID ? { ...item, open: !item.open } : item
      ),
    }));
  };

  //Inital setting of state only when the data becomes available from the API call.
  useMemo(() => {
    if (data && data.friendsEntries) {
      let newEntryArray = [];
      if (data.friendsEntries) {
        data.friendsEntries.forEach((element) => {
          newEntryArray.push({ id: element._id, open: false });
        });
      }
      setShort({ settings: newEntryArray });
    }
  }, [data]);

  if (isLoading) friendsDiaryEntries = <LoadingIndicator />;
  if (error)
    friendsDiaryEntries = (
      <div className={Classes.Error}>Oops something went wrong :(</div>
    );
  if (data && data.friendsEntries) {
    friendsDiaryEntries = data.friendsEntries.map((entry) => {
      if (
        location.state &&
        location.state.email &&
        location.state.email !== entry.userID[0].email
      )
        return <React.Fragment key={entry._id}></React.Fragment>;
      else {
        return (
          <div key={entry._id} className={Classes.ReadFriendsEntries}>
            <div className={Classes.User}>
              <UserPicture/>
              <div
                className={Classes.UserName}
                onClick={() =>
                  history.push({
                    pathname: "/readfriendsentries",
                    state: { email: entry.userID[0].email },
                  })
                }
              >
                {entry.userID[0].userName}
              </div>
            </div>
            <div className={Classes.DearAndEntry}>
              <div className={Classes.Dear}>Dear {entry.dear},</div>
              <div>
                <div
                  className={
                    short.settings
                      ? short.settings.find((item) => item.id === entry._id)
                          .open
                        ? [Classes.Entry, Classes.ExtendEntry].join(" ")
                        : Classes.Entry
                      : ""
                  }
                >
                  {entry.entry}
                </div>
                <p
                  className={Classes.ReadMore}
                  onClick={() => toggleShort(entry._id)}
                >
                  {short.settings
                    ? short.settings.find((item) => item.id === entry._id).open
                      ? "Read Less... ⬆"
                      : "Read More... ⬇"
                    : ""}
                </p>
              </div>
            </div>
            <Comments entryID={entry._id}/>
          </div>
        );
      }
    });
  }
  if (data && data.friendsEntries.length === 0) {
    friendsDiaryEntries = (
      <div className={Classes.Error}>No Entries from Friends. ;(</div>
    );
  }

  return <>{friendsDiaryEntries}</>;
};

export default ReadFriendsEntries;
