import React from 'react';
import PropTypes from 'prop-types';

const ButtonsContainer = ({
  mode: { paused, locked, persist },
  toggleMode,
  importSnapshots,
  exportSnapshots,
}) => (
  <div className="buttons-container">
    <button className="pause-button" type="button" onClick={() => toggleMode('paused')}>
      {paused ? 'Resume' : 'Pause'}
    </button>
    <button className="lock-button" type="button" onClick={() => toggleMode('locked')}>
      {locked ? 'Unlock' : 'Lock'}
    </button>
    <button className="persist-button" type="button" onClick={() => toggleMode('persist')}>
      {persist ? 'Unpersist' : 'Persist'}
    </button>
    <button className="import-button" type="button" onClick={importSnapshots}>
      Import
    </button>
    <button className="export-button" type="button" onClick={exportSnapshots}>
      Export
    </button>
  </div>
);

ButtonsContainer.propTypes = {
  toggleMode: PropTypes.func.isRequired,
  importSnapshots: PropTypes.func.isRequired,
  exportSnapshots: PropTypes.func.isRequired,
  mode: PropTypes.shape({
    paused: PropTypes.bool,
    locked: PropTypes.bool,
    persist: PropTypes.bool,
  }).isRequired,
};

export default ButtonsContainer;
