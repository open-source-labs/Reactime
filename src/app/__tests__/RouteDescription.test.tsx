/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-filename-extension */

import React from 'react';
import { shallow, configure, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Action from '../components/Action';
import RouteDescription from '../components/RouteDescription';

configure({ adapter: new (Adapter as any)() });

describe('Unit testing RouteDescription', () => {
  const actionsArr: JSX.Element[] = [];

  actionsArr.push(
    <Action
      key='action0'
      index={0}
      state={{}}
      displayName='1.0'
      componentName='App'
      componentData={{ actualDuration: 0 }}
      selected={false}
      last={false}
      dispatch={() => null}
      sliderIndex={0}
      handleOnkeyDown={(e, i) => null}
      viewIndex={undefined}
      isCurrIndex={false}
      routePath='http://localhost:3000/home'
    />,
  );

  actionsArr.push(
    <Action
      key='action1'
      index={0}
      state={{}}
      displayName='2.0'
      componentName='App'
      componentData={{ actualDuration: 0 }}
      selected={false}
      last={false}
      dispatch={() => null}
      sliderIndex={0}
      handleOnkeyDown={(e, i) => null}
      viewIndex={undefined}
      isCurrIndex={false}
      routePath='http://localhost:3000/home'
    />,
  );

  const wrapper = shallow(<RouteDescription actions={actionsArr} />);

  test('Renders the correct number of Action components', () => {
    expect(wrapper.find(Action).length).toBe(2);
  });

  test('Renders a single ".route" class', () => {
    expect(wrapper.find('.route').length).toBe(1);
  });

  test('Renders an h3 tag with the correct pathname "Route: <pathname>"', () => {
    expect(wrapper.find('h3').text()).toBe('Route: /home');
  });
});
