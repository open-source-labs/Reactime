import { screen, render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavBar from '../src/pages/components/NavBar';

describe('Navbar Component Test ', () => {
  beforeEach(() => {
    render(<NavBar />);
  });

  it('navbar should have two buttons(anchor tags)', () => {
    const buttons = screen.getAllByRole('link');
    expect(buttons).toHaveLength(2);
  });

  it('clicking a post link navigates to the correct URL', () => {
    expect(screen.getAllByRole('link')[0]).toHaveAttribute(
      'href',
      'http://github.com/open-source-labs/reactime'
    );
    expect(screen.getAllByRole('link')[1]).toHaveAttribute(
      'href',
      'https://chrome.google.com/webstore/detail/reactime/cgibknllccemdnfhfpmjhffpjfeidjga?hl=en-US'
    );
  });
});
