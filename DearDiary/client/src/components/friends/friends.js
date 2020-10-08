import React from "react";

import FriendList from "./friendList/friendList";
import Search from "./search/search";

const friends = () => {
  return (
    <>
      <Search />
      <FriendList />
    </>
  );
};

export default friends;
