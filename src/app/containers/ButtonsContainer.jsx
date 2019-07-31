import React from 'react';
import PropTypes from 'prop-types';

const ButtonsContainer = ({ mode: { paused, locked, persist }, toggleMode, importSnapshots, exportSnapshots }) => (
  <div className="buttons-container">
    <div className="pause-button" onClick={() => toggleMode('paused')}>{(paused) ? 'Resume' : 'Pause'}</div>
    <div className="lock-button" onClick={() => toggleMode('locked')}>{(locked) ? 'Unlock' : 'Lock'}</div>
    <div className="persist-button" onClick={() => toggleMode('persist')}>{(persist) ? 'Unpersist' : 'Persist'}</div>
    <div className="import-button" onClick={importSnapshots}>Import</div>
    <div className="export-button" onClick={exportSnapshots}>Export</div>
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
