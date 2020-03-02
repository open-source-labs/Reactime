import React, { useState, Dispatch } from 'react';
import { connect } from 'react-redux';
import UseStateChild from './useStateChild';
import './styles.sass';

import * as actions from '../../redux/actions/actions';
import { RootState } from '../../redux/reducers/index';
import { CoreActionTypes } from '../../redux/actions/actionTypes';

interface StateProps {
  count: Number;
}

interface DispatchProps {
  increaseCount: () => void;
}

type Props = StateProps & DispatchProps;

const mapStateToProps = (state: RootState) => ({
  count: state.core.count
});
const mapDispatchToProps = (dispatch: Dispatch<CoreActionTypes>) => {
  return {
    increaseCount: () => dispatch(actions.increaseCount())
  };
};

const Redux = ({ count, increaseCount }: Props) => {
  const [stateCount, setStateCount] = useState(0);

  return (
    <div>
      <div>
        Count
        {` ${count}`}
      </div>

      <button type="button" onClick={increaseCount}>
        Click Here to Increase the Count (Redux Data)
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

export default connect(mapStateToProps, mapDispatchToProps)(Redux);
