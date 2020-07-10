/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
import './styles.sass';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const LastSnapshot = props => {
  const [currentSnapshot, setCurrentSnapshot] = useState('');

  const [testState, setTestState] = useState(25);
  const [testState2, setTestState2] = useState(50);

  function replacer(name, val) {
    // Ignore the key that is the name of the state variable
    if (name === 'currentSnapshot') {
      console.log('filtering currentSnapshot from display');
      return undefined;
    }

    return val;
  }

  useEffect(() => {
    window.addEventListener('message', ({ data: { action, payload } }) => {
      if (action === 'recordSnap') {
        console.log('stringifying payload:', payload);
        const payloadContent = JSON.stringify(payload, replacer, 1);
        setCurrentSnapshot(payloadContent);
        setTestState((state) => state*2);
        setTestState2((state) => state*2);
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

  return (
    <div>
      <div
        id="lastSnapshot"
        className="ml-5 mt-2"
        style={{ whiteSpace: 'pre' }}
      >
        {currentSnapshot}
      </div>
    </div>
  );
};

export default LastSnapshot;
