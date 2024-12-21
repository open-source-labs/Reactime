import * as React from 'react';
//importing useState from react to handle local state for button reconnect functionality
import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
//importing necesary material UI components for dialogue popup
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Tutorial from '../components/Buttons/Tutorial';
import { toggleMode, importSnapshots, startReconnect } from '../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import StatusDot from '../components/Buttons/StatusDot';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import { MainState, RootState } from '../FrontendTypes';
import { Lock, Unlock, Download, Upload, RefreshCw } from 'lucide-react';

function exportHandler(snapshots: []): void {
  // function that takes in our tabs[currentTab] object to be exported as a JSON file. NOTE: TypeScript needs to be updated
  const fileDownload: HTMLAnchorElement = document.createElement('a'); // invisible HTML element that will hold our tabs[currentTab] object

  fileDownload.href = URL.createObjectURL(
    // href is the reference to the URL object created from the Blob
    new Blob([JSON.stringify(snapshots)], { type: 'application/json' }), // Blob obj is raw data. The tabs[currentTab] object is stringified so the Blob can access the raw data
  );

  fileDownload.setAttribute('download', 'snapshot.json'); // We set a download attribute with snapshots.json as the file name. This allows us to download the file when the element is 'clicked.' The file will be named snapshots.json once the file is downloaded locally
  fileDownload.click(); // click is a method on all HTML elements that simulates a mouse click, triggering the element's click event

  URL.revokeObjectURL(fileDownload.href); // after file is downloaded, remove the href
}

function importHandler(dispatch: (a: unknown) => void): void {
  // function handles the importing of a tabs[currentTab] object when the upload button is selected
  const fileUpload = document.createElement('input'); // invisible HTML element that will hold our uploaded tabs[currentTab] object
  fileUpload.setAttribute('type', 'file'); // Attributes added to HTML element

  fileUpload.onchange = (e: Event) => {
    // onChange is when value of HTML element is changed
    const reader = new FileReader(); // FileReader is an object that reads contents of local files in async. It can use file or blob objects
    const eventFiles = e.target as HTMLInputElement; // uploaded tabs[currentTab] object is stored as the event.target

    if (eventFiles) {
      // if the fileUpload element has an eventFiles
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
  const dispatch = useDispatch();
  const { currentTab, tabs, currentTabInApp, connectionStatus }: MainState = useSelector(
    (state: RootState) => state.main,
  );
  //@ts-ignore
  const {
    //@ts-ignore
    mode: { paused },
  } = tabs[currentTab];

  //adding a local state using useState for the reconnect button functionality
  const [reconnectDialogOpen, setReconnectDialogOpen] = useState(false);

  //logic for handling dialog box opening and closing
  const handleReconnectClick = () => {
    setReconnectDialogOpen(true);
  };

  const handleReconnectConfirm = () => {
    handleReconnectCancel();
    dispatch(startReconnect());
  };

  const handleReconnectCancel = () => {
    //closing the dialog
    setReconnectDialogOpen(false);
  };

  useEffect(() => {
    if (!connectionStatus) setReconnectDialogOpen(true);
  }, [connectionStatus]);

  return (
    <div className='buttons-container'>
      <div className='buttons-wrapper'>
        <Button
          className='pause-button'
          type='button'
          onClick={() => dispatch(toggleMode('paused'))}
        >
          {paused ? (
            <Lock className='button-icon' size={18} />
          ) : (
            <Unlock className='button-icon' size={18} />
          )}
          {paused ? 'Locked' : 'Unlocked'}
        </Button>
        <Button
          className='export-button'
          type='button'
          //@ts-ignore
          onClick={() => exportHandler(tabs[currentTab])}
        >
          <Download className='button-icon' size={18} />
          Download
        </Button>
        <Button className='import-button' onClick={() => importHandler(dispatch)}>
          <Upload className='button-icon' size={18} />
          Upload
        </Button>
        {/* The component below renders a button for the tutorial walkthrough of Reactime */}
        <Tutorial dispatch={dispatch} currentTabInApp={currentTabInApp} />
        {/* adding a button for reconnection functionality 10/5/2023 */}
        <Button
          className='reconnect-button'
          type='button'
          //update onClick functionality to include a popup that contains....
          onClick={handleReconnectClick}
          endIcon={
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <StatusDot status={connectionStatus ? 'active' : 'inactive'} />
            </span>
          }
        >
          <RefreshCw className='button-icon' size={18} />
          Reconnect
        </Button>
        <Dialog
          className='dialog-pop-up'
          open={reconnectDialogOpen}
          onClose={handleReconnectCancel}
        >
          <div className='close-icon-pop-up-div'>
            <CloseIcon
              type='button'
              onClick={() => handleReconnectCancel()}
              className='close-icon-pop-up'
            />
          </div>
          <div className='warning-header-container'>
            <WarningIcon className='warning-icon-pop-up' />
            <DialogTitle className='dialog-pop-up-header'>WARNING</DialogTitle>
          </div>
          <DialogContent className='dialog-pop-up-contents'>
            <h3>Status: {connectionStatus ? 'Connected' : 'Disconnected'}</h3>
            {connectionStatus ? (
              <>
                Reconnecting while Reactime is still connected to the application may cause
                unforeseen issues. Are you sure you want to proceed with the reconnection?
              </>
            ) : (
              <>
                Reactime has unexpectedly disconnected from your application. To continue using
                Reactime, please reconnect.
                <br />
                <br />
                WARNING: Reconnecting can sometimes cause unforeseen issues, consider downloading
                the data before proceeding with the reconnection, if needed.
              </>
            )}
          </DialogContent>

          <DialogActions className='dialog-pop-up-actions'>
            <Button
              onClick={() => handleReconnectCancel()}
              className='cancel-button-pop-up'
              type='button'
              variant='contained'
              style={{ backgroundColor: '#474c55' }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleReconnectConfirm()}
              type='button'
              className='reconnect-button-pop-up'
              variant='contained'
              style={{ backgroundColor: '#F00008' }}
            >
              Reconnect
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default ButtonsContainer;
