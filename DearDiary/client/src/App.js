import React from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import Landing from "./containers/landing/landing";
import Form from "./containers/form/form";
import NotFound from "./containers/notFoundPage/notFound";
import MyProfile from './containers/myProfile/myProfile';
import passwordUpdate from "./containers/passwordUpdate/passwordUpdate";

const App = () => {
  return (
    <div>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route exact path="/login" component={Form} />
          <Route exact path="/signup" component={Form} />
          <Route exact path="/myprofile" component={MyProfile}/>
          <Route exact path="/updatepassword" component={passwordUpdate}/>
          <Route exact path='*' component={NotFound}/>
        </Switch>
    </div>
  );
};

export default withRouter(App);
