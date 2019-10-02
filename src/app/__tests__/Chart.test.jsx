const TestRunner = require("jest-runner")

// Unit Test Cases for Charts
  // description: lifecycle methods
    // Component should call make3dTree upon mounting
    // object 'root' should be a deep clone of the snapshot
      // i.e.: this.props.snapshot !== root

  // description: maked3Tree
    // Should call function 'removed3tree' only once
    // Should call appropriate function upon triggering a certain event on the tooltip div
      // i.e.:
      // 'mouseover' event -> 'tipMouseover' function
      // 'mouseout' event -> 'tipMouseout' function
    // Should call appropriate function upon triggering a certain event on a node (nested under the 'update' function)
      // i.e.:
      // 'mouseover' event -> 'mouseover' function
      // 'mouseout' event -> 'mouseout' function
      // 'click' event -> 'click' function
    // Should call function 'update' at least once

    describe('placeholder', () => {
      xit('placeholder for tests', () => {
        expect(1+1).toEqual(2);
      })
    })