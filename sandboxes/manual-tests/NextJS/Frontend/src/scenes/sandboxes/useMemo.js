import React, { useState, useMemo } from 'react';
import UseStateChild from './useStateChild';
import './styles.sass';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const UseMemo = () => {
  const [count, setCount] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [stateCount, setStateCount] = useState(0);

  const countDisplay = useMemo(
    () => () => (
      <div>
        Count
        {` ${count}`}
      </div>
    ),
    [frozen ? null : count]
  );

  return (
    <div>
      {countDisplay()}

      <button
        type="button"
        onClick={() => setCount(lastCount => lastCount + 1)}
        style={frozen ? { backgroundColor: 'red' } : null}
      >
        Click Here to Increase the Count
      </button>

      <button
        type="button"
        onClick={() => setFrozen(lastBoolean => !lastBoolean)}
        className="ml-4"
      >
        Click Here to Toggle Freezing the Count. Status:
        <span className="font-weight-bold">
          {frozen ? ' Frozen' : ' Not Frozen'}
        </span>
      </button>

      <div className="mt-5">
        State Button Count
        {` ${stateCount}`}
      </div>

      <button
        className="mb-5"
        type="button"
        onClick={() => setStateCount(lastCount => lastCount + 1)}
      >
        Click Here to Increase the Count (Data Stored in State)
      </button>

      <UseStateChild />
    </div>
  );
};

export default UseMemo;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
