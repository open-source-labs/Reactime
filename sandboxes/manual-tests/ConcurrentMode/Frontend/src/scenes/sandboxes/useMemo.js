import React, { useState, useMemo } from 'react';
import './styles.sass';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const UseMemo = () => {
  const [count, setCount] = useState(0);
  const [frozen, setFrozen] = useState(false);

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
    </div>
  );
};

export default UseMemo;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
