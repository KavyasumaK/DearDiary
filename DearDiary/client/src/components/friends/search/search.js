import React, { useCallback, useState } from "react";
import SmallCard from "../../../UI/smallCard/smallCard";
import useHTTP from "../../../utils/apiCalls";

import Classes from "./search.module.css";

const Search = () => {
  let [searchTerm, setSearchTerm] = useState("");
  let { data, error, isLoading, sendRequest } = useHTTP();
  let searchResult = "";

  const searchFriend = useCallback(() => {
    if (searchTerm.trim().length > 0) {
      sendRequest("/friends/searchforafriend", "POST", {
        friendEmail: searchTerm,
      });
    }
  }, [sendRequest, searchTerm]);

  const sendFriendRequest = useCallback(() => {
    sendRequest("/friends/sendfriendrequest", "POST", {
      friendEmail: data.friendDetails.email,
    });
  }, [sendRequest, data]);

  if (isLoading) {
    searchResult = <div className={Classes.ErrorMessage}>Loading...</div>;
  }
  if (data && data.friendDetails) {
    searchResult = (
      <SmallCard
        key={data.friendDetails._id}
        userName={data.friendDetails.userName}
        aboutMe={data.friendDetails.aboutMe}
        userPicture={data.friendDetails.profilePicture}
        styleType={"SmallCard"}
        btnColor={"Yellow"}
        title={"📨"}
        clicked={() => sendFriendRequest()}
      />
    );
  }
  if (error) {
    searchResult = <div className={Classes.ErrorMessage}>{error}</div>;
  }

  return (
    <div className={Classes.Search}>
      <div>
        <input
          onKeyDown={(evt) => (evt.key === "Enter" ? searchFriend() : "")}
          onChange={(evt) => setSearchTerm(evt.target.value)}
          placeholder={"Search... (by email)"}
        />
        <button onClick={() => searchFriend()} className={Classes.SearchButton}>{"🔍"}</button>
      </div>
      {searchResult}
    </div>
  );
};

export default Search;
