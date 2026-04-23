import * as React from 'react';
import { Button } from '@mui/material';
import Tutorial from '../components/Buttons/Tutorial';
import { toggleMode, importSnapshots, startReconnect } from '../slices/mainSlice';
import { useDispatch, useSelector } from 'react-redux';
import StatusDot from '../components/Buttons/StatusDot';
import { MainState, RootState } from '../FrontendTypes';
import { Lock, Unlock, Download, Upload, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { REACTIME_TOAST_DEFAULTS } from '../utils/toastConfig';

/**
 * Builds a stable, human-readable filename for exported sessions so the
 * toast can show users exactly what ended up in their Downloads folder
 * (and so multiple exports don't silently overwrite each other).
 */
function buildExportFilename(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');
  return `reactime-session-${yyyy}-${mm}-${dd}-${hh}${mi}.json`;
}

function exportHandler(snapshots: []): void {
  const filename = buildExportFilename();
  const fileDownload: HTMLAnchorElement = document.createElement('a');
  fileDownload.href = URL.createObjectURL(
    new Blob([JSON.stringify(snapshots)], { type: 'application/json' }),
  );
  fileDownload.setAttribute('download', filename);
  fileDownload.click();
  URL.revokeObjectURL(fileDownload.href);

  // `snapshots` here is the current tab's state object (see call site passing
  // tabs[currentTab]), not a tabs map. Its `.snapshots` field is the actual
  // array used for time travel — that's the count the user cares about.
  const tabData = snapshots as unknown as { snapshots?: unknown[] } | null | undefined;
  const snapshotCount = Array.isArray(tabData?.snapshots) ? tabData.snapshots.length : 0;

  toast.success(
    snapshotCount > 0
      ? `Exported ${snapshotCount} snapshot${snapshotCount === 1 ? '' : 's'} to ${filename}`
      : `Exported session to ${filename}`,
    { ...REACTIME_TOAST_DEFAULTS, duration: 3500, id: 'session-exported' },
  );
}

/**
 * Reads a file and resolves with the parsed snapshot payload, or rejects
 * with a descriptive error. Split out so importHandler can wrap it with
 * toast.promise for loading/success/error UX.
 */
function readAndParseFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result?.toString() ?? '';
        resolve(JSON.parse(text));
      } catch (err) {
        reject(new Error('Invalid session file (not valid JSON)'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Counts snapshots in a parsed import payload (the export shape is a single
 * tab-state object with a `.snapshots` array). Used for the success-toast copy.
 */
function countSnapshotsInPayload(payload: unknown): number {
  if (!payload || typeof payload !== 'object') return 0;
  const snaps = (payload as { snapshots?: unknown[] }).snapshots;
  return Array.isArray(snaps) ? snaps.length : 0;
}

function importHandler(dispatch: (a: unknown) => void): void {
  const fileUpload = document.createElement('input');
  fileUpload.setAttribute('type', 'file');
  fileUpload.setAttribute('accept', '.json,application/json');

  fileUpload.onchange = (e: Event) => {
    const eventFiles = e.target as HTMLInputElement;
    const file = eventFiles?.files?.[0];
    // If the user cancelled the picker, do nothing (no toast spam).
    if (!file) return;

    const importPromise = readAndParseFile(file).then((parsed) => {
      dispatch(importSnapshots(parsed));
      return countSnapshotsInPayload(parsed);
    });

    toast.promise(
      importPromise,
      {
        loading: `Importing ${file.name}...`,
        success: (count: number) =>
          count > 0
            ? `Imported ${count} snapshot${count === 1 ? '' : 's'}`
            : 'Imported session',
        error: (err: Error) => err?.message || 'Import failed',
      },
      {
        id: 'session-import',
        style: REACTIME_TOAST_DEFAULTS.style,
        position: REACTIME_TOAST_DEFAULTS.position,
        success: { duration: 3000, iconTheme: REACTIME_TOAST_DEFAULTS.iconTheme },
        error: { duration: 4500 },
      },
    );
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
      ...REACTIME_TOAST_DEFAULTS,
      duration: 2000,
      id: 'reconnect-success',
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
