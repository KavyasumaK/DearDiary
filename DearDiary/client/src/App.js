import React from "react";
import {BrowserRouter, Switch, Route} from "react-router-dom";

import Landing from "./containers/landing/landing";
import form from "./containers/form/form";

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing}/>
        <Route path="/login" component={form}/>
        <Route path="/signup" component={form}/>
      </Switch>
      </BrowserRouter> 
    </div>
  );
};

export default App;
