/* eslint-disable react/jsx-props-no-spreading */
import { shallow, configure } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Slider from 'rc-slider';
import Tooltip from 'rc-tooltip';
import MainSlider from '../components/MainSlider';

import { useStoreContext } from '../store';

const { Handle } = Slider;

configure({ adapter: new Adapter() });

jest.mock('../store');

describe('Unit testing for MainSlider.jsx', () => {
  let wrapper;
  const props = {
    snapshotsLength: 1,
  };

  const state = {
    tabs: {
      100: {
        sliderIndex: 1,
      },
    },
    currentTab: 100,
  };

  const dispatch = jest.fn();
  useStoreContext.mockImplementation(() => [state, dispatch]);

  beforeEach(() => {
    wrapper = shallow(<MainSlider {...props} />);
  });
  it('Component should return <Slider /> component from rc-slider library', () => {
    expect(wrapper.type()).toEqual(Slider);
  });
  it('Component should have min, max, value, and handle props', () => {
    expect(wrapper.props()).toHaveProperty('min');
    expect(wrapper.props()).toHaveProperty('max');
    expect(wrapper.props()).toHaveProperty('value');
    expect(wrapper.props()).toHaveProperty('handle');
  });
  it('Prop type tests on component', () => {
    expect(typeof wrapper.prop('min')).toEqual('number');
    expect(typeof wrapper.prop('max')).toEqual('number');
    expect(typeof wrapper.prop('value')).toEqual('number');
    expect(typeof wrapper.prop('handle')).toEqual('function');
  });

  describe('Testing for handle functional component', () => {
    it('handle prop should return <Tooltip /> component from rc-tooltip library', () => {
      // expect(wrapper.prop('handle').type()).toEqual(Tooltip);
      // console.log(wrapper.prop('handle')) --> [Function: handle]
    });
  });
});

// Compont should have a min and max prop
// compoonent should have a handle prop
  // handle prop should return tooltip component
// 

// configure({ adapter: new Adapter() });




// describe('Unit testing for SwitchApp.jsx', () => {
//   let wrapper;

//   const state = {
//     currentTab: 100,
//     tabs: { 100: { snapshots: [1, 2, 3, 4], viewIndex: 1, sliderIndex: 1, title: 'component'} },
//   };
//   const dropdownCurrTabLabel = {
//     value: 100,
//     label: '',
//   };
//   // nate and edwin: mockImplementation creates a mock function call
//   const dispatch = jest.fn();

//   // nate and edwin: mockImplementation creates a mock state
//   useStoreContext.mockImplementation(() => [state, dispatch]);

//   beforeEach(() => {
//     wrapper = shallow(<SwitchApp />);
//     dispatch.mockClear();
//   });

//   describe('SwitchApp Component', () => {
//     beforeEach(() => {
//       wrapper.find('.tab-select-container').simulate('change', {});
//     });
//     // console.log('dispatch mock calls', dispatch.mock.calls);
//     it('SwitchApp component returns <Select /> from react-select library', () => {
//       console.log('coponent props', wrapper.find('.tab-select-container').props());
//       expect(wrapper.find('.tab-select-container').type()).toEqual(Select);
//       expect(wrapper.find('.tab-select-container').props().className).toBe('tab-select-container');
//       expect(wrapper.find('.tab-select-container').props().value).toEqual(dropdownCurrTabLabel);
//     });
    
//     it('OnChange should run dispatch function', () => {
//       expect(dispatch.mock.calls.length).toBe(1);
//     })
    
//     it('options prop should be an array', () => {
//       expect(Array.isArray(wrapper.find('.tab-select-container').props().options)).toBeTruthy();
//       expect(wrapper.find('.tab-select-container').props().options[0]).toHaveProperty('value');
//       expect(wrapper.find('.tab-select-container').props().options[0]).toHaveProperty('label');
//     })
//   })

//   describe('dropdownCurrTabLabel', () => {
//     it('should have properties value and label', () => {
//       expect(dropdownCurrTabLabel).toHaveProperty('value');
//       expect(dropdownCurrTabLabel).toHaveProperty('label');
//     });
//   });

//   describe('state', () => {
//     it('currentTab value should be a number', () => {
//       expect(typeof state.currentTab).toEqual('number');
//     });
//     it('tabs value should be an object', () => {
//       expect(typeof state.tabs).toEqual('object');
//     });
//   });

//   // describe('Select Component', () => {
//   //   it('options prop should be an array', () => {
//   //     wrapper.find('.tab-select-container').props().options
//   //   });
//   //   it('value prop should be a number', () => {
      
//   //   });
//   //   it('on change should run a function', () => {
      
//   //   });
//   // });

//   // options should be an array
//   // value prop should be equal to a number
//   // check if onChange if the function runs
// })       