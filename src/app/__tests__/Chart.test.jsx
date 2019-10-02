import React from 'react'; 
import Chart from '../components/Chart'; 

// Unit test cases for d3 functionality 
// Test the life cycle methods in Chart
describe('Life cycle methods in Chart', () => {
  it('should call maked3Tree upon mounting', () => {
    // Component should call maked3Tree upon mounting
    // Use the mock function + .toBeCalled()
   // Test the method in the component 
   throw new Error(); 
  }); 
}); 

// Test the root object and hierarchy 
describe('Root object', () => {
  it('should be a deep clone of the hierarchy', () => {
    // object 'root' should be a deep clone of the hierarchy
    // create an empty object to mimic root 
      // i.e.: this.props.hierarchy !== root
      // expect to !== this.props.hierarchy 
      // expect to be a deep clone 
      throw new Error(); 
  }); 
}); 

// Test the maked3Tree method 
describe('maked3Tree method', () => {
  it('should call removed3tree once', () => {
 // Should call function 'removed3tree' only once
    // expect toBeCalled()
    // expect toHaveBeenCalled()
    throw new Error(); 
  }); 
}); 
// Test the tooltip functionality in maked3Tree method 
describe('tooltip functionality in maked3Tree', () => {
// Should call appropriate function upon triggering 
// a certain event on the tooltip div
  // Should call appropriate function upon triggering mouseOver
  it('should invoke tip.show on mouseOver', () => {
    throw new Error(); 
  }); 
  // Should call appropriate function upon triggering mouseOut
  it ('should invoke tip.hide on mouseOut', () => {
    throw new Error(); 
  }); 
}); 



    