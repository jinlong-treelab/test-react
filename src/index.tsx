import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, HashRouter } from "react-router-dom";

import IndexPage from "./pages/index/index";
import TempPage from "./pages/tempPage";
import WebWork from "./pages/webWork";

import reportWebVitals from "./reportWebVitals";

import "./index.css";

ReactDOM.render(
  <HashRouter>
    <Switch>
      <Route path={`/`} exact component={IndexPage} />
      <Route path={`/temp`} component={TempPage} />
      <Route path={`/web-work`} component={WebWork} />
    </Switch>
  </HashRouter>,
  document.getElementById("root")
);

reportWebVitals();
