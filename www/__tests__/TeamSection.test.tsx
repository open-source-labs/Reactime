import {screen, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Profile } from '../src/pages/components/TeamSection';

// http://localhost/_next/image?url=https%3A%2F%2Fgithub.com%2Fwiltonlee948.png&w=256&q=75

test('sets src to /profileFallback.png if src causes an error', async () => {
  render(<Profile key='' profile='qcvber' name='' />);
  const src = screen.getByTestId('image').getAttribute('src');
  console.debug(src)
});
