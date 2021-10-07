import React from 'react';
import {
  MemoryRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';
import Diff from './Diff';

interface DiffRouteProps{
  snapshot: Record<string, {
    name?: string;
    componentData?: Record <string, unknown>;
    state?: string | unknown
    stateSnaphot?: Record<string, unknown>;
    children?: unknown[];
    atomSelectors?:object;
    atomsComponents?:object
  }>;
}

const DiffRoute = (props: DiffRouteProps): JSX.Element => (

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
      <Route path="/diffRaw" render={() => <Diff snapshot={props.snapshot} show />} />
      <Route path="/" render={() => <Diff snapshot={props.snapshot} show={false} />} />
    </Switch>
  </Router>
);

export default DiffRoute;
