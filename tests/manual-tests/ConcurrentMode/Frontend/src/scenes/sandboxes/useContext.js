import React, { useContext } from 'react';
import AppContext from '../../context/appContext';
import './styles.sass';

// import * as actions from '../redux/actions/actions';
// const mapStateToProps = state => ({});
// const mapDispatchToProps = dispatch => ({});

const UseContext = () => {
  const { count, setCount } = useContext(AppContext);

  return (
    <div>
      <div>
        Count
        {` ${count}`}
      </div>

      <button type="button" onClick={() => setCount()}>
        Click Here to Increase the Count (Context Data)
      </button>
    </div>
  );
};

export default UseContext;
// export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
