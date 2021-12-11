import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";
import Data from "./pages/Data";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Main from "./components/layout/Main";
import Profile from "./pages/Profile";
import Record from "./pages/Record";
import AllRecords from "./pages/AllRecords";
import "antd/dist/antd.css";
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import ProtectedRoutes from "./utils/ProtectedRoutes";
function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/sign-up" exact component={SignUp} />
        <Route path="/sign-in" exact component={SignIn} />
        {/* <Route path="/" exact component={<ProtectedRoutes Cmp={Data} />} /> */}

        <Main>
          <Redirect strict from="/" to="/home" />
          <Route path="/profile">
            <ProtectedRoutes Cmp={Profile} />
          </Route>
          <Route path="/record">
            <ProtectedRoutes Cmp={Record} />
          </Route>
          <Route path="/allRecords">
            <ProtectedRoutes Cmp={AllRecords} />
          </Route>
          <Route path="/home">
            <ProtectedRoutes Cmp={Data} />
          </Route>
        </Main>
      </Switch>
    </div>
  );
}

export default App;
