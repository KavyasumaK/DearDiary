/****************************************
 * Title: navigationItem
 * Intial Date:
 * Summary: Individual navlink item to apply styling based on active link and on hover.for the lost coming from navigation items.
 * Change 1:
 ***************************************/

import React from "react";
import { NavLink } from "react-router-dom";

import classes from "./navigationItem.module.css";

const navigationItem = (props) => (
  <li className={classes.NavigationItem}>
    <NavLink
      to={props.link}
      exact={props.exact}
      activeClassName={classes.active}
    >
      {props.children}
    </NavLink>
  </li>
);

export default navigationItem;
