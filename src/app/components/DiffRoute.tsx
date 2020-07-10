import React from 'react';
import {
  MemoryRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';
import Diff from './Diff';


const DiffRoute = (props: {snapshot: { name?: string; componentData?: object; state?: string | object; stateSnaphot?: object; children?: any[]; }}) => (

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
