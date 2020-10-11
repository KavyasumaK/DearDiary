/****************************************
 * Title: navbar
 * Intial Date: 
 * Summary: Navbar, changes according to the page you are on.
 * Change 1:
 ***************************************/
import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";


import Classes from "./navBar.module.css";
import Logo from "../../assets/images/Logo_Red.svg";
import NavigationItems from "../navigationItems/navigationItems";
import SideDrawer from '../sideDrawer/sideDrawer';
import { userContext } from "../../utils/userContext";
import UserPicture from "../../UI/userPicture/userPicture";


const NavBar = React.memo(() => {
  const [menuShowState, setmenuShowState] = useState(false); 
  const getuserContext = useContext(userContext);

  let menuItems = null;
  let greetingItems = null;
  let navigationModal = null;
  let sideDrawer=null;
  let homePath='/';

  let currLocation = useLocation().pathname;
  let navBarClasses = [Classes.NavBar];

  //Setting the nav bar content based on the page you are on.
  if (currLocation === "/" || currLocation === "")
    navBarClasses.push(Classes.HideNavBar);
  else if (currLocation === "/signup")
    menuItems = (
      <Link to="/login" className={Classes.MenuItems}>
        Login
      </Link>
    );
  else if (currLocation === "/login")
    menuItems = (
      <Link to="/signup" className={Classes.MenuItems}>
        Signup
      </Link>
    );
  else if (currLocation === "/notfound") menuItems = "";
  else {
    let userName = "";
    if (getuserContext.contextUser) {
      userName = getuserContext.contextUser.userName;
      homePath = '/myhome'
    }
    greetingItems = (
      <div className={Classes.GreetingItems}>Hello, {userName}</div>
    );
    //Hamburger Menu
    menuItems = (
      <div className={Classes.PictureBurger}>
      <UserPicture specialPicture={"navBar"}/>           
      <div
        className={Classes.NavIcon}
        onClick={() => setmenuShowState(!menuShowState)}
        >
        <div></div>
      </div>
        </div>
    );
    navigationModal = (
      <div
        className={Classes.DisplayDesktopOnly}
        onClick={() => setmenuShowState(!menuShowState)}
      >
        <NavigationItems show={menuShowState}/>
      </div>
    );
    sideDrawer=(
      <div
      className={Classes.NonDisplayDesktopOnly}
      onClick={() => setmenuShowState(!menuShowState)}
    >
      <SideDrawer show={menuShowState} name={userName}/>
    </div>
    )
  }

  return (
    <div className={navBarClasses.join(" ")}>
      <Link to={homePath}>
        <img src={Logo} alt="Dear Diary" className={Classes.Logo}></img>
      </Link>
      {greetingItems}
      <div>
        <div className={Classes.PictureBurger}>
        {menuItems}        
        </div>
        {navigationModal}
        {sideDrawer}
      </div>
    </div>
  );
});

export default NavBar;
