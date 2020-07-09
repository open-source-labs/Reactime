import React from 'react';

import { importSnapshots, toggleMode } from '../actions/actions.ts';
import { useStoreContext } from '../store.tsx';

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

function importHandler(dispatch:(a:()=>void)=>void) {
  const fileUpload = document.createElement('input');
  fileUpload.setAttribute('type', 'file');

  fileUpload.onchange = (event:{target:{files:[]}}) => {
    const reader = new FileReader();
    reader.onload = () => dispatch(importSnapshots(JSON.parse(reader.result)));
    reader.readAsText(event.target.files[0]);
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
      <button className="pause-button" type="button" onClick={(e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => dispatch(toggleMode('paused'))}>
        {paused ? 'Resume' : 'Pause'}
      </button>
      <button className="lock-button" type="button" onClick={(e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => dispatch(toggleMode('locked'))}>
        {locked ? 'Unlock' : 'Lock'}
      </button>
      <button
        className="persist-button"
        type="button"
        onClick={(e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => dispatch(toggleMode('persist'))}
      >
        {persist ? 'Unpersist' : 'Persist'}
      </button>
      <button className="export-button" type="button" onClick={(e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => exportHandler(snapshots)}>
        Export
      </button>
      <button className="import-button" type="button" onClick={(e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => importHandler(dispatch)}>
        Import
      </button>
    </div>
  );
}

export default ButtonsContainer;
