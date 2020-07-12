/* eslint-disable jest/no-disabled-tests */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable jest/valid-describe */
/* eslint-disable react/react-in-jsx-scope */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
// import toJson from 'enzyme-to-json';
import { getHooksNames } from '../helpers';

// Newer Enzyme versions require an adapter to a particular version of React
configure({ adapter: new Adapter() });

describe('AST Unit Tests', () => {
  describe('getHooksNames', () => {
    it.skip('Should return object with one getter/setter for a single useState instance', () => {
      const useState = 'const singleUseStateTest = () => { const [testCount, setTestCount] = useState(0); return ( <div> <p> You clicked this {testCount} times </p> <button onClick={() => setTestCount(testCount + 1)}>+1</button> <button onClick={() => setTestCount(testCount - 1)}>-1</button> <hr /> </div> )';

      const expectedObject = {
        _useState: 'testCount',
        _useState2: 'setTestCount',
      };
      expect(getHooksNames(useState)).toEqual(expectedObject);
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

    it.skip('Should ignore any non-hook definitions', () => {
      const useState = 'const singleUseStateTest = () => { const [testCount, setTestCount] = useState(0); const age = 20; return ( <div> <p> You clicked this {testCount} times </p> <button onClick={() => setTestCount(testCount + 1)}>+1</button> <button onClick={() => setTestCount(testCount - 1)}>-1</button> <p> You are {age} years old! </p> <button onClick={age => age + 1}>Get Older</button> <hr /> </div>)';

      expect(Object.keys(getHooksNames(useState))).toHaveLength(2);
    });

    it.skip('Should return an empty object if no hooks found', () => {
      const useState = 'const singleUseStateTest = () => { const age = 20; return ( <div> <p> You are {age} years old! </p> <button onClick={age => age + 1}>Get Older</button> <hr /> </div>)';

      expect(getHooksNames(useState)).toBe({});
    });

    it.skip('Should throw an error if input is invalid javascript', () => {
      const useState = 'const singleUseStateTest = () => { age: 20; return ( <div> <p> You are {age} years old! </p> <button onClick={age + 1}>Get Older</button></div>) }';

      expect(getHooksNames(useState)).toThrow();
    });
  });
});



/* /*
console.log('getHooksNames: ', getHooksNames(`function LastSnapshot(props) {
  var _useState = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(''),
      _useState2 = _slicedToArray(_useState, 2),
      currentSnapshot = _useState2[0],
      setCurrentSnapshot = _useState2[1];

  var _useState3 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(25),
      _useState4 = _slicedToArray(_useState3, 2),
      testState = _useState4[0],
      setTestState = _useState4[1];

  var _useState5 = Object(react__WEBPACK_IMPORTED_MODULE_0__["useState"])(50),
      _useState6 = _slicedToArray(_useState5, 2),
      testState2 = _useState6[0],
      setTestState2 = _useState6[1];

  function replacer(name, val) {
    // Ignore the key that is the name of the state variable
    if (name === 'currentSnapshot') {
      console.log('filtering currentSnapshot from display');
      return undefined;
    }

    return val;
  }

  Object(react__WEBPACK_IMPORTED_MODULE_0__["useEffect"])(function () {
    window.addEventListener('message', function (_ref) {
      var _ref$data = _ref.data,
          action = _ref$data.action,
          payload = _ref$data.payload;

      if (action === 'recordSnap') {
        console.log('stringifying payload:', payload);
        var payloadContent = JSON.stringify(payload, replacer, 1);
        setCurrentSnapshot(payloadContent);
        setTestState(function (state) {
          return state * 2;
        });
        setTestState2(function (state) {
          return state * 2;
        });
        console.log('current snapshot', currentSnapshot);
      }
    });
  }, []);
  /*
  // This method is for testing. Setting state after the activeSandbox is changed modifies the overall behavior of the sandbox environment.
  const { activeSandbox } = props;
  useEffect(() => {
    // Reset the current snapshot when a new sandbox is entered
    setCurrentSnapshot('');
  }, [activeSandbox]);
  */
/*
 return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
  id: "lastSnapshot",
  className: "ml-5 mt-2",
  style: {
    whiteSpace: 'pre'
  }
}, testState, testState2, currentSnapshot));
};`));
*/