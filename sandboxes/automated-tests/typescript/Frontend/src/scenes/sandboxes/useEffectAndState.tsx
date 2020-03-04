import React, { useEffect, useState } from 'react';
// import { connect } from 'react-redux';
import UseStateChild from './useStateChild';
import './styles.sass';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const UseEffectAndState = () => {
  const [count, setCount] = useState(0);
  const [intervalCount, setIntervalCount] = useState(0);
  const [buttonCount, setButtonCount] = useState(0);
  const [effectCount, setEffectCount] = useState(0);

  useEffect(() => {
    const effectInterval = setInterval(
      () => setCount(prevCount => prevCount + 1),
      50
    );

    if (intervalCount === 20) clearInterval(effectInterval);

    return () => clearInterval(effectInterval);
  }, [intervalCount]);

  useEffect(() => {
    if (count % 10 === 0) setIntervalCount(prevCount => prevCount + 1);
  }, [count]);

  useEffect(() => {
    if (!(buttonCount % 2)) setEffectCount(lastCount => lastCount + 1);
  }, [buttonCount]);

  return (
    <>
      {`${count}. This next number increments at each interval of 10 and stops both counters once its value reaches 20 => ${intervalCount}`}

      <div className="mt-5">
        Button Count
        {buttonCount}
      </div>

      <button
        type="button"
        className="mt-3"
        onClick={() => setButtonCount(buttonCountVal => buttonCountVal + 1)}
      >
        Click Here to Increase the State Count Directly Above
      </button>

      <div className="mt-3 mb-5">
        Effect Count Should Increase When Button Count is Even:
        {effectCount}
      </div>

      <UseStateChild />
    </>
  );
};

export default UseEffectAndState;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
