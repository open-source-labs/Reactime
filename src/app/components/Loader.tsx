// /* eslint-disable react/prop-types */

import React from 'react';
import { ClipLoader } from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

/*
This file is what decides what icon (loading, checkmark, exclamation point) is displayed next to the checks in the ErrorContainer loading screen:

  1. if the content script has been launched on the current tab
  2. if React Dev Tools has been installed
  3. if target tab contains a compatible React app
*/

const handleResult = (result: boolean): JSX.Element =>
  result ? (
    // if result boolean is true, we display a checkmark icon
    <FontAwesomeIcon icon={faCheck} className='check' size='lg' />
  ) : (
    // if the result boolean is false, we display a fail icon
    <FontAwesomeIcon icon={faExclamationCircle} className='fail' size='lg' />
  );

// Returns the Loader component
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Loader = ({ loading, result }): JSX.Element =>
  loading ? (
    // if the loadingArray value is true, we display a loading icon
    <ClipLoader color='#123abc' size={30} loading={loading} />
  ) : (
    // else we display a component produced by handleResult depending on if the result parameter (which takes an argument from the status object in ErrorContainer) is true or false
    handleResult(result)
  );

export default Loader;
