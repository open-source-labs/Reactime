/* eslint-disable max-len */
/* eslint-disable jest/no-disabled-tests */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jest/valid-describe */
/* eslint-disable react/react-in-jsx-scope */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import toJson from 'enzyme-to-json';
import { throttle, getHooksNames } from '../helpers';

// Newer Enzyme versions require an adapter to a particular version of React
configure({ adapter: new Adapter() });

describe('AST Unit Tests', () => {

  describe('throttle', () => {
    let mockFunc;
    let throttleOutput;

    beforeEach(() => {
      // Replace any setTimeout functions with jest timer
      jest.useFakeTimers();
      mockFunc = jest.fn();
      throttleOutput = throttle(mockFunc, 1000);
    });

    it('Should return a function', () => {
      expect(typeof throttleOutput).toBe('function');
    });

    it('Should only invoke function', () => {
      /*
        How Throttle Works
        1. INIT isOnCooldown and isCallQueued to false

        2. first time you call throttledFunc:
            1. invoke input function
            2. isOnCooldown set to true, isCallQueued set to false
            3. Invoke `runAfterTimeout` after X milliseconds (using setTimeout)
              - invoke input function
              - isOnCooldown set to false
        3. next time you call
          TO BE CONTINUED...
      */

      // Expect the mock function we pass in to only be called at most every X milliseconds
      expect(mockFunc).not.toHaveBeenCalled();

      // Invoke returned timer function from throttle
      throttleOutput();
      // At this point, setTimeout has been invoked
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
    });
  });

  describe('getHooksNames', () => {
    it('Should return object with one getter/setter for a single useState instance', () => {
      const elementType = `function SingleUseFakeComponent() { 
                            const [testCount, setTestCount] = useState(0);
                            const age = 20; 
                            return (<div> <p> You clicked this {testCount} times </p>
                                    <button onClick={() => setTestCount(testCount + 1)}>+1</button>
                                    <button onClick={() => setTestCount(testCount - 1)}>-1</button> <p>
                                    You are {age} years old! </p>
                                    <button onClick={age => age + 1}>Get Older</button>
                                    <hr /> 
                                    </div>);
                           }`;

      expect(getHooksNames(elementType)).toEqual(['testCount', 'setTestCount']);
    });

    it.skip('Should output the right number of properties when taking in multiple function definitions', () => {
      const useState = 'const singleUseStateTest = () => { const [testCount, setTestCount] = useState(0); const [age, setAge] = useState(20); return ( <div> <p> You clicked this {testCount} times </p> <button onClick={() => setTestCount(testCount + 1)}>+1</button> <button onClick={() => setTestCount(testCount - 1)}>-1</button> <p> You are {age} years old! </p> <button onClick={() => setAge(age + 1)}>Get Older</button> <hr /> </div>)';

      const expectedObject = {
        _useState: 'testCount',
        _useState2: 'setTestCount',
        _useState3: 'age',
        _useState4: 'setAge',
      };
      expect(getHooksNames(useState)).toEqual(expectedObject);
      expect(Object.keys(getHooksNames(useState))).toHaveLength(4);
    });

    it('Should ignore any non-hook definitions', () => {
      const elementType = `function SingleUseFakeComponent() { 
                            const [testCount, setTestCount] = useState(0);
                            const age = 20; 
                            return (<div> <p> You clicked this {testCount} times </p>
                                    <button onClick={() => setTestCount(testCount + 1)}>+1</button>
                                    <button onClick={() => setTestCount(testCount - 1)}>-1</button> <p>
                                    You are {age} years old! </p>
                                    <button onClick={age => age + 1}>Get Older</button>
                                    <hr /> 
                                    </div>);
                          }`;

      const expectedNumHookVariables = 2;
      expect(Object.keys(getHooksNames(elementType))).toHaveLength(expectedNumHookVariables);
    });

    it.skip('Should return an empty object if no hooks found', () => {
      const useState = 'const singleUseStateTest = () => { const age = 20; return ( <div> <p> You are {age} years old! </p> <button onClick={age => age + 1}>Get Older</button> <hr /> </div>)';

      expect(getHooksNames(useState)).toBe({});
    });

    it.skip('Should throw an error if input is invalid javascript', () => {
      const useState = `const singleUseStateTest = () => { 
                        age: 20; 
                        return ( <div> <p> You are {age} years old! </p> <button onClick={age + 1}>Get Older</button></div>) }`;

      expect(getHooksNames(useState)).toThrow();
    });
  });
});
