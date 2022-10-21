import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faDownload,
  faSquare,
  faColumns,
  faUnlock,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { importSnapshots, toggleMode, toggleSplit } from '../actions/actions';
import { useStoreContext } from '../store';

import Tutorial from '../components/Tutorial';

function exportHandler(snapshots: []) {
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

function importHandler(dispatch: (a: unknown) => void) {
  const fileUpload = document.createElement('input');
  fileUpload.setAttribute('type', 'file');

  fileUpload.onchange = (e: Event) => {
    const reader = new FileReader();
    reader.onload = () => {
      const test = reader.result.toString();
      return dispatch(importSnapshots(JSON.parse(test)));
    };
    const eventFiles = e.target as HTMLInputElement;
    if (eventFiles?.hasOwnProperty('files')) {
      // const eventFiles = target as HTMLInputElement;
      if (eventFiles) {
        reader.readAsText(eventFiles.files[0]);
      }
    }
  };

  fileUpload.click();
}

function ButtonsContainer(): JSX.Element {
  const [{ tabs, currentTab, split, currentTabInApp }, dispatch] = useStoreContext();
  const {
    snapshots,
    mode: { paused },
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
        className="split-button"
        type="button"
        onClick={() => dispatch(toggleSplit())}
      >
        {split ? (
          <FontAwesomeIcon icon={faSquare} />
        ) : (
          <FontAwesomeIcon icon={faColumns} />
        )}
        {split ? 'Unsplit' : 'Split'}
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
      {/* The component below renders a button for the tutorial walkthrough of Reactime */}
      <Tutorial dispatch={dispatch} currentTabInApp={currentTabInApp} />
    </div>
  );
}

export default ButtonsContainer;
