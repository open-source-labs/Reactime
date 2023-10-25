// /* eslint-disable react/prop-types */

import React from 'react';
import { ClipLoader } from 'react-spinners';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

/*
This file is what decides what icon (loading, checkmark, exclamation point) is displayed next to the checks in the ErrorContainer loading screen:

  1. if the content script has been launched on the current tab
  2. if React Dev Tools has been installed
  3. if target tab contains a compatible React app
*/

const handleResult = (result: boolean): JSX.Element =>
  result ? (
    <CheckCircleOutlineIcon className='check' /> // if result boolean is true, we display a checkmark icon
  ) : (
    <ErrorOutlineIcon className='fail' /> // if the result boolean is false, we display a fail icon
  );

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
// Returns the 'Loader' component
const Loader = ({ loading, result }): JSX.Element =>
  loading ? (
    <ClipLoader color='#123abc' size={30} loading={loading} /> // if the loadingArray value is true, we display a loading icon
  ) : (
    handleResult(result) // else we display a component produced by 'handleResult' depending on if the result parameter (which takes an argument from the status object in 'ErrorContainer') is true or false
  );

export default Loader;
