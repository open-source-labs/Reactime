import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // needed this to extend the jest-dom assertions  (ex toHaveTextContent)
import ErrorMsg from '../components/ErrorMsg';

const props = {
  loadingArray: [false],
  status: {
    contentScriptLaunched: true,
    reactDevToolsInstalled: true,
    targetPageisaReactApp: true,
  },
  launchContent: null,
};

describe('unit testing for ErrorContainer.tsx', () => {
  describe('When there are no errors', () => {
    test('Returns empty div', () => {
      const { container } = render(<ErrorMsg {...props} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe("when there's a RDT Error", () => {
    test('RDT error related text shows', () => {
      props.status.reactDevToolsInstalled = false;
      render(<ErrorMsg {...props} />);
      expect(
        screen.getByText('React Dev Tools isnt installed!', { exact: false }),
      ).toBeInTheDocument();
      props.status.reactDevToolsInstalled = true;
    });
  });

  describe("when there's a Content Script Error", () => {
    test('Content Script Error related text shows', () => {
      props.status.contentScriptLaunched = false;
      render(<ErrorMsg {...props} />);
      expect(
        screen.getByText(
          'Could not connect to the Target App. Try closing Reactime and reloading the page.',
          { exact: false },
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'NOTE: By default Reactime only launches the content script on URLS starting with localhost.',
          { exact: false },
        ),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'If your target URL does not match, you can manually launch the content script below.',
          { exact: false },
        ),
      ).toBeInTheDocument();
    });

    test('launch button shows', () => {
      render(<ErrorMsg {...props} />);
      expect(screen.getByRole('button')).toBeInTheDocument();
      props.status.contentScriptLaunched = true;
    });
  });

  describe("when there's a Not React Error", () => {
    test('Not React App text shows', () => {
      props.status.targetPageisaReactApp = false;
      render(<ErrorMsg {...props} />);
      expect(
        screen.getByText(
          'The Target app is either not a React application or is not compatible with Reactime',
          { exact: false },
        ),
      ).toBeInTheDocument();
      props.status.targetPageisaReactApp = true;
    });
  });
});
