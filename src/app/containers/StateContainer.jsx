import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  MemoryRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';
import StateRoute from '../components/StateRoute';
import DiffRoute from '../components/DiffRoute';


const StateContainer = ({ snapshot }) => {
  const [Text, setText] = useState('State');
  return (
    <Router>
      <div className="state-container">
        <div className="main-navbar-container">
          <div className="main-navbar-text">
            {Text}
          </div>
          <div className="main-navbar">
            <NavLink className="main-router-link" activeClassName="is-active" exact to="/">
              State
            </NavLink>
            <NavLink className="main-router-link" activeClassName="is-active" to="/diff">
              Diff
            </NavLink>
          </div>
        </div>
        <Switch>
          <Route path="/diff" render={() => { setText('Diff'); return <DiffRoute snapshot={snapshot} />; }} />
          <Route path="/" render={() => { setText('State'); return <StateRoute snapshot={snapshot} />; }} />
        </Switch>
      </div>
    </Router>
  );
};

StateContainer.propTypes = {
  snapshot: PropTypes.shape({
    state: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default StateContainer;
