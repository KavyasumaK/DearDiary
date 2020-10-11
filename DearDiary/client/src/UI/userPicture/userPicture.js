import React, { useContext } from 'react';

import Classes from "./userPicture.module.css";
import { userContext } from "../../utils/userContext";

const UserPicture = (props)=>{
  const getuserContext = useContext(userContext);
  let profilePicture='DefaultUser.jpg'
  if (getuserContext.contextUser&&getuserContext.contextUser.profilePicture) {
    profilePicture = getuserContext.contextUser.profilePicture;
  }
  let imageClasses = []
  imageClasses.push(props.specialPicture==='navBar'?Classes.NavBarPicture:props.specialPicture==='sideDrawer'?Classes.SideDrawerPicture:Classes.UserPicture);


  return <img
  src={`${process.env.REACT_APP_SERVER_USERPICTURE}/${props.userPicture?props.userPicture:profilePicture}`}
  alt={"user"}
  className={imageClasses.join(' ')}
></img>
}

export default UserPicture;