import React from 'react';
import PropTypes from 'prop-types';

import {
  importSnapshots, toggleLock, togglePause, togglePersist,
} from '../actions/actions';

function exportHandler(snapshots) {
  // create invisible download anchor link
  const fileDownload = document.createElement('a');

  // set file in anchor link
  fileDownload.href = URL.createObjectURL(
    new Blob([JSON.stringify(snapshots)], { type: 'application/json' }),
  );

  // set anchor as file download and click it
  fileDownload.setAttribute('download', 'snapshot.json');
  fileDownload.click();

  // remove file url
  URL.revokeObjectURL(fileDownload.href);
}

function importHandler(dispatch) {
  const fileUpload = document.createElement('input');
  fileUpload.setAttribute('type', 'file');

  fileUpload.onchange = (event) => {
    const reader = new FileReader();
    reader.onload = () => dispatch(importSnapshots(JSON.parse(reader.result)));
    reader.readAsText(event.target.files[0]);
  };

  fileUpload.click();
}

const ButtonsContainer = ({
  mode: { paused, locked, persist },
  dispatch,
  snapshots,
}) =>
  (
    <div className="buttons-container">
      <button className="pause-button" type="button" onClick={() => dispatch(togglePause())}>
        {paused ? 'Resume' : 'Pause'}
      </button>
      <button className="lock-button" type="button" onClick={() => dispatch(toggleLock())}>
        {locked ? 'Unlock' : 'Lock'}
      </button>
      <button className="persist-button" type="button" onClick={() => dispatch(togglePersist())}>
        {persist ? 'Unpersist' : 'Persist'}
      </button>
      <button className="export-button" type="button" onClick={() => exportHandler(snapshots)}>
        Export
      </button>
      <button className="import-button" type="button" onClick={() => importHandler(dispatch)}>
        Import
      </button>
    </div>
  );

ButtonsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  snapshots: PropTypes.arrayOf(
    PropTypes.object,
  ).isRequired,
  mode: PropTypes.shape({
    paused: PropTypes.bool,
    locked: PropTypes.bool,
    persist: PropTypes.bool,
  }).isRequired,
};

export default ButtonsContainer;
