import React, { useCallback, useContext, useMemo, useState } from "react";

import EditableComments from "./editableComments/editableComments";
import LoadingIndicator from "../../../UI/loading/LoadingIndicator";
import Classes from "./allCommentsForEntry.module.css";
import useHTTP from "../../../utils/apiCalls";
import { userContext } from "../../../utils/userContext";

const AllCommentsForEntry = React.memo((props) => {
  let { data, isLoading, error, sendRequest } = useHTTP();
  // const [inputState, setInputState] = useState(false);
  const [commentState, setCommentState] = useState("");
  const getuserContext = useContext(userContext);

  const [editCommentState, setEditCommentState] = useState([]);
  let allComments = "";

  useMemo(() => {
    sendRequest("/comment/getcomments", "POST", { entryID: props.entryID });
  }, [sendRequest, props]);

  const deleteComment = useCallback(
    (ID) => {
      sendRequest("/comment/deletecomment", "DELETE", {
        commentID: ID,
        //Required for getComments method in commentController of server.
        entryID: props.entryID,
      });
    },
    [sendRequest, props]
  );

  const updateComment = useCallback(
    (ID) => {
      sendRequest("/comment/updatecomment", "PATCH", {
        commentID: ID,
        comment: commentState,
        //Required for getComments method in commentController of server.
        entryID: props.entryID,
      });
    },
    [sendRequest, commentState, props]
  );

  const toggleExpansion = (ID) => {
    setEditCommentState((editCommentState) => ({
      ...editCommentState,
      settings: editCommentState.settings.map((item) =>
        item.id === ID ? { ...item, open: !item.open } : item
      ),
    }));
  };

  //Inital setting of state only when the data becomes available from the API call.
  useMemo(() => {
    let newEntryArray = [];
    if (data && data.allComments) {
      data.allComments.forEach((element) => {
        newEntryArray.push({ id: element._id, open: false });
      });
    }
    setEditCommentState({ settings: newEntryArray });
  }, [data]);

  if (data && data.allComments) {
    allComments = data.allComments.map((comment) => {
      return (
        <div key={comment._id} className={Classes.AllCommentsForEntry}>
          <div className={Classes.UserName}>
            {comment.userID[0].userName}
            {": "}
          </div>
          <div className={Classes.UserComment}>{comment.comment}</div>
          {getuserContext.contextUser ? (
            getuserContext.contextUser._id === comment.userID[0]._id ? (
              <EditableComments
                comment={comment}
                changeCommentState={setCommentState}
                editCommentState={editCommentState}
                deleteComment={deleteComment}
                updateComment={updateComment}
                toggleExpansion={toggleExpansion}
                commentText={commentState}
              />
            ) : (
              ""
            )
          ) : (
            ""
          )}
        </div>
      );
    });
  }
  if (isLoading) allComments = <LoadingIndicator />;
  if (error) console.log("error");
  return <>{allComments}</>;
});

export default AllCommentsForEntry;
