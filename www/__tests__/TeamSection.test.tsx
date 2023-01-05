import {screen, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import People, { Profile } from '../src/pages/components/TeamSection';

// http://localhost/_next/image?url=https%3A%2F%2Fgithub.com%2Fwiltonlee948.png&w=256&q=75

it('test to see if all the contributor images show up', async () => {
  render(<People />);
  const image = screen.getAllByTestId('image');
  expect(image.length).toBe(72);
});


test('the value from the profile attribute should be in the src', async () => {
  render(<Profile key='' profile='react' name='' />);
  const src = await screen.getByTestId('image').getAttribute('src');
  expect(src).toContain('react');
});
