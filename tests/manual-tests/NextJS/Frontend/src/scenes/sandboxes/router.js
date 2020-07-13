import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import UseState from './useState';
import UseEffect from './useEffect';
import UseContext from './useContext';
import UseMemo from './useMemo';
import AppContextProvider from '../../context/appContextProvider';

import './styles.sass';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const RouterApp = () => (
  <Router>
    <div className="pb-4">
      <Link exact to="/" className="font-weight-bold mr-5">
        Use State Route
      </Link>

      <Link to="/useEffectRoute" className="font-weight-bold mr-5">
        Use Effect Route
      </Link>

      <Link to="/useContextRoute" className="font-weight-bold mr-5">
        Use Context Route
      </Link>

      <Link to="/useMemoRoute" className="font-weight-bold mr-5">
        Use Memo Route
      </Link>
    </div>
    <Switch>
      <Route exact path="/">
        <UseState />
      </Route>

      <Route path="/useEffectRoute">
        <UseEffect />
      </Route>

      <Route path="/useContextRoute">
        <AppContextProvider>
          <UseContext />
        </AppContextProvider>
      </Route>

      <Route path="/useMemoRoute">
        <UseMemo />
      </Route>
    </Switch>
  </Router>
);

export default RouterApp;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
