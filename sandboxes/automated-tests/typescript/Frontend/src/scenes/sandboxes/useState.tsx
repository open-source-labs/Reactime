import React, { useState } from 'react';
import UseStateChild from './useStateChild';
// import { connect } from 'react-redux';
import './styles.sass';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const UseState = () => {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div>
        <div>
          Count
          {` ${count}`}
        </div>

        <button
          type="button"
          id="increaseButton"
          onClick={() => setCount(lastCount => lastCount + 1)}
        >
          Click Here to Increase the Count
        </button>
      </div>

      <div className="bg-primary p-1 my-3 mx-5 vh-5 text-white text-center font-weight-bold">
        New Test Below
      </div>

      <UseStateChild />
    </div>
  );
};

export default UseState;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
