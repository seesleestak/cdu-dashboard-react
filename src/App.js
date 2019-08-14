import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Frame from "components/Frame";

import Index from "routes/index";
import Todo from "routes/Todo";
import Weather from "routes/Weather";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Frame>
          <Route path="/" exact component={Index} />
          <Route path="/todo" exact component={Todo} />
          <Route path="/weather" exact component={Weather} />
        </Frame>
      </Router>
    </div>
  );
}

export default App;
