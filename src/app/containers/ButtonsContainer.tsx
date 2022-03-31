// @ts-nocheck
import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUpload,
  faQuestion,
  faDownload,
  faSquare,
  faColumns,
  faUnlock,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import { Steps, Hints } from 'intro.js-react';
import { importSnapshots, toggleMode, toggleSplit } from '../actions/actions';
import { useStoreContext } from '../store';

import 'intro.js/introjs.css';

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

function ButtonsContainer(): JSX.Element {
  const [{ tabs, currentTab, split }, dispatch] = useStoreContext();
  const {
    snapshots,
    mode: { paused, persist },
  } = tabs[currentTab];

  const [stepsEnabled, setStepsEnabled] = useState(false);
  const [initialStep, setInitialStep] = useState(0);
  const [steps, setSteps] = useState([
    {
      title: 'Reactime Tutorial',
      intro: 'A performance and state managment tool for React apps.',
      position: 'top',
    },
    {
      title: 'Actions',
      element: '.action-container',
      intro: "<ul><li>Reactime records a snapshot whenever a target application's state is changed</li></ul>",
      position: 'right',
    },
    {
      element: '.individual-action',
      title: 'Snapshot',
      intro: '<ul><li>Each snapshot allows the user to jump to any previously recorded state.</li> <li>It also detects the amount of renders of each component and average time of rendering</li></ul>.',
      position: 'right',
    },
    {
      title: 'Timejump',
      element: '.rc-slider',
      intro: '<ul><li>Use the slider to go back in time to a particular state change</li><li>Click the Play button to run through each state change automatically</li></ul>',
      position: 'top',
    },
    {
      title: 'Lock Button',
      element: '.pause-button',
      intro: '<ul><li>Use button to lock Reactime to the target application\'s tab in the Chrome Browser</li></ul>',
      position: 'top',
    },
    {
      title: 'Split Button',
      element: '.split-button',
      intro: '<ul> <li>Use button to split Reactime into two windows in order to view multiple tabs simultaneously</li> </ul>',
      position: 'top',
    },
    {
      title: 'Download Button',
      element: '.export-button',
      intro: '<ul><li>Use button to download a JSON file of all snapshots</li> </ul>',
      position: 'top',
    },
    {
      title: 'Upload Button',
      element: '.import-button',
      intro: '<ul><li>Use button to upload a previously downloaded JSON file for snapshot comparisons</li></ul>',
      position: 'top',
    },
    {
      element: '.map-tab',
      title: 'Map Tab',
      intro: '<ul><li>This tab visually displays a component hierarchy tree for your app</li></ul>',
      position: 'bottom',
    },
    {
      title: 'Performance Tab',
      element: '.performance-tab',
      intro: '<ul><li>User can save a series of state snapshots and use it to analyze changes in component, render performance between current, and previous series of snapshots.</li> <li>User can save a series of state snapshots and use it to analyze changes in component render performance between current and previous series of snapshots.</li></ul>',
      position: 'bottom',
    },
    {
      title: 'History Tab',
      element: '.history-tab',
      intro: '<ul><li>This tab visually displays a history of each snapshot</li></ul>',
      position: 'bottom',
    },
    {
      title: 'Web Metrics Tab',
      element: '.web-metrics-tab',
      intro: '<ul> <li>This tab visually displays performance metrics and allows the user to gauge efficiency of their application</li></ul>',
      position: 'bottom',
    },
    {
      title: 'Tree Tab',
      element: '.tree-tab',
      intro: '<ul><li>This tab visually displays a JSON Tree containing the different components and states</li></ul>',
      position: 'bottom',
    },
    {
      title: 'Tutorial Complete',
      intro: 'Please visit our official Github Repo for more information <br> <a href="https://github.com/open-source-labs/reactime" target="_blank">Reactime Github</a>',
      position: 'top',
    },
  ]);

  const onExit = () => {
    setStepsEnabled(false);
  };
  const startIntro = () => {
    setStepsEnabled(true);
  };

  // const onbeforechange = (targetElement) => {
  //   steps.forEach((step, key) => {
  //     if (step.element) {
  //       steps[key].element = document.querySelector(step.element);
  //       steps[key].position = step.position ? step.position : 'bottom';
  //     }
  //   });
  // };

  // const onBeforeChange = nextStepIndex => {
  //   if (nextStepIndex === 2) {
  //     steps.updateStepElement(nextStepIndex);
  //   }
  const walkthrough = useRef(null);
  // useEffect(() => {
  //   if (walkthrough.current) {
  //     console.log('Test ');
  //   }
  // }, [walkthrough.current]);

  return (
    <div className="buttons-container">
      {/* <button type="submit" onClick={() => }>Click me</button> */}
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={initialStep}
        onExit={onExit}
        ref={walkthrough}
        options={{
          tooltipClass: 'customTooltip',
          scrollToElement: false,
          showProgress: true,
          showStepNumbers: true,
          showBullets: false,
          exitOnOverlayClick: false,
          doneLabel: 'Done',
          nextLabel: 'Next',
          hideNext: false,
          skipLabel: 'Skip',
          keyboardNavigation: true,
        }}
      />
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

      {/* removing the UI for now Defunt perist feauture. See docs for more info */}
      {/* <button
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
      </button> */}

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
        onClick={() => startIntro()}
      >
        <FontAwesomeIcon icon={faQuestion} />
        {' '}
        How to use
      </button>
    </div>
  );
}

export default ButtonsContainer;
