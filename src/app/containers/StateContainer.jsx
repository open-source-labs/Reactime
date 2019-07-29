import React, { Component } from 'react';
import { MemoryRouter as Router, Route, NavLink } from 'react-router-dom';
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
            <NavLink className="router-link" activeClassName="is-active" to="/tree">
              Tree
            </NavLink>
            <NavLink className="router-link" activeClassName="is-active" to="/chart">
              Chart
            </NavLink>
          </div>
          <Route path="/tree" render={() => <Tree snapshot={snapshot} />} />
          <Route path="/chart" render={() => <Chart snapshot={snapshot} />} />
        </div>
      </Router>
    );
  }
}
{
}

export default StateContainer;
