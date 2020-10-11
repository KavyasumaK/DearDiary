import React, { useCallback, useState } from "react";
import Buttons from "../../UI/buttons/buttons";
import LoadingIndicator from "../../UI/loading/LoadingIndicator";
import useHTTP from "../../utils/apiCalls";
import AllComentsForEntry from "./allCommentsForEntry/allCommentsForEntry";
import Classes from "./comments.module.css";

const Comments = (props) => {
  const [commentVal, setCommentVal] = useState("");
  const { data, error, isLoading, sendRequest } = useHTTP();
  const [short, setShort] = useState(false);

  const insertComment = useCallback(() => {
    sendRequest("/comment/insertcomment", "POST", {
      entryID: props.entryID,
      comment: commentVal,
    });
    setCommentVal("");
  }, [sendRequest, commentVal, props]);

  const toggleComments = () => {
    setShort(!short);
  };

  let primaryComment = (
    <div className={Classes.Comments}>
      <input
        className={Classes.PrimaryCommentInput}
        onKeyDown={(evt) => (evt.key === "Enter" ? insertComment() : "")}
        value={commentVal}
        onChange={(evt) => {
          setCommentVal(evt.target.value);
        }}
        placeholder={"My thought..."}
      ></input>
      <div className={Classes.ButtonDisplay}>
        <Buttons
          customClickHandler={() => insertComment()}
          title={"Comment"}
          styleType={"Comment"}
          buttonColor={"Green"}
        />
        <Buttons
          customClickHandler={() => {
            setCommentVal("");
          }}
          title={"Cancel"}
          styleType={"Comment"}
          buttonColor={"Yellow"}
        />
      </div>
      {error ? <div style={{color:"#FF5E5B"}}>{error}</div> : ""}
    </div>
  );

  if (isLoading) {
    primaryComment = <LoadingIndicator />;
  }

  return (
    <>
      {primaryComment}
      {/* sending data as props below as the allCommentsForEntry is memoized to prevent rerender when text in primaryComment Input is changed and sending the data as change in data help rerender when comment is posted.*/}
      <div className={short ? "" : Classes.Hide}>
        <AllComentsForEntry entryID={props.entryID} data={data} />
      </div>
      <Buttons
        customClickHandler={() => {
          toggleComments();
        }}
        title={short ? "\u2b99" : "\u2b9b"}
        styleType={"SmallCard"}
        buttonColor={"Green"}
      />
    </>
  );
};

export default Comments;
