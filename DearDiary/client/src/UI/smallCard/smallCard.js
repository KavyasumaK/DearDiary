import React from "react";

import Classes from "./smallCard.module.css";
import Buttons from "../buttons/buttons";
import { useHistory } from "react-router-dom";
import UserPicture from "../userPicture/userPicture";

const SmallCard = (props) => {
  let history = useHistory();
  return (
    <div className={Classes.SmallCard}>
      <UserPicture userPicture={props.userPicture}/>
      <div>
        <div className={Classes.FlexItems}>
          <div
            className={Classes.UserName}
            onClick={() =>
              props.redirectClicked
                ? history.push({
                    pathname: props.redirectClicked.pathName,
                    state: { email: props.redirectClicked.email }
                })
                : ""
            }
          >
            {props.userName}
          </div>
          <div>
            {props.special ? (
              <Buttons
                title={"✔"}
                styleType={"SmallCard"}
                buttonColor={"Green"}
                customClickHandler={props.addClicked}
              />
            ) : (
              ""
            )}
            <Buttons
              title={props.title}
              styleType={props.styleType}
              buttonColor={props.btnColor}
              customClickHandler={props.clicked}
            />
          </div>
        </div>
        <div className={Classes.AboutMe}>{props.aboutMe}</div>
      </div>
    </div>
  );
};

export default SmallCard;
