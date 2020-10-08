import React from "react";

import Classes from "./showEntries.module.css";
import PrivacyIcons from "../../../UI/privacyIcons/privacyIcons";
import Edit_red from "../../../assets/images/Edit_red.svg";

const GetEntries = (props) => {
  const { settings } = props.myEntriesState;
  if (props.data && props.data.myEntries.length <= 0) {
    return <div style={{ color: "#FF5E5B" }}>No Entries found :(</div>;
  } else if (props.data && settings) {
    return props.data.myEntries.map((el) => {
      return (
        <div key={el._id}>
          <div
            className={Classes.CollapseController}
            onClick={() => props.clicked(el._id)}
          >
            <div>
              {el.createdAt
                ? new Date(el.createdAt).toDateString()
                : new Date(el.created_at).toDateString()}
            </div>
            <PrivacyIcons privacy={el.privacy} />
          </div>
          <div
            className={
              settings.find((item) => item.id === el._id).open
                ? Classes.HideCollapsibleDIV
                : Classes.CollapsibleDIV
            }
          >
            <img
              alt={"Edit"}
              src={Edit_red}
              className={Classes.EditIconSize}
              onClick={() => props.updateClicked(el)}
            />
            <div>Dear {el.dear},</div>
            <br />
            <div className={Classes.toRetainWhiteSpace}>{el.entry}</div>
            <div className={Classes.LastUpdateText}>
              Last updated on:
              {el.updatedAt
                ? new Date(el.updatedAt).toDateString()
                : new Date(el.updated_at).toDateString()}
            </div>
          </div>
        </div>
      );
    });
  }
  return null;
};

export default GetEntries;
