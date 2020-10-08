import React from "react";

import Classes from "./smallCard.module.css";
import Buttons from "../buttons/buttons";

const smallCard = (props) => {
  return (
    <div className={Classes.SmallCard}>
      <img
        src={props.userPicture}
        alt={"Default user"}
        className={Classes.UserPicture}
      ></img>
      <div>
        <div className={Classes.FlexItems}>
          <div className={Classes.UserName}>{props.userName}</div>
          <div>
          {props.special?<Buttons title={'✔'} styleType={"smallCard"} customClickHandler={props.addClicked}/>:''}
          <Buttons title={props.title} styleType={"smallCard"} customClickHandler={props.clicked}/>
          </div>
        </div>
        <div className={Classes.AboutMe}>{props.aboutMe}</div>
      </div>
    </div>
  );
};

export default smallCard;
