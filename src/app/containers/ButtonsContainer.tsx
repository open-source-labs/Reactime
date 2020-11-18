/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-globals */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
// @ts-nocheck
import React from 'react';

import { importSnapshots, toggleMode } from '../actions/actions';
import { useStoreContext } from '../store';

function exportHandler(snapshots:[]) {
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

function importHandler(dispatch:(a:any)=>void) {
  const fileUpload = document.createElement('input');
  fileUpload.setAttribute('type', 'file');

  fileUpload.onchange = () => {
    const reader = new FileReader();
    reader.onload = () => {
      const test = reader.result.toString();
      return dispatch(importSnapshots(JSON.parse(test)));
    };
    if (event.target.hasOwnProperty('files')) {
      const eventFiles:any = event.target;
      reader.readAsText(eventFiles.files[0]);
    }
  };

  fileUpload.click();
}

function ButtonsContainer() {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const {
    snapshots,
    mode: { paused, locked, persist },
  } = tabs[currentTab];

  return (
    <div className="buttons-container">
      <button className="pause-button" type="button" onClick={() => dispatch(toggleMode('paused'))}>
        {paused ? 'Resume' : 'Pause'}
      </button>
      <button className="lock-button" type="button" onClick={() => dispatch(toggleMode('locked'))}>
        {locked ? 'Unlock' : 'Lock'}
      </button>
      <button
        className="persist-button"
        type="button"
        onClick={() => dispatch(toggleMode('persist'))}
      >
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
}

export default ButtonsContainer;
