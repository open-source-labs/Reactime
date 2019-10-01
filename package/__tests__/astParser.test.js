// Test 1: Should take in a function definition with 1 hook and return an object with the getter/setter
// EXAMPLE INPUT FOR TEST
/**
 * function UseStateHookTest() {
 *   const [testCount, setTestCount] = useState(0);
 *   return (
 *     <div>
 *       <p>You clicked this {useStateCount} times</p>
 *       <button onClick={() => setTestCount(testCount + 1)}>+1</button>
 *       <button onClick={() => setTestCount(testCount - 1)}>-1</button>
 *       <hr />
 *   </div>
 *   );
 * }
*/

// EXPECTED RESULT of astParser(input)
/**
 * {
 *  _useState: "testCount",
 *  _useState2: "setTestCount"
 * }
 */

 // TEST 2: Should take in multiple function definitions with hooks and return an object with all 4 properties
 // TEST 3: Should ignore any non-hook definitions
 // Test 4: Should return an empty object if no hooks found
 // Test 5: Should throw an error if input is invalid javascript