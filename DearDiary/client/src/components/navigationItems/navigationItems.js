/****************************************
 * Title: navigationItems
 * Intial Date:
 * Summary: List of items for navLink in NavigationItem
 * Change 1:
 ***************************************/
import React from 'react';

import Classes from './navigationItems.module.css';
import NavigationItem from './navigationItem/navigationItem';

const navigationItems = ( props ) => {
  let navItemClasses = [Classes.NavigationItems];
  if(!props.show) navItemClasses.push(Classes.HideNavigationItems)
 return (
    <ul className={navItemClasses.join(' ')}>
        <NavigationItem link="/myhome" exact>My Home</NavigationItem>
        <NavigationItem link="/myprofile" exact>My Profile</NavigationItem>
        <NavigationItem link="/friends" exact>My Friends</NavigationItem>
        <NavigationItem link="/notifications" exact>My Notifications</NavigationItem>
        <NavigationItem link="/logout" exact>Logout</NavigationItem>
       
    </ul>
)
};

export default navigationItems;