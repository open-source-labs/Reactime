// @ts-nocheck
import React from 'react';

import { importSnapshots, toggleMode } from '../actions/actions';
import { useStoreContext } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faQuestion,
  faDownload,
  faMapMarker,
  faMapPin,
  faRedoAlt,
  faUnlock,
  faLock,
} from '@fortawesome/free-solid-svg-icons';

function exportHandler(snapshots: []) {
  // create invisible download anchor link
  const fileDownload = document.createElement('a');

  // set file in anchor link
  fileDownload.href = URL.createObjectURL(
    new Blob([JSON.stringify(snapshots)], { type: 'application/json' })
  );

  // set anchor as file download and click it
  fileDownload.setAttribute('download', 'snapshot.json');
  fileDownload.click();

  // remove file url
  URL.revokeObjectURL(fileDownload.href);
}

function importHandler(dispatch: (a: any) => void) {
  const fileUpload = document.createElement('input');
  fileUpload.setAttribute('type', 'file');

  fileUpload.onchange = () => {
    const reader = new FileReader();
    reader.onload = () => {
      const test = reader.result.toString();
      return dispatch(importSnapshots(JSON.parse(test)));
    };
    if (event.target.hasOwnProperty('files')) {
      const eventFiles: any = event.target;
      reader.readAsText(eventFiles.files[0]);
    }
  };

  fileUpload.click();
}

function howToUseHandler() {
  window.open('https://github.com/open-source-labs/reactime', '_blank');
  return null;
}

function ButtonsContainer() {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const {
    snapshots,
    mode: { paused, persist },
  } = tabs[currentTab];

  return (
    <div className="buttons-container">
      <button
        className="pause-button"
        type="button"
        onClick={() => dispatch(toggleMode('paused'))}
      >
        {paused ? (
          <FontAwesomeIcon icon={faUnlock} />
        ) : (
          <FontAwesomeIcon icon={faLock} />
        )}
        {paused ? 'Unlock' : 'Lock'}
      </button>
      <button
        className="persist-button"
        type="button"
        onClick={() => dispatch(toggleMode('persist'))}
      >
        {persist ? (
          <FontAwesomeIcon icon={faRedoAlt} />
        ) : (
          <FontAwesomeIcon icon={faMapPin} />
        )}
        {persist ? 'Unpersist' : 'Persist'}
      </button>
      <button
        className="export-button"
        type="button"
        onClick={() => exportHandler(snapshots)}
      >
        <FontAwesomeIcon icon={faDownload} />
        Download
      </button>
      <button
        className="import-button"
        type="button"
        onClick={() => importHandler(dispatch)}
      >
        <FontAwesomeIcon icon={faUpload} />
        Upload
      </button>
      <button
        className="howToUse-button"
        type="button"
        onClick={() => howToUseHandler()}
      >
        <FontAwesomeIcon icon={faQuestion} /> How to use
      </button>
    </div>
  );
}

export default ButtonsContainer;
