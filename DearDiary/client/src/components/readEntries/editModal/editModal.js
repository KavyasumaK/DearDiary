import React, { useMemo, useState } from "react";
import CSSTransition from "react-transition-group/CSSTransition";

import Classes from "./editModal.module.css";
import Buttons from "../../../UI/buttons/buttons";
import PrivacyIcons from "../../../UI/privacyIcons/privacyIcons";

const intialState = {
  dear: "",
  entry: "",
  privateChecked: false,
  deleteConfirm: "",
};

const EditModal = (props) => {
  let [intialStateElements, setStateElements] = useState(intialState);
  useMemo(() => {
    if (props.elem) {
      setStateElements({
        dear: props.elem.dear,
        entry: props.elem.entry,
        privateChecked: props.elem.privacy === "private",
        id: props.elem._id,
      });
    }
  }, [props.elem]);

  let editContent = "";

  if (props.elem) {
    editContent = (
      <>
        <div
          onClick={() =>
            setStateElements({
              ...intialStateElements,
              privateChecked: !intialStateElements.privateChecked,
            })
          }
        >
          <PrivacyIcons
            privacy={intialStateElements.privateChecked ? "private" : "share"}
          />
        </div>
        <label>
          Dear{" "}
          <input
            value={intialStateElements.dear}
            onChange={(evt) => {
              setStateElements({
                ...intialStateElements,
                dear: evt.target.value,
              });
            }}
          ></input>{" "}
          ,{" "}
        </label>
        <textarea
          value={intialStateElements.entry}
          onChange={(evt) => {
            setStateElements({
              ...intialStateElements,
              entry: evt.target.value,
            });
          }}
        />
        <Buttons
          title={"Update"}
          styleType={"Green"}
          customClickHandler={() => props.updateEntry(intialStateElements)}
        />
        <label className={Classes.DeleteBox}>
          To delete this diary entry, type delete in the box and press delete
          button{" "}
          <input
            onChange={(evt) =>
              setStateElements({
                ...intialStateElements,
                deleteConfirm: evt.target.value,
              })
            }
          />
          <Buttons
            title={"Delete"}
            styleType={"Red"}
            customClickHandler={() =>
              props.deleteEntry(
                intialStateElements.deleteConfirm,
                intialStateElements.id
              )
            }
          />{" "}
        </label>
      </>
    );
  }

  return (
    <CSSTransition
      mountOnEnter
      unmountOnExit
      in={props.show}
      timeout={1000}
      classNames={{
        enterActive: Classes["fadeslide-enter-active"],
        exitActive: Classes["fadeslide-exit-active"],
      }}
    >
      <div className={Classes.EditModal}>
        <div onClick={props.closeModal} className={Classes.Close}>X</div>       
        {editContent}
        </div>
       
    </CSSTransition>
  );
};

export default EditModal;
