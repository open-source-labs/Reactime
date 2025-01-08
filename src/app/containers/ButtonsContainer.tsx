import * as React from 'react';
import { Button } from '@mui/material';
import Tutorial from '../components/Buttons/Tutorial';
import { toggleMode, importSnapshots, startReconnect } from '../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import StatusDot from '../components/Buttons/StatusDot';
import { MainState, RootState } from '../FrontendTypes';
import { Lock, Unlock, Download, Upload, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

function exportHandler(snapshots: []): void {
  const fileDownload: HTMLAnchorElement = document.createElement('a');
  fileDownload.href = URL.createObjectURL(
    new Blob([JSON.stringify(snapshots)], { type: 'application/json' }),
  );
  fileDownload.setAttribute('download', 'snapshot.json');
  fileDownload.click();
  URL.revokeObjectURL(fileDownload.href);
}

function importHandler(dispatch: (a: unknown) => void): void {
  const fileUpload = document.createElement('input');
  fileUpload.setAttribute('type', 'file');

  fileUpload.onchange = (e: Event) => {
    const reader = new FileReader();
    const eventFiles = e.target as HTMLInputElement;

    if (eventFiles) {
      reader.readAsText(eventFiles.files[0]);
    }

    reader.onload = () => {
      const test = reader.result.toString();
      return dispatch(importSnapshots(JSON.parse(test)));
    };
  };

  fileUpload.click();
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

  const handleReconnect = () => {
    dispatch(startReconnect());
    toast.success('Successfully reconnected', {
      duration: 2000,
      position: 'top-right',
      style: {
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
      },
      iconTheme: {
        primary: 'var(--color-primary)',
        secondary: 'var(--text-primary)',
      },
    });
  };

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
        <Tutorial dispatch={dispatch} currentTabInApp={currentTabInApp} />
        <Button
          className='reconnect-button'
          type='button'
          onClick={handleReconnect}
          endIcon={
            <span style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <StatusDot status={connectionStatus ? 'active' : 'inactive'} />
            </span>
          }
        >
          <RefreshCw className='button-icon' size={18} />
          Reconnect
        </Button>
      </div>
    </div>
  );
}

export default ButtonsContainer;
