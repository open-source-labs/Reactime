import {screen, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FeaturesSection from '../src/pages/components/FeaturesSection';

describe('<FeaturesSection />', () => {
  it('renders the core features section', () => {
    render(<FeaturesSection />)
  })
});