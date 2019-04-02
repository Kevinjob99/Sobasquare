import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "./styles.css";

import ListItem from "./components/ListItem";
import ExpandedListItem from "./components/ExpandedListItem";
import Detail from "./components/Detail";

import data from "./data/sobaya.js";

function App() {
  return (
    <Router>
      <div className="App">
        <Route path="/" component={List} />
      </div>
    </Router>
  );
}

class List extends React.Component {
  state = {
    selected: undefined,
    sobayas: data
  };

  handleClick = index => {
    this.setState({
      selected: this.state.selected === index ? null : index
    });
  };

  render() {
    const { sobayas, selected } = this.state;

    return (
      <div>
        <div className="list-container">
          {Object.keys(sobayas).map((sobaya, index) => (
            <div
              index={index}
              key={index}
              onClick={() => this.handleClick(index)}
            >
              {selected === index ? (
                <Route
                  path="/"
                  render={props => (
                    <ExpandedListItem {...props} sobaya={sobayas[sobaya]} />
                  )}
                />
              ) : (
                <Route
                  exact
                  path="/"
                  render={props => <ListItem {...props} sobaya={sobaya} />}
                />
              )}
            </div>
          ))}
          <Route
            path="/:id"
            render={props => <Detail {...props} sobayas={sobayas} />}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
