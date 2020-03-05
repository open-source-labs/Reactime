import React, { useState } from 'react';
// import { connect } from 'react-redux';
import './styles.sass';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const UseStateChild = () => {
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(1000);

  return (
    <div>
      <div>
        <div>
          Child Component Count Increase (UseState):
          {` ${count2}`}
        </div>
        <div>
          Child Component Count Decrease (UseState):
          {` ${count3}`}
        </div>

        <button
          type="button"
          onClick={() => {
            setCount2(lastCount => lastCount + 1);
            setCount3(lastCount => lastCount - 1);
          }}
        >
          Click Here to Change Both Child Counts Simultaneously
        </button>
      </div>
    </div>
  );
};

export default UseStateChild;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
