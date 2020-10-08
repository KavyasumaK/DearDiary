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
      sendRequest(`/users/getme`, "GET");
    }, []);
  };
  useMemo(() => {
    data ? setUser(data.user) : setUser("");
    error ? setError(error) : setError("");
  }, [data, error]);
  //UserContextProvider is used to wrap the entire app in index.js file.
  return (
    <userContext.Provider
      value={{
        getMe: GetMeHandler,
        contextUser,
        contextError,
        isLoading,
        setUser,
        setError,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};

export default UserContextProvider;
