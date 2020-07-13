import React, { useContext, useState } from 'react';
import AppContext from '../../context/appContext';
import UseStateChild from './useStateChild';
import './styles.sass';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const UseContext = () => {
  const { count, setCount } = useContext(AppContext);
  const [stateCount, setStateCount] = useState(0);

  return (
    <div>
      <div>
        Context Count
        {` ${count}`}
      </div>

      <button type="button" onClick={() => setCount()}>
        Click Here to Increase the Count (Context Data)
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

export default UseContext;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
