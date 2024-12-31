import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { launchContentScript } from '../slices/mainSlice';
import { MainState, RootState, ErrorContainerProps } from '../FrontendTypes';
import { RefreshCw, Github, PlayCircle } from 'lucide-react';

function ErrorContainer(props: ErrorContainerProps): JSX.Element {
  const dispatch = useDispatch();
  const { tabs, currentTitle, currentTab }: MainState = useSelector(
    (state: RootState) => state.main,
  );

  // function that launches the main app and refreshes the page
  function launch(): void {
    dispatch(launchContentScript(tabs[currentTab]));
    // Allow the dispatch to complete before refreshing
    setTimeout(() => {
      chrome.tabs.reload(currentTab);
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
