/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-undef */
import React, { useEffect } from 'react';
// import { connect } from 'react-redux';
import './styles.sass';
import UseEffectAndState from './useEffectAndState';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const UseEffect = () => {
  useEffect(() => {
    const effectDiv = document.getElementById('effectDiv');

    //* Create three divs to append to effectDiv
    const newDivElement = document.createElement('div');
    const newDivTextNode = document.createTextNode('New Div');

    const newDivElement2 = document.createElement('div');
    const newDivTextNode2 = document.createTextNode('New Div 2');

    const newDivElement3 = document.createElement('div');
    const newDivTextNode3 = document.createTextNode('New Div 3');

    newDivElement.appendChild(newDivTextNode);
    newDivElement2.appendChild(newDivTextNode2);
    newDivElement3.appendChild(newDivTextNode3);

    const timeout1 = setTimeout(
      () => effectDiv.appendChild(newDivElement),
      300
    );
    const timeout2 = setTimeout(
      () => effectDiv.appendChild(newDivElement2),
      1200
    );
    const timeout3 = setTimeout(
      () => effectDiv.appendChild(newDivElement3),
      2200
    );

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  return (
    <>
      <div className="font-weight-bold">
        3 new divs will appear below due to elements being appended within
        useEffect (setTimeout is used)
        <div id="effectDiv" />
      </div>

      <div className="bg-primary p-1 my-3 mx-5 vh-5 text-white text-center font-weight-bold">
        New Test Below
      </div>

      <div className="font-weight-bold">
        UseEffect triggers an interval that changes this state variable → {' '}
        <UseEffectAndState />
      </div>
    </>
  );
};

export default UseEffect;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
