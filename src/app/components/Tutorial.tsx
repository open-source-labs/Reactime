// @ts-nocheck
import * as React from 'react';
import { Component } from 'react';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { tutorialSaveSeriesToggle, setCurrentTabInApp } from '../actions/actions';

// This is the tutorial displayed when the "How to use" button is clicked
// This needs to be a class component to be compatible with updateStepElement from intro.js
class Tutorial extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepsEnabled: false,
    };
  }

  render() {
    const { currentTabInApp, dispatch } = this.props;

    // This updates the steps so that they can target dynamically rendered elements
    const onChangeHandler = currentStepIndex => {
      if (currentTabInApp === 'performance' && currentStepIndex === 1) {
        dispatch(tutorialSaveSeriesToggle('inputBoxOpen'));
        this.steps.updateStepElement(currentStepIndex);
      }
      if (currentTabInApp === 'performance' && currentStepIndex === 2) {
        this.steps.updateStepElement(currentStepIndex);
      }
      if (currentTabInApp === 'performance' && currentStepIndex === 4) {
        dispatch(tutorialSaveSeriesToggle('saved'));
        this.steps.updateStepElement(currentStepIndex);
      }
      if (currentTabInApp === 'performance' && currentStepIndex === 5) {
        this.steps.updateStepElement(currentStepIndex);
        dispatch(setCurrentTabInApp('performance-comparison'));
      }
      if (currentTabInApp === 'performance-comparison' && currentStepIndex === 6) {
        dispatch(tutorialSaveSeriesToggle(false));
      }
    };

    const onExit = () => {
      this.setState({ stepsEnabled: false });
    };
    const startIntro = () => {
      // If "How to use" is clicked while in the performance tab, we'll navigate to the snapshops view before starting the tutorial
      // This is because the tutorial steps are designed to begin on the snapshots sub-tab
      // Check out the PerformanceVisx component to see the route redirect logic
      if (currentTabInApp === 'performance' || currentTabInApp === 'performance-comparison' || currentTabInApp === 'performance-component-details') {
        dispatch(setCurrentTabInApp('performance'));
      }
      this.setState({ stepsEnabled: true });
    };
    let steps = [];

    switch (currentTabInApp) {
      case 'map':
        steps = [{
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
          title: 'Toggle Record Button',
          element: '#recordBtn',
          intro: '<ul><li>Toggle record button to pause state changes on target application</li></ul>',
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
          intro: '<ul><li>User can save a series of state snapshots and use it to analyze changes in component, render performance between current, and previous series of snapshots.</li> <li>User can save a series of state snapshots and use it to analyze changes in component render performance between current and previous series of snapshots.</li> <li>TIP: Click the how to use button within the performance tab for more details.</li> </ul>',
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
        }];
        break;
      case 'performance':
        steps = [{
          title: 'Performance Tab',
          element: '.bargraph-position',
          intro: '<ul><li>Here we can analyze the render times of our app</li> <li>This is the current series of state changes within our app</li> <li>Mouse over the bargraph elements for details on each specific component</li></ul>',
          position: 'top',
        },
        {
          title: 'Saving Series & Actions',
          element: '.save-series-button',
          intro: '<ul><li>Click here to save your current series data</li></ul>',
          position: 'top',
        },
        {
          title: 'Saving Series & Actions',
          element: '#seriesname',
          intro: '<ul><li>We can now give our series a name or leave it at the default</li></ul>',
          position: 'top',
        },
        {
          title: 'Saving Series & Actions',
          element: '.actionname',
          intro: '<ul><li>If we wish to save a specific action to compare later, give it a name here</li></ul>',
          position: 'top',
        },
        {
          title: 'Saving Series & Actions',
          element: '.save-series-button',
          intro: '<ul><li>Press save series again.</li> <li>Your series and actions are now saved!</li></ul>',
          position: 'top',
        },
        {
          title: 'Comparison Tab',
          element: '#router-link-performance-comparison',
          intro: '<ul><li>Now let\'s head over to the comparison tab</li></ul>',
          position: 'top',
        },
        {
          title: 'Comparing Series',
          intro: '<ul><li>Here we can select a saved series or action to compare</li></ul>',
          position: 'top',
        }];
        break;
      default:
        steps = [{
          title: 'No Tutorial For This Tab',
          intro: '<ul><li>A tutorial for this tab has not yet been created</li><li>Please visit our official Github Repo for more information </li><br> <li><a href="https://github.com/open-source-labs/reactime" target="_blank">Reactime Github</a></li></ul>',
          position: 'top',
        }];
        break;
    }

    return (
      <>
        <Steps
          enabled={this.state.stepsEnabled}
          steps={steps}
          initialStep={0}
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
          onBeforeChange={currentStepIndex => onChangeHandler(currentStepIndex)}
          ref={steps => (this.steps = steps)}
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
}

export default Tutorial;
