import React from 'react';
import PropTypes from 'prop-types';
import {
  MemoryRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';

import Diff from './Diff.tsx';

const DiffRoute = ({ snapshot }) => (
  <Router>
    <div className="navbar">
      <NavLink className="router-link" activeClassName="is-active" exact to="/">
        Tree
      </NavLink>
      <NavLink className="router-link" activeClassName="is-active" to="/diffRaw">
        Raw
      </NavLink>
    </div>
    <Switch>
      <Route path="/diffRaw" render={() => <Diff snapshot={snapshot} show />} />
      <Route path="/" render={() => <Diff snapshot={snapshot} show={false} />} />
    </Switch>
  </Router>
);

DiffRoute.propTypes = {
  snapshot: PropTypes.shape({
    state: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    children: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default DiffRoute;
