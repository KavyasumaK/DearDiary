import React from "react";

import Classes from './editableComments.module.css';
import Buttons from "../../../../UI/buttons/buttons";

const editableComments = (props) => {
  let comment = props.comment;
  const editCommentState = props.editCommentState

  const checkItemState = (ID) => {
      if(editCommentState.settings){
        if(editCommentState.settings.find((item) => item.id === ID).open) return true
      }
    };
   return( <>
    <textarea
      className={
        !checkItemState(comment._id)
          ? Classes.Hide
          : Classes.EditComment
      }
      value={props.commentText}
      onChange={(evt) => props.changeCommentState(evt.target.value)}
    />
    <Buttons
      hide={!checkItemState(comment._id)}
      styleType={"Comment"}
      buttonColor={"Green"}
      title={"Update"}
      customClickHandler={() => {
        props.updateComment(comment._id);
        props.toggleExpansion(comment._id);
      }}
    />
    <Buttons
      title={"Cancel"}
      hide={!checkItemState(comment._id)}
      styleType={"Comment"}
      buttonColor={"Yellow"}
      customClickHandler={() => {
        props.toggleExpansion(comment._id);
      }}
    />

    <Buttons
      title={"Edit"}
      hide={checkItemState(comment._id)}
      styleType={"Comment"}
      buttonColor={"Green"}
      customClickHandler={() => {
        props.toggleExpansion(comment._id);
        props.changeCommentState(comment.comment);
      }}
    />
    <Buttons
      title={"Delete"}
      hide={checkItemState(comment._id)}
      styleType={"Comment"}
      buttonColor={"Red"}
      customClickHandler={() => {
        props.deleteComment(comment._id);
      }}
    />
  </>
  )
};

export default editableComments;
