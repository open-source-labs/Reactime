// @ts-nocheck
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Steps, Hints } from 'intro.js-react';
import 'intro.js/introjs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faQuestion,
} from '@fortawesome/free-solid-svg-icons';

export default function Tutorial(): JSX.Element {
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
      intro: '<ul><li>Please visit our official Github Repo for more information </li><br> <li><a href="https://github.com/open-source-labs/reactime" target="_blank">Reactime Github</a></li></ul>',
      position: 'top',
    },
  ]);

  const onExit = () => {
    setStepsEnabled(false);
  };
  const startIntro = () => {
    setStepsEnabled(true);
  };

  return (
    <>
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={initialStep}
        onExit={onExit}
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
          overlayOpacity: 0.65,
        }}
      />

      <button
        className="howToUse-button"
        type="button"
        onClick={() => startIntro()}
      >
        <FontAwesomeIcon icon={faQuestion} />
        {' '}
        How to use
      </button>
    </>

  );
}
