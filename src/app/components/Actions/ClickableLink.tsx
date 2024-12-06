import React, {useState} from 'react';

const ClickableLink = (): JSX.Element  => {
    //visibleKeys is an ojc that tracks which keys are visible or hidden
    // ex 
      //     {
      //   "ThemeProvider": true,
      //   "ThemeProvider.ThemeContext1": false
      // }
    const [visibleKeys, setVisibleKeys] = useState({});

    const toggleInfo = (key:string) => {
        setVisibleKeys((prev) => ({
          ...prev, //copies all current keys and their visibility from prev object
          [key]: !prev[key] // adds or updates the key in the visibleKeys object.
        }))
      };
    const someInfo = {
      ThemeProvider: { 
        UserProvider: {
          UserContext: 'some info here',
        },
        ThemeContext1:  {
          Nested: 'some info here'},
        ThemeConext2: 'some info here'
      },
      // UserProvider: {
      //   UserContext: 'some info here',
      // }
    }
    
 

   //create a function to iterate through the nested structure 

    // const renderNestedObjec = (obj) => {
    //   return Object.keys(obj).map((key) => (
    //     <div
    //     style={{ color: 'blue', cursor: 'pointer' }}
    //     onClick={toggleInfo(key)}
    //     >
    //     <strong>{key}</strong>:{" "}
    //     {typeof obj[key] === 'object' ? renderNestedObjec(obj[key]) : <span>{obj[key]}</span>}
    //     </div>
    //   ))
    // }
    // return (
    //   <div>
    //       {renderNestedObjec(someInfo)}
    //   </div>
    // )
        // <div>
        //   {Object.keys(info).map((key) => (
        //       <div
        //     style={{ color: 'blue', cursor: 'pointer' }}
        //     onClick={toggleInfo}
        //     >
        //     {key}
        //     </div>
          // ))}
          
            {/* displayed onClick 
            logical And operator: if showInfo is true --> thes result on the righthand side is evaluated and returned 
            */}
            {/* {showInfo && (
              
      )} */}
        // </div>
    // );


    // Recursive function to render nested objects
  const renderNestedObjec = (obj, parentKey = '') => { //parentKey is unique keys that represent the hierarchy of the object.
    return Object.keys(obj).map((key) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key; // if parentKey does not exisit --> fullKey = key, else fullKey=ParentKey.Key
      return (
        // each key is rendered as a div
        <div key={fullKey} style={{ marginLeft: '20px' }}> 
          <div
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={() => toggleInfo(fullKey)} // Pass the unique key to toggle visibility
          >
            <strong>{key}</strong>
          </div>
          {visibleKeys[fullKey] && // Check if the key is visible
            (typeof obj[key] === 'object' //check if the value of the key is an object
              ? renderNestedObjec(obj[key], fullKey) // Recursive rendering for nested objects
              //if value is not an object
              : <div style={{ marginLeft: '20px' }}>{obj[key]}</div>)}
        </div>
      );
    });
  };

  return <div>{renderNestedObjec(someInfo)}</div>;
};


export default ClickableLink; 