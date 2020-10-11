/****************************************
 * Title: sideDrawer
 * Intial Date:
 * Summary: For screens less than 500px, the nav and greetings are implemented as side drawer.
 * Change 1:
 ***************************************/

import React from "react";

import Classes from "./sideDrawer.module.css";
import NavigationItems from "../navigationItems/navigationItems";
import Backdrop from "../../UI/backdrop/backdrop";
import UserPicture from "../../UI/userPicture/userPicture";

//For less than 500px, show userName, picture and nav items in sideDrawer
const sideDrawer = (props) => {
  let attachedClasses = [Classes.SideDrawer, Classes.Close];
  if (props.show) {
    attachedClasses = [Classes.SideDrawer, Classes.Open];
  }
  return (
    <>
      <Backdrop show={props.show} clicked={props.closed} />
      <div className={attachedClasses.join(" ")} onClick={props.closed}>
          <UserPicture/>
        <div className={Classes.Greeting}>
          Hello,{props.name}
        </div>
        <nav>
          <NavigationItems show={props.show} />
        </nav>
      </div>
    </>
  );
};

export default sideDrawer;
