import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FeaturesSection from '../src/pages/components/FeaturesSection';

const features = [
  {
    name: 'State SnapShot Display',
    description:
      'See your application state in a stylized and interactive format, for clear concise state management'
  },
  {
    name: 'Time Travel Rendering',
    description: 'Simulate any state change from your DOM history, with a simple click of a button'
  },
  {
    name: 'Action Comparison & Snapshot Series',
    description:
      'Save a series of state snapshots and use it to analyze changes in component render performance between current and previous series of snapshots.'
  }
];

describe('FeatureSection component test ', () => {
  beforeEach(() => {
    render(<FeaturesSection />);
  });

  it('Renders the core features section', () => {
    expect(screen.getByText(/Core Features/i)).toBeInTheDocument();
  });

  it('Title appears on the page', () => {
    expect(screen.getByText(/What makes Reactime so great\?/i)).toBeInTheDocument();
  });

  it('Subheading shows up on the page', () => {
    expect(
      screen.getByText(
        /Reactime is full of features that make your life easier as a developer. From time-travel debugging to state snapshot display, check out how using Reactime will improve your developer experience./i
      )
    ).toBeInTheDocument();
  });

  it('Renders all feature name and descriptions', () => {
    features.forEach((feature) => {
      expect(screen.getByText(feature.name)).toBeInTheDocument();
      expect(screen.getByText(feature.description)).toBeInTheDocument();
    });
  });
});
