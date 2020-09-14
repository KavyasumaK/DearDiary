/****************************************
 * Title: navbar
 * Intial Date: 
 * Summary: Navbar, changes according to the page you are on.
 * Change 1:
 ***************************************/
import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import useHttp from "../../utils/apiCalls";

import Classes from "./navBar.module.css";
import Logo from "../../assets/images/Logo_Red.svg";
import NavigationItems from "../navigationItems/navigationItems";
import SideDrawer from '../sideDrawer/sideDrawer';

const NavBar = React.memo(() => {

  const { data, sendRequest } = useHttp();
  const [menuShowState, setmenuShowState] = useState(false);
  let menuItems = null;
  let greetingItems = null;
  let navigationModal = null;
  let sideDrawer=null;

  useMemo(() => {
    //Getting the user profile from db
    sendRequest(`http://localhost:1337/api/v1/users/getme`, "GET");
  }, [sendRequest]);

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
    if (data) {
      userName = data.user.userName;
    }
    greetingItems = (
      <div className={Classes.GreetingItems}>Hello, {userName}</div>
    );
    menuItems = (
      <div
        className={Classes.NavIcon}
        onClick={() => setmenuShowState(!menuShowState)}
      >
        <div></div>
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

  console.log("from navbar");
  return (
    <div className={navBarClasses.join(" ")}>
      <Link to="/">
        <img src={Logo} alt="Dear Diary" className={Classes.Logo}></img>
      </Link>
      {greetingItems}
      <div>
        {menuItems}        
        {navigationModal}
        {sideDrawer}
      </div>
    </div>
  );
});

export default NavBar;
