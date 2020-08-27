import React, { useEffect, useState } from 'react';
// import { connect } from 'react-redux';
import './styles.sass';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const UseEffectAndState = () => {
  const [count, setCount] = useState(0);
  const [intervalCount, setIntervalCount] = useState(0);

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

  return (
    <>{`${count}. This next number increments at each interval of 10 and stops both counters once its value reaches 20 => ${intervalCount}`}</>
  );
};

export default UseEffectAndState;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
