import React from 'react';
import { MemoryRouter as Router, Route, NavLink, Switch } from 'react-router-dom';
import Diff from './Diff';
import { DiffRouteProps } from '../FrontendTypes';

/*
  Loads the appropriate DiffRoute view and renders the 'Tree' and 'Raw' navbar buttons after clicking on the 'Diff' button located near the top rightmost corner.
*/

// 'DiffRoute' only passed in prop is 'snapshot' from 'tabs[currentTab]' object in 'MainContainer'
const DiffRoute = (props: DiffRouteProps): JSX.Element => (
  <Router>
    <div className='navbar'>
      <NavLink className='router-link' activeClassName='is-active' exact to='/'>
        Tree
      </NavLink>
      <NavLink className='router-link' activeClassName='is-active' to='/diffRaw'>
        Raw
      </NavLink>
    </div>
    <Switch>
      <Route path='/diffRaw' render={() => <Diff snapshot={props.snapshot} />} />
      <Route path='/' render={() => <Diff snapshot={props.snapshot} show={false} />} />
    </Switch>
  </Router>
);

export default DiffRoute;
