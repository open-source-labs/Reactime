import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Footer from '../components/Footer/Footer';

describe('Footer', () => {
  const originalChrome = (global as any).chrome;

  afterEach(() => {
    (global as any).chrome = originalChrome;
  });

  it('renders the Reactime brand label', () => {
    (global as any).chrome = undefined;
    render(<Footer />);
    expect(screen.getByTestId('reactime-footer')).toBeInTheDocument();
    expect(screen.getByText(/Reactime/)).toBeInTheDocument();
  });

  it('shows the version from chrome.runtime.getManifest()', () => {
    (global as any).chrome = {
      runtime: {
        getManifest: () => ({ version: '26.1' }),
      },
    };
    render(<Footer />);
    expect(screen.getByText(/Reactime v26\.1/)).toBeInTheDocument();
  });

  it('renders GitHub and Docs links that open in a new tab', () => {
    (global as any).chrome = {
      runtime: {
        getManifest: () => ({ version: '26.1' }),
      },
    };
    render(<Footer />);

    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute(
      'href',
      'https://github.com/open-source-labs/reactime',
    );
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', expect.stringContaining('noopener'));

    const docsLink = screen.getByRole('link', { name: /docs/i });
    expect(docsLink).toHaveAttribute(
      'href',
      'https://github.com/open-source-labs/reactime#readme',
    );
    expect(docsLink).toHaveAttribute('target', '_blank');
  });

  it('falls back gracefully when chrome runtime is unavailable', () => {
    (global as any).chrome = undefined;
    render(<Footer />);
    expect(screen.getByText('Reactime')).toBeInTheDocument();
    expect(screen.queryByText(/v\d/)).not.toBeInTheDocument();
  });
});
