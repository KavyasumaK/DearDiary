/****************************************
 * Title: apiCalls
 * Intial Date:
 * Summary: Implementing custom hooks for all http calls for the backend.
 * Change 1:
 ***************************************/

import { useReducer, useCallback } from "react";
import Axios from "axios";

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (currHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
      case 'RESPONSE':
        return {
          ...currHttpState,
          loading: false,
          data: action.responseData,
          extra: action.extra
        };
      case 'ERROR':
        return { loading: false, error: action.errorMessage };
      case 'CLEAR':
        return initialState;
      default:
        throw new Error('Should not be reached!');
    }
};

const useHTTP = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);
  const clear = useCallback(()=>dispatchHttp({type:'CLEAR'}),[]);

  const sendRequest = useCallback(async (url, method, body, reqExtra, reqIdentifer) => {
    dispatchHttp({type:'SEND'})
    try {
      const response = await Axios({
        method: method,
        url: `${process.env.REACT_APP_SERVER_API}${url}`,
        data: body,
        withCredentials:true,
        headers: reqExtra
      });
      if(url!=='/users/logout') dispatchHttp({type:'RESPONSE', responseData: response, extra: reqExtra})
    } catch (err) {
      console.log('error', err.response);
      let errorMsg =''
      if(err.response) errorMsg = err.response.data.message;
      else errorMsg = 'Oops! something went wrong... 😥';
      dispatchHttp({type:'ERROR', errorMessage:errorMsg});
    }
  }
  , []);


  return {
    isLoading: httpState.loading,
    data: httpState.data?httpState.data.data:httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear
  }
};



export default useHTTP;
