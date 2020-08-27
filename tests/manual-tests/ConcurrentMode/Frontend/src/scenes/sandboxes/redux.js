import React from 'react';
import { connect } from 'react-redux';
import './styles.sass';

import * as actions from '../../redux/actions/actions';

const mapStateToProps = state => ({
  count: state.core.count
});
const mapDispatchToProps = dispatch => ({
  increaseCount: () => dispatch(actions.increaseCount())
});

const Scenes = ({ count, increaseCount }) => {
  return (
    <div>
      <div>
        Count
        {` ${count}`}
      </div>

      <button type="button" onClick={increaseCount}>
        Click Here to Increase the Count (Redux Data)
      </button>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Scenes);
