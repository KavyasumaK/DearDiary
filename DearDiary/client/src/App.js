import React, { useContext } from "react";
import { Switch, Route, withRouter,Redirect } from "react-router-dom";


import Landing from "./components/landing/landing";
import Form from "./components/auth/form/form";
import NotFound from "./components/notFoundPage/notFound";
import MyProfile from './components/myProfile/myProfile';
import Logout from './components/auth/logout/logout';
import NavBar from "./components/navBar/navBar";
import MyHome from "./components/myHome/myHome";
import WriteDiary from "./components/writeDiary/writeDiary";
import Friends from "./components/friends/friends";
import Notifications from "./components/notifications/notifications";
import { userContext } from "./utils/userContext";
import ReadEntries from "./components/readEntries/readEntries";

const App = () => {
  const getuserContext = useContext(userContext);
  getuserContext.getMe();

  return (
    <>
    <NavBar/>  
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Form} />
          <Route exact path="/signup" component={Form} />
          {/* TBD: Protected Routes */}
          <Route exact path="/myhome" component={MyHome}/>
          <Route exact path="/myprofile" component={MyProfile}/>
          <Route exact path="/writediary" component={WriteDiary}/>
          <Route exact path="/readmyentries" component={ReadEntries}/>
          <Route exact path="/friends" component={Friends}/>
          <Route exact path="/notifications" component={Notifications}/>
          <Route exact path="/logout" component={Logout}/>
          <Route exact path='/notfound' component={NotFound}/>
          <Redirect to="/notfound" />
        </Switch>
    </>
  );
};

export default withRouter(App);
