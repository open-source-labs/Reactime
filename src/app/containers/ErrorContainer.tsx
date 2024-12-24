import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { launchContentScript, setTab } from '../slices/mainSlice';
import { MainState, RootState, ErrorContainerProps } from '../FrontendTypes';
import { RefreshCw, Github, PlayCircle } from 'lucide-react';

function ErrorContainer(props: ErrorContainerProps): JSX.Element {
  const dispatch = useDispatch();
  const { tabs, currentTitle, currentTab }: MainState = useSelector(
    (state: RootState) => state.main,
  );

  // Add effect to initialize currentTab if not set
  useEffect(() => {
    const initializeCurrentTab = async () => {
      if (!currentTab) {
        try {
          // Query for the active tab
          const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
          if (activeTab?.id) {
            dispatch(setTab(activeTab.id));
          }
        } catch (error) {
          console.error('Error getting active tab:', error);
        }
      }
    };

    initializeCurrentTab();
  }, [currentTab, dispatch]);

  // function that launches the main app and refreshes the page
  function launch(): void {
    // Add validation to ensure we have valid data
    if (!currentTab) {
      console.warn('No current tab available - attempting to get active tab');
      // Try to get the active tab when launching
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          const activeTabId = tabs[0].id;
          dispatch(setTab(activeTabId));
          // Create default payload and launch
          const defaultPayload = {
            status: {
              contentScriptLaunched: false,
              reactDevToolsInstalled: false,
              targetPageisaReactApp: false,
            },
          };
          dispatch(launchContentScript(defaultPayload));
          // Allow the dispatch to complete before refreshing
          setTimeout(() => {
            chrome.tabs.reload(activeTabId);
          }, 100);
        }
      });
      return;
    }

    if (!tabs || !tabs[currentTab]) {
      // If no tab data exists, create a minimal valid payload
      const defaultPayload = {
        status: {
          contentScriptLaunched: false,
          reactDevToolsInstalled: false,
          targetPageisaReactApp: false,
        },
      };
      dispatch(launchContentScript(defaultPayload));
    } else {
      dispatch(launchContentScript(tabs[currentTab]));
    }

    // Allow the dispatch to complete before refreshing
    setTimeout(() => {
      if (currentTab) {
        chrome.tabs.reload(currentTab);
      }
    }, 100);
  }

  return (
    <div className='error-container'>
      <img src='../assets/whiteBlackSquareLogo.png' alt='Reactime Logo' className='error-logo' />

      <div className='error-content'>
        <div className='error-alert'>
          <div className='error-title'>
            <RefreshCw size={20} />
            Welcome to Reactime
          </div>

          <p className='error-description'>
            To ensure Reactime works correctly with your React application, please either refresh
            your development page or click the launch button below. This allows Reactime to properly
            connect with your app and start monitoring state changes.
          </p>
          <p className='error-description'>
            Important: Reactime requires React Developer Tools to be installed. If you haven't
            already, please{' '}
            <a
              href='https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en'
              target='_blank'
              rel='noopener noreferrer'
              className='devtools-link'
            >
              install React Developer Tools
            </a>{' '}
            first.
          </p>
        </div>

        <p className='error-note'>
          Note: Reactime only works with React applications and by default only launches on URLs
          starting with localhost.
        </p>

        <button type='button' className='launch-button' onClick={launch}>
          <PlayCircle size={20} />
          Launch Reactime
        </button>

        <a
          href='https://github.com/open-source-labs/reactime'
          target='_blank'
          rel='noopener noreferrer'
          className='github-link'
        >
          <Github size={18} />
          Visit Reactime Github for more information
        </a>
      </div>
    </div>
  );
}

export default ErrorContainer;
