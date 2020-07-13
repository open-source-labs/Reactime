/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
// import { connect } from 'react-redux';
import './styles.sass';
// import { AnyAction } from 'redux';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const LastSnapshot = () => {
  const [currentSnapshot, setCurrentSnapshot] = useState('');

  function replacer(name: any, val: any) {
    // Ignore the key that is the name of the state variable
    if (name === 'currentSnapshot') return undefined;

    return val;
  }

  useEffect(() => {
    window.addEventListener('message', ({ data: { action, payload } }) => {
      if (action === 'recordSnap') {
        const payloadContent = JSON.stringify(payload, replacer, 2);

        setCurrentSnapshot(payloadContent);
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
