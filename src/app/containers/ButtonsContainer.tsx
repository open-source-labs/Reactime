import * as React from 'react';
// import { importSnapshots, toggleMode } from '../actions/actions';
// import { useStoreContext } from '../store';
import { Button } from '@mui/material';
import Tutorial from '../components/Tutorial';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { toggleMode, importSnapshots } from '../RTKslices';
import { useDispatch, useSelector } from 'react-redux';

function exportHandler(snapshots: []): void { // function that takes in our tabs[currentTab] object to be exported as a JSON file. NOTE: TypeScript needs to be updated
  const fileDownload: HTMLAnchorElement = document.createElement('a'); // invisible HTML element that will hold our tabs[currentTab] object

  fileDownload.href = URL.createObjectURL( // href is the reference to the URL object created from the Blob
    new Blob([JSON.stringify(snapshots)], { type: 'application/json' }), // Blob obj is raw data. The tabs[currentTab] object is stringified so the Blob can access the raw data
  );

  fileDownload.setAttribute('download', 'snapshot.json'); // We set a download attribute with snapshots.json as the file name. This allows us to download the file when the element is 'clicked.' The file will be named snapshots.json once the file is downloaded locally
  fileDownload.click(); // click is a method on all HTML elements that simulates a mouse click, triggering the element's click event

  URL.revokeObjectURL(fileDownload.href); // after file is downloaded, remove the href
}

function importHandler(dispatch: (a: unknown) => void): void { // function handles the importing of a tabs[currentTab] object when the upload button is selected
  const fileUpload = document.createElement('input'); // invisible HTML element that will hold our uploaded tabs[currentTab] object
  fileUpload.setAttribute('type', 'file'); // Attributes added to HTML element

  fileUpload.onchange = (e: Event) => { // onChange is when value of HTML element is changed
    const reader = new FileReader(); // FileReader is an object that reads contents of local files in async. It can use file or blob objects
    const eventFiles = e.target as HTMLInputElement; // uploaded tabs[currentTab] object is stored as the event.target
   
    if (eventFiles) { // if the fileUpload element has an eventFiles
      reader.readAsText(eventFiles.files[0]); // the reader parses the file into a string and stores it within the reader object
    }

    reader.onload = () => {
      const test = reader.result.toString(); // once the local file has been loaded, result property on FileReader object returns the file's contents and then converts the file contents to a string
      return dispatch(importSnapshots(JSON.parse(test))); // dispatch sends the result of of converting our tabs[currentTab] object => string => JSON Object. This updates the current tab
    };
  };

  fileUpload.click(); // click is a method on all HTML elements that simulates a mouse click, triggering the element's click event
}

function ButtonsContainer(): JSX.Element {
  // const [{ tabs, currentTab, currentTabInApp }, dispatch] = useStoreContext();
  // const [state, dispatch] = useStoreContext();
  const dispatch = useDispatch();
  const currentTab = useSelector((state: any) => state.main.currentTab);
  const tabs = useSelector((state: any)=>state.main.tabs);
  const currentTabInApp = useSelector((state: any)=> state.main.currentTabInApp);
  const { mode: { paused }} = tabs[currentTab];
  
  return (
    <div className='buttons-container'>
      <Button
        variant='outlined'
        className='pause-button'
        type='button'
        onClick={() => dispatch(toggleMode('paused'))}
      >
        {paused ? <LockIcon sx={{ pr: 1 }} /> : <LockOpenIcon sx={{ pr: 1 }} />}
        {paused ? 'Locked' : 'Unlocked'}
      </Button>
      <Button
        variant='outlined'
        className='export-button'
        type='button'
        onClick={() => exportHandler(tabs[currentTab])}
      >
        <FileDownloadIcon sx={{ pr: 1 }} />
        Download
      </Button>
      <Button variant='outlined' className='import-button' onClick={() => importHandler(dispatch)}>
        <FileUploadIcon sx={{ pr: 1 }} />
        Upload
      </Button>
      {/* The component below renders a button for the tutorial walkthrough of Reactime */}
      <Tutorial
      //commented out so we can use useDispatch in Tutorial.tsx
       dispatch={dispatch} 
       currentTabInApp={currentTabInApp} />
    </div>
  );
}

export default ButtonsContainer;
