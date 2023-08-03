import * as React from 'react';
import { importSnapshots, toggleMode } from '../actions/actions';
import { useStoreContext } from '../store';
import { Button } from '@mui/material';

import Tutorial from '../components/Tutorial';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';


// function exportHandler takes in a parameter snapshots which is typed as an array
// the function does not return anything so the type is void
function exportHandler(snapshots: []): void {
  // create invisible download anchor link
  // fileDownload is typed as HTMLAnchorElement
  // HTML anchor element has the <a></a> tag
  const fileDownload: HTMLAnchorElement = document.createElement('a');

  // set file in anchor link
  // href is the reference to the URL object created from the Blob
  fileDownload.href = URL.createObjectURL(
    // Blob obj is raw data, json is raw, stringify the snapshots as json so the Blob can access the raw data
    new Blob([JSON.stringify(snapshots)], { type: 'application/json' }),
  );

  // set anchor as file download and click it
  // anchor element has a download attribute
  // snapshot.json is what the file name will be once the file is downloaded locally
  fileDownload.setAttribute('download', 'snapshot.json');
  // click is a method on all HTML elements
  // simulates a mouse click, triggering the element's click event
  fileDownload.click();

  // remove file url
  // after file is downloaded, remove the href
  URL.revokeObjectURL(fileDownload.href);
}

function importHandler(dispatch: (a: unknown) => void): void {
  // create input element
  // fileUpload is HTMLInputElement, which is an interface for HTML input elements
  // accepts data from user
  const fileUpload = document.createElement('input');
  // file is a type attribute on the input element, allows users to select a file
  console.log('fileUpload element:', fileUpload)
  fileUpload.setAttribute('type', 'file');

  // onChange is when value of HTML element is changed
  // parameter for onChange is an event
  fileUpload.onchange = (e: Event) => {
    // FileReader is an object
    // reads contents of local files in async
    // can use file or blob objects
    const reader = new FileReader();
    console.log('on change triggered')
    //console.log('reader :', reader);

    const eventFiles = e.target as HTMLInputElement;
    // console.log('e.target:', e.target)
    // console.log('event files:', eventFiles.files[0]);
   
    if (eventFiles) {
      reader.readAsText(eventFiles.files[0]);
    }

    reader.onload = () => {
      // once the local file has been loaded, result property on FileReader object returns the file's contents
      // then take contents and convert to a string
      console.log('on load triggered:')
      const test = reader.result.toString();
      // dispatch sends the result of calling importSnapshots on the json parsed data from the file contents from the new FileReader object
      // importSnapshots defined in actions/actions.ts/line 71, it returns an action object with a type and payload, payload is newSnaps parameter
      // dispatch function is being called with that action object which gets sent to the reducer in reducers/mainReducer.js/line 203
      // this updates the current tab
      return dispatch(importSnapshots(JSON.parse(test)));
    };
    // const eventFiles = e.target as HTMLInputElement;
    // if (eventFiles?.hasOwnProperty('files')) {
    //   // const eventFiles = target as HTMLInputElement;
    //   if (eventFiles) {
    //     reader.readAsText(eventFiles.files[0]);
    //   }
    // }
  };

  fileUpload.click();
  //console.log('dispatch importSnapshots successful')
}

function ButtonsContainer(): JSX.Element {
  const [{ tabs, currentTab, currentTabInApp }, dispatch] = useStoreContext();
  const {
    snapshots,
    mode: { paused },
  } = tabs[currentTab];

  console.log('----state after any change----', tabs[currentTab])

  return (
    <div className='buttons-container'>
      <Button
        variant='outlined'
        className='pause-button'
        type='button'
        onClick={() => dispatch(toggleMode('paused'))}
      >
        {paused ? <LockIcon sx={{pr: 1}}/> : <LockOpenIcon sx={{pr: 1}}/>}
        {paused ? 'Locked' : 'Unlocked'}
      </Button>
      <Button
        variant='outlined'
        className='export-button'
        type='button'
        onClick={() => exportHandler(tabs[currentTab])}
      >
        <FileDownloadIcon sx={{pr: 1}}/>
        Download
      </Button>
      <Button variant='outlined' className='import-button' onClick={() => importHandler(dispatch)}>
        <FileUploadIcon sx={{pr: 1}}/>
        Upload
      </Button>
      {/* The component below renders a button for the tutorial walkthrough of Reactime */}
      <Tutorial dispatch={dispatch} currentTabInApp={currentTabInApp} />
    </div>
  );
}

export default ButtonsContainer;
