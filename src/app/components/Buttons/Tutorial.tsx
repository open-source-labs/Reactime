/* eslint-disable react/sort-comp */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/static-property-placement */

import * as React from 'react';
import { Component } from 'react';
import 'intro.js/introjs.css';
import { TutorialProps, TutorialState, StepsObj } from '../../FrontendTypes';
import { Button } from '@mui/material';
const { Steps } = require('intro.js-react');
import { setCurrentTabInApp, tutorialSaveSeriesToggle } from '../../slices/mainSlice';
import { HelpCircle } from 'lucide-react';

/*
  This is the tutorial displayed when the "How to use" button is clicked
  This needs to be a class component to be compatible with updateStepElement from intro.js

  currently written as class components vs functional components.
*/

export default class Tutorial extends Component<TutorialProps, TutorialState> {
  constructor(props: TutorialProps) {
    super(props);
    this.state = {
      stepsEnabled: false,
    };
  }

  //tutorial class needs these public variables to be a valid class component for ts when rendered in buttonscontainer.tsx
  public context: any;
  public setState: any;
  public forceUpdate: any;
  public props: any;
  public state: any;
  public refs: any;

  render(): JSX.Element {
    const {
      currentTabInApp, // 'currentTabInApp' from 'ButtonsContainer' after useSelector()
      dispatch, // 'dispatch' from 'ButtonsContainer' after useDispatch()
    } = this.props;

    // This updates the steps so that they can target dynamically rendered elements
    const onChangeHandler = (currentStepIndex: number) => {
      // takes in the current step and updates the tab[currentTab]'s seriesSavedStatus based on conditions and updates the element associated with the step.
      if (currentTabInApp === 'performance' && currentStepIndex === 1) {
        dispatch(tutorialSaveSeriesToggle('inputBoxOpen')); // sends a dispatch that update's tab[currentTab]'s 'seriesSavedStatus' to 'inputBoxOpen'
        this.steps.updateStepElement(currentStepIndex); // Built in intro.js API that updates element associated with step
      }

      if (currentTabInApp === 'performance' && currentStepIndex === 2) {
        this.steps.updateStepElement(currentStepIndex);
      }

      if (currentTabInApp === 'performance' && currentStepIndex === 4) {
        dispatch(tutorialSaveSeriesToggle('saved')); // sends a dispatch that update's tab[currentTab]'s 'seriesSavedStatus' to 'saved'
        this.steps.updateStepElement(currentStepIndex);
      }

      if (currentTabInApp === 'performance' && currentStepIndex === 5) {
        this.steps.updateStepElement(currentStepIndex);
        dispatch(setCurrentTabInApp('performance-comparison')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'performance-comparison.' to facilitate render.
      }

      if (currentTabInApp === 'performance-comparison' && currentStepIndex === 6) {
        dispatch(tutorialSaveSeriesToggle(false)); // sends a dispatch that update's tab[currentTab]'s 'seriesSavedStatus' to the boolean 'false'
      }
    };

    const onExit = () => {
      // This callback is called when the tutorial exits
      this.setState({ stepsEnabled: false }); // sets stepsEnabled to false in this component's state
    };

    const startIntro = () => {
      // If "How to use" is clicked while in the performance tab, we'll navigate to the snapshops view before starting the tutorial. This is because the tutorial steps are designed to begin on the snapshots sub-tab. Check out the 'PerformanceVisx' component to see the route redirect logic
      if (
        currentTabInApp === 'performance' ||
        currentTabInApp === 'performance-comparison' ||
        currentTabInApp === 'performance-component-details'
      ) {
        dispatch(setCurrentTabInApp('performance')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'performance' to facilitate render.
      }
      this.setState({ stepsEnabled: true }); // sets stepsEnabled to false in this component's state
    };

    let steps: StepsObj[] = []; // the steps array will be populated with tutorial elements based on the 'currentTabInApp' case. This allows for specific tutorials based on the current page the user is viewing.

    switch (currentTabInApp) {
      case 'map':
        steps = [
          {
            title: 'Reactime Tutorial',
            intro: 'A performance and state management tool for React apps.',
            position: 'top',
          },
          {
            title: 'Actions',
            element: '.action-container',
            intro:
              "<ul><li>Reactime records a snapshot whenever a target application's state is changed</li></ul>",
            position: 'right',
          },
          {
            title: 'Toggle Record Button',
            element: '.record-button-container',
            intro:
              '<ul><li>Toggle record button to pause state changes on target application</li></ul>',
            position: 'right',
          },
          {
            title: 'Dropdown Menu',
            element: '.css-13cymwt-control',
            intro: '<ul><li>Dropdown Menu for picking between Timejump and UseContext</li></ul>',
            position: 'right',
          },
          {
            element: '.individual-action',
            title: 'Snapshot',
            intro:
              '<ul><li>Each snapshot allows the user to jump to any previously recorded state.</li> <li>It also detects the amount of renders of each component and average time of rendering</li></ul>.',
            position: 'right',
          },
          {
            title: 'Timejump',
            element: '.rc-slider',
            intro:
              '<ul><li>Use the slider to go back in time to a particular state change</li><li>Click the Play button to run through each state change automatically</li></ul>',
            position: 'top',
          },
          {
            title: 'Lock Button',
            element: '.pause-button',
            intro:
              "<ul><li>Use button to lock Reactime to the target application's tab in the Chrome Browser</li></ul>",
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
            intro:
              '<ul><li>Use button to upload a previously downloaded JSON file for snapshot comparisons</li></ul>',
            position: 'top',
          },
          {
            element: '.map-tab',
            title: 'Map Tab',
            intro:
              '<ul><li>This tab visually displays a component hierarchy tree for your app</li></ul>',
            position: 'bottom',
          },
          {
            title: 'Performance Tab',
            element: '.performance-tab',
            intro:
              '<ul><li>User can save a series of state snapshots and use it to analyze changes in component, render performance between current, and previous series of snapshots.</li> <li>User can save a series of state snapshots and use it to analyze changes in component render performance between current and previous series of snapshots.</li> <li>TIP: Click the how to use button within the performance tab for more details.</li> </ul>',
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
            intro:
              '<ul> <li>This tab visually displays performance metrics and allows the user to gauge efficiency of their application</li></ul>',
            position: 'bottom',
          },
          {
            title: 'Tree Tab',
            element: '.tree-tab',
            intro:
              '<ul><li>This tab visually displays a JSON Tree containing the different components and states</li></ul>',
            position: 'bottom',
          },
          {
            title: 'Accessibility Tree',
            element: '.accessibility-tab',
            intro: '<ul><li>This tab visually displays a Accessibility Tree</li></ul>',
            position: 'bottom',
          },
          {
            title: 'Tutorial Complete',
            intro:
              '<ul><li>Please visit our official Github Repo for more information </li><br> <li><a href="https://github.com/open-source-labs/reactime" target="_blank">Reactime Github</a></li></ul>',
            position: 'top',
          },
        ];
        break;
      case 'performance':
        steps = [
          {
            title: 'Performance Tab',
            element: '.bargraph-position',
            intro:
              '<ul><li>Here we can analyze the render times of our app</li> <li>This is the current series of state changes within our app</li> <li>Mouse over the bargraph elements for details on each specific component</li></ul>',
            position: 'top',
          },
        ];
        break;
      case 'AxTree':
        steps = [
          {
            title: 'Accessibility Tree',
            element: '.display',
            intro:
              '<ul><li>Nodes from the accessibility tree have either a role <strong>role</strong> or <strong>internalRole</strong><i><b>Role</b></i> refers to ARIA roles, which indicate the purpose of the element to assistive technologies, like screen readers.All of the nodes rendered in this tree have a role of Role.<i><b>internalRole</b></i> refers to browser-specific roles <strong> Chrome </strong> for its own accessibility processing.<p> Each node is given a property labeled <strong>ignored</strong>. Nodes read by the screen reader have their ignored property evaluate to <strong>false</strong>.Nodes not read by the screen reader evaluate to <strong>true</strong>.</p><p> Nodes labeled as <strong>no name</strong> are visible to a screen reader, but were not given a name label.</p></li></ul>',
            position: 'top',
          },
        ];
        break;
      case 'webmetrics':
        steps = [
          {
            title: 'Webmetrics Tab',
            element: '.web-metrics-container',
            intro: 'Additional info can be found be hovering over desired metrics',
            position: 'top',
          },
          // {
          //   title: 'LCP',
          //   element: document.querySelectorAll('.metric')[0],
          //   intro:
          //     '<strong>Largest Contentful Paint</strong><br/>The amount of time it takes for the largest image, video or text block within the viewport to be fully rendered and interactive.',
          //   position: 'top',
          // },

          // {
          //   title: 'FID',
          //   element: document.querySelectorAll('.metric')[1],
          //   intro:
          //     '<strong>First Input Delay</strong><br/>A measurement of load responsiveness, the time from the first user interaction (for example, a click) to the browser responding to that interaction.',
          //   position: 'top',
          // },

          // {
          //   title: 'FCP',
          //   element: document.querySelectorAll('.metric')[2],
          //   intro:
          //     '<strong>First Contentful Paint</strong><br/>The amount of time it takes to render the first DOM element of any variety',
          //   position: 'top',
          // },

          // {
          //   title: 'TTFB',
          //   element: document.querySelectorAll('.metric')[3],
          //   intro:
          //     "<strong>Time To First Byte</strong><br/>The amount of time it takes for a user's browser to receive the first byte of page content from the server.",
          //   position: 'top',
          // },
        ];
        break;
      case 'history':
        steps = [
          {
            title: 'History Tab',
            element: '.display',
            intro:
              'The history tab shows all snapshots as a timeline and includes branches to represent divergent state history created from time traveling backwards and making new state changes.',
            position: 'top',
          },
          {
            title: 'Viewing History Snapshot',
            element: '.node active',//document.querySelectorAll('.snapshotNode')[0]
            intro:
              'Each node will represent a snapshot in the page. <ul><li>A single snapshot will show as a node while multiple snapshots will be represented as a timeline.</li><li>Highlighting over one will show any state changes compared to the previous snapshot. </li><li>Clicking a node will set the snapshot as the current one.</li></ul>',
            position: 'top',
          },
          {
            title: 'Navigating through Snapshots',
            element: '.routedescription',
            intro: 'All snapshots can also be seen and navigated here as well.',
            position: 'right',
          },

          {
            title: 'Clicking on Jump Button',
            element: document.querySelectorAll('.individual-action')[0],
            intro:
              'The button on the right of each snapshot can be used to jump to a given point in state to view the state history at that point.',
            position: 'right',
          },
          {
            title: 'Renaming The Snapshot',
            element: document.querySelectorAll('.action-component-text')[0],
            intro:
              'A snapshot can be renamed to provided more clarity or distinguish specific snapshots.',
            position: 'left',
          },
        ];
        break;
      case 'tree':
        steps = [
          {
            title: 'Tree Tab',
            element: '.display',
            intro:
              'The tree tab can be used to view a text display of the state snapshots in a JSON format.',
            position: 'top',
          },
        ];
        break;
      default:
        steps = [
          {
            title: 'No Tutorial For This Tab',
            intro:
              '<ul><li>A tutorial for this tab has not yet been created</li><li>Please visit our official Github Repo for more information </li><br> <li><a href="https://github.com/open-source-labs/reactime" target="_blank">Reactime Github</a></li></ul>',
            position: 'top',
          },
        ];
        break;
    }

    return (
      <>
        <Steps
          enabled={this.state.stepsEnabled} // Defines if steps are visible or not, default is false
          steps={steps} // Array of steps
          initialStep={0} // Step index to start with when showing the steps
          onExit={onExit} // Callback called when the steps are disabled. Keeps track of state when steps are dismissed with an Intro.js event and not the enabled prop
          options={{
            tooltipClass: 'customTooltip',
            scrollToElement: false, // Enables scrolling to hidden elements
            showProgress: true, // Shows progress indicator
            showStepNumbers: true, // Show steps number in a red circle
            showBullets: false, // Show bullets
            exitOnOverlayClick: false, // Exit by clicking on the overlay layer
            doneLabel: 'Done', // Done button label
            nextLabel: 'Next', // Next button label
            hideNext: false, // Hide the Next button in the last step
            skipLabel: 'Skip', // Skip button label
            keyboardNavigation: true, // allows navigation between steps using the keyboard
            overlayOpacity: 0.85, // opacity of the overlay
          }}
          onBeforeChange={(currentStepIndex) => onChangeHandler(currentStepIndex)} // Callback called before changing the current step.
          ref={(steps) => (this.steps = steps)} // ref allows access to intro.js API
        />
        <Button className='howToUse-button' type='button' onClick={() => startIntro()}>
          <HelpCircle className='button-icon' size={18} /> Tutorial
        </Button>
      </>
    );
  }
}
