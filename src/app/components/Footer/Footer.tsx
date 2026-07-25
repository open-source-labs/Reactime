import React from 'react';

// Safely read the extension version from the manifest. Falls back to an empty
// string when running outside of a chrome extension context (e.g. in tests).
function getExtensionVersion(): string {
  try {
    if (typeof chrome !== 'undefined' && chrome?.runtime?.getManifest) {
      return chrome.runtime.getManifest().version ?? '';
    }
  } catch {
    // ignore - not running inside an extension context
  }
  return '';
}

const GITHUB_URL = 'https://github.com/open-source-labs/reactime';
const DOCS_URL = 'https://github.com/open-source-labs/reactime#readme';

function Footer(): JSX.Element {
  const version = getExtensionVersion();

  return (
    <footer className='reactime-footer' data-testid='reactime-footer'>
      <span className='footer-brand'>
        Reactime{version && ` v${version}`}
      </span>
      <span className='footer-separator' aria-hidden='true'>·</span>
      <a
        className='footer-link'
        href={GITHUB_URL}
        target='_blank'
        rel='noopener noreferrer'
      >
        GitHub
      </a>
      <span className='footer-separator' aria-hidden='true'>·</span>
      <a
        className='footer-link'
        href={DOCS_URL}
        target='_blank'
        rel='noopener noreferrer'
      >
        Docs
      </a>
    </footer>
  );
}

export default Footer;
