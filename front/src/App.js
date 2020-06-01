import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
// import ApplicationMain from "./App/App.Main";
import ApplicationMain from "./App/App_Main";
import HeroMain from "./Hero/Hero.Main";
import 'rc-time-picker/assets/index.css';
import 'react-datepicker/dist/react-datepicker.css';


function App() {
  return (
    <React.Fragment>
      <Router>
        <Route path="/app" component={ApplicationMain} />
        <Route path="/" exact component={HeroMain} />
      </Router>
    </React.Fragment>
  );
}

export default App;
