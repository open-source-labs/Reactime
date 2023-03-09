import { set } from 'lodash';
import React from 'react';
import { useState } from 'react';

function Home() {
  const [dummyData1, setDummyData1] = useState('dummyData1');
  const [dummyData2, setDummyData2] = useState('dummyData2');

  return (
    <div className='about'>
      <p>{dummyData1}</p>
      <p>{dummyData2}</p>
      <button
        onClick={() => {
          setDummyData1((dummyData1) => (dummyData1 === 'dummyData1' ? 'test1' : 'dummyData1'));
          setDummyData2((dummyData2) => (dummyData2 === 'dummyData2' ? 'test2' : 'dummyData2'));
        }}
      >
        {' '}
        Test{' '}
      </button>
      {/* <h1>Lorem Ipsum</h1> */}
      {/* <p>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </p>
      <p>
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
        voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
        cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      </p> */}
    </div>
  );
}

export default Home;
