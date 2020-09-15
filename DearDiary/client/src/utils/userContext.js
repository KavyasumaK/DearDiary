import React, { createContext, useEffect, useMemo, useState } from "react";

import useHttp from "./apiCalls";
// import LoadingIndicator from '../UI/loading/LoadingIndicator';

export const userContext = createContext({
  user: "",
  error: "",
  isLoading: "",
  getMe: () => {},
});

const UserContextProvider = (props) => {
  const { data, error, isLoading, sendRequest } = useHttp();
  const [contextUser, setUser] = useState("");
  const [contextError, setError] = useState("");

  const GetMeHandler = () => {
    useEffect(() => {
      sendRequest(`http://localhost:1337/api/v1/users/getme`, "GET");
    }, []);
  };
  useMemo(() => {
    if (data) setUser(data.user);
    if (error) setError(error);
  }, [data, error]);

  return (
    <userContext.Provider
      value={{
        getMe: GetMeHandler,
        contextUser,
        contextError,
        isLoading,
        setUser,
        setError        
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
