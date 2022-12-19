/* eslint-disable max-len */
/* eslint-disable jest/no-disabled-tests */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jest/valid-describe */
/* eslint-disable react/react-in-jsx-scope */
// import { configure } from 'enzyme';
// import Adapter from 'enzyme-adapter-react-16';
// import toJson from 'enzyme-to-json';
import { throttle, getHooksNames } from '../helpers';

// Newer Enzyme versions require an adapter to a particular version of React
// configure({ adapter: new Adapter() });

// Replace any setTimeout functions with jest timer
jest.useFakeTimers();

describe('AST Unit Tests', () => {

  describe('throttle', () => {
    let mockFunc;
    let throttledMockFunc;

    beforeEach(() => {
      mockFunc = jest.fn();
      throttledMockFunc = throttle(mockFunc, 1000);
    });

    it('Should return a function', () => {
      expect(typeof throttledMockFunc).toBe('function');
    });

    it('throttles subsequent fire attempts into one shot after cooldown', () => {
      throttledMockFunc();
      expect(mockFunc).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(20);
      throttledMockFunc();
      jest.advanceTimersByTime(20);
      throttledMockFunc();
      jest.advanceTimersByTime(20);
      throttledMockFunc();
      expect(mockFunc).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(941);
      expect(mockFunc).toHaveBeenCalledTimes(2);
    });

    it('Should only invoke function', () => {
      // Because we haven't invoked returned function from throttle
      // mock func should not have been called yet
      expect(mockFunc).not.toHaveBeenCalled();
      throttledMockFunc();
      expect(mockFunc).toHaveBeenCalledTimes(1);
    });
  });



  // test notes 
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

    it('Should output the right number of properties when given multiple hooks', () => {
      const elementType = `function SingleUseFakeComponent() { 
                            const [testCount, setTestCount] = useState(0);
                            const [biscuitCount, setBiscuitCount] = useState(0);
                            const age = 20; 
                            return (<div> <p> You clicked this {testCount} times </p>
                                    <button onClick={() => setTestCount(testCount + 1)}>+1</button>
                                    <button onClick={() => setTestCount(testCount - 1)}>-1</button> <p>
                                    You are {age} years old! </p>
                                    <button onClick={age => age + 1}>Get Older</button>
                                    <hr /> 
                                    </div>);
                          }`;

      expect(getHooksNames(elementType)).toEqual(['testCount', 'setTestCount', 'biscuitCount', 'setBiscuitCount']);
      expect(Object.keys(getHooksNames(elementType))).toHaveLength(4);
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

    it('Should return an empty object if no hooks found', () => {
      const elementType = `function SingleUseFakeComponent() { 
                            const age = 20; 
                            return (<div> <p> You clicked this {testCount} times </p>
                                    <button onClick={() => setTestCount(testCount + 1)}>+1</button>
                                    <button onClick={() => setTestCount(testCount - 1)}>-1</button> <p>
                                    You are {age} years old! </p>
                                    <button onClick={age => age + 1}>Get Older</button>
                                    <hr /> 
                                    </div>);
                          }`;

      expect(getHooksNames(elementType)).toEqual([]);
    });

    it('Should throw an error if input returns invalid JSX', () => {
      const useState = `const singleUseStateTest = () => { 
                        age: 20; 
                        return (<p> You are {age} years old! </p> 
                                  <button onClick={age + 1}>Get Older</button>
                                 </div>)
                        }`;

      expect(getHooksNames(useState)).toEqual(['unknown']);
    });
  });
});
