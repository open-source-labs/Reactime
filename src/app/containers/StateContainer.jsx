import React, { Component } from 'react';
import {
  MemoryRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';
import Tree from '../components/Tree';
import Chart from '../components/Chart';

class StateContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { snapshot } = this.props;
    return (
      <Router>
        <div className="state-container">
          <div className="navbar">
            <NavLink className="router-link" activeClassName="is-active" exact to="/">
              Tree
            </NavLink>
            <NavLink className="router-link" activeClassName="is-active" exact to="/chart">
              Chart
            </NavLink>
          </div>
          <Switch>
            <Route path="/chart" render={() => <Chart snapshot={snapshot} />} />
            <Route path="/" render={() => <Tree snapshot={snapshot} />} />
          </Switch>
        </div>
      </Router>
    );
  }
}
{
}

export default StateContainer;
