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

  // Helper function to check if a URL is localhost
  const isLocalhost = (url: string): boolean => {
    return url.startsWith('http://localhost:') || url.startsWith('https://localhost:');
  };

  // Add effect to initialize currentTab if not set
  useEffect(() => {
    const initializeCurrentTab = async () => {
      if (!currentTab) {
        try {
          // Query specifically for localhost tabs first
          const tabs = await chrome.tabs.query({ currentWindow: true });
          const localhostTab = tabs.find(tab => tab.url && isLocalhost(tab.url));
          
          if (localhostTab?.id) {
            dispatch(setTab(localhostTab.id));
          } else {
            // Fallback to active tab if no localhost found
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (activeTab?.id) {
              dispatch(setTab(activeTab.id));
            }
          }
        } catch (error) {
          console.error('Error getting tab:', error);
        }
      }
    };

    initializeCurrentTab();
  }, [currentTab, dispatch]);

  // function that launches the main app and refreshes the page
  async function launch(): Promise<void> {
    try {
      // If no current tab, try to find localhost tab first
      if (!currentTab) {
        const tabs = await chrome.tabs.query({ currentWindow: true });
        const localhostTab = tabs.find(tab => tab.url && isLocalhost(tab.url));
        
        if (localhostTab?.id) {
          dispatch(setTab(localhostTab.id));
          await initializeLaunch(localhostTab.id);
        } else {
          console.warn('No localhost tab found');
        }
        return;
      }

      // Verify current tab is still localhost
      const tab = await chrome.tabs.get(currentTab);
      if (!tab.url || !isLocalhost(tab.url)) {
        // Try to find a localhost tab
        const tabs = await chrome.tabs.query({ currentWindow: true });
        const localhostTab = tabs.find(tab => tab.url && isLocalhost(tab.url));
        
        if (localhostTab?.id) {
          dispatch(setTab(localhostTab.id));
          await initializeLaunch(localhostTab.id);
        } else {
          console.warn('No localhost tab found');
        }
        return;
      }

      await initializeLaunch(currentTab);
    } catch (error) {
      console.error('Error during launch:', error);
    }
  }

  async function initializeLaunch(tabId: number): Promise<void> {
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
      chrome.tabs.reload(tabId);
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
            Important: Reactime requires React Developer Tools to be installed and will only track state 
            changes on localhost development servers. If you haven't already, please{' '}
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