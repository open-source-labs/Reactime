import React from 'react';
import { configure, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16';
import {
  MemoryRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';

import DiffRoute from '../components/DiffRoute.jsx';


configure({ adapter: new Adapter() });

// check if our component has a component tag router
// check if router component has a dive with a navlik component
// check if component has a switch tag
// check if routes in switch have appropriate props
