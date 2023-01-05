import {screen, render, fireEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LandingPage from '../src/pages/components/LandingPage';
import Blogs from '../src/pages/components/Blogs';
import People from '../src/pages/components/TeamSection';
import FeaturesSection from '../src/pages/components/FeaturesSection';
import {trpc} from '../src/utils/trpc';
// Work in progress. Trying to mock the trpc object


jest.mock("../src/utils/trpc", () => {
  const mockCreateUser = jest.fn();
  const mockFindAll = jest.fn();

  const mockUserRouter = {
    createUser: mockCreateUser,
    findAll: mockFindAll
  };

  const mockAppRouter = {
    user: mockUserRouter
  };
  return {
    appRouter: mockAppRouter
  };
});

describe('Navbar Component Test ', () => {
  beforeEach(() => {
    render(<LandingPage />)
  });

  it ('check that the button is rendered on the page', () => {
    const button = screen.getByRole('button');
    console.debug(button)
    expect(button).toHaveLength(1);
    expect(screen.getByText("A time travel debugger for modern react apps")).toBeInTheDocument();
  });
});
