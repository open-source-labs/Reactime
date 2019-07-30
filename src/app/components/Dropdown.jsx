import React, { Component } from 'React'
import Dropdown from 'react-16-dropdown';

const options = [{
  label: 'Prestige 🎩',
  value: 'prestige',
}, {
  label: 'Inception 😴',
  value: 'inception',
}];

<Dropdown
  align='left'
  className='custom-classname'
  closeOnEscape={true}
  options={options}
  triggerLabel='Movies'
  onClick={val => console.log(val)}
/>

export default Dropdown;