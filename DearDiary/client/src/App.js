import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Landing from "./containers/landing/landing";
import Form from "./containers/form/form";
import NotFound from "./containers/notFoundPage/notFound";
import MyProfile from './containers/myProfile/myProfile';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route path="/login" component={Form} />
          <Route path="/signup" component={Form} />
          <Route Path="/myprofile" component={MyProfile}/>
          <Route component={NotFound}></Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default App;
