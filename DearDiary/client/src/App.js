import React from "react";
import { Switch, Route, withRouter,Redirect } from "react-router-dom";

import Landing from "./components/landing/landing";
import Form from "./components/auth/form/form";
import NotFound from "./components/notFoundPage/notFound";
import MyProfile from './components/myProfile/myProfile';
// import passwordUpdate from "./components/passwordUpdate/passwordUpdate";
import Logout from './components/auth/logout/logout';
import NavBar from "./components/navBar/navBar";
import MyHome from "./components/myHome/myHome";

const App = () => {
  return (
    <>
    <NavBar/>  
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Form} />
          <Route exact path="/signup" component={Form} />
          {/* TBD: Protected Routes */}
          <Route exact path="/myhome" component={MyHome}></Route>
          <Route exact path="/myprofile" component={MyProfile}/>
          {/* <Route exact path="/updatepassword" component={passwordUpdate}/> */}
          <Route exact path="/logout" component={Logout}/>
          <Route exact path='/notfound' component={NotFound}/>
          <Redirect to="/notfound" />
        </Switch>
    </>
  );
};

export default withRouter(App);
