/* eslint-disable jest/no-disabled-tests */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jest/valid-describe */
/* eslint-disable react/react-in-jsx-scope */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import toJson from 'enzyme-to-json';
import astParser from '../astParser';

// Newer Enzyme versions require an adapter to a particular version of React
configure({ adapter: new Adapter() });

describe('AST Unit Tests', () => {
  describe('astParser', () => {
    it.skip('Should return object with one getter/setter for a single useState instance', () => {
      const singleUseState = 'const singleUseStateTest = () => { const [testCount, setTestCount] = useState(0); return ( <div> <p> You clicked this {testCount} times </p> <button onClick={() => setTestCount(testCount + 1)}>+1</button> <button onClick={() => setTestCount(testCount - 1)}>-1</button> <hr /> </div> ) }';

      const expectedObject = {
        _useState: 'testCount',
        _useState2: 'setTestCount',
      };
      expect(astParser(singleUseState)).toEqual(expectedObject);

    // TEST 2: Should take in multiple function definitions
      it.skip('Should return object with two getters/setters for a single useState instance', () => {
        const singleUseState = 'const singleUseStateTest = () => { const [testCount, setTestCount] = useState(0); const [age, setAge] = useState(20); return ( <div> <p> You clicked this {testCount} times </p> <button onClick={() => setTestCount(testCount + 1)}>+1</button> <button onClick={() => setTestCount(testCount - 1)}>-1</button> <p> You are {age} years old! </p> <button onClick={() => setAge(age + 1)}>Get Older</button> <hr /> </div>) }';

        const expectedObject = {
          _useState: 'testCount',
          _useState2: 'setTestCount',
          _useState3: 'age',
          _useState4: 'setAge'
        };
        expect(astParser(singleUseState)).toEqual(expectedObject);
    // with hooks and return an object with all 4 properties
    // TEST 3: Should ignore any non-hook definitions
    // Test 4: Should return an empty object if no hooks found
    // Test 5: Should throw an error if input is invalid javascript
    });
  });
});
