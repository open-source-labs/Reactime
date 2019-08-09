import { mount , configure } from 'enzyme';

import React from 'react';
import { MemoryRouter , NavLink } from 'react-router-dom';

import StateContainer from '../containers/StateContainer';
import Chart from '../components/Chart';
import Tree from '../components/Tree';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('testing react router path',()=>{
  const wrapper = mount(<MemoryRouter><StateContainer/></MemoryRouter>);
  it('NavLink has two paths', () => {                                       
    expect(wrapper.find(NavLink)).toHaveLength(2);
  });
  it('First NavLink should be root', () => {
    expect(wrapper.find(NavLink).at(0).props().to).toBe('/');
  });
  it('Second NavLink should be chart', () => {
    expect(wrapper.find(NavLink).at(1).props().to).toBe('/chart');
  });
});

describe('render test', () => {
  const wrapper = mount(
    <MemoryRouter>
      <StateContainer snapshot={ {data :'root'} }/>
    </MemoryRouter>);
  it('Clicking first NavLink should render Tree only', () => {
    wrapper.find(NavLink).at(0).simulate('click', { button: 0 });
    expect(wrapper.find(Tree)).toHaveLength(1);
    expect(wrapper.find(Chart)).toHaveLength(0);
  });
  it('Clicking second NavLink should render Chart only', () => {
    wrapper.find(NavLink).at(1).simulate('click', { button: 0 });
    expect(wrapper.find(Tree)).toHaveLength(0);
    expect(wrapper.find(Chart)).toHaveLength(1);
  });
});