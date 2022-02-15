/* eslint-disable react/prop-types */
import React from 'react';
import { css } from '@emotion/react';
import {
  ClipLoader, DotLoader, SyncLoader, ClockLoader,
} from 'react-spinners';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const override = css`
  display: inline;
  margin: 0 auto;
`;

const handleFail = (result: boolean): JSX.Element => (result
  ? <FontAwesomeIcon className="check" icon={faCheck} size="lg" />
  : <FontAwesomeIcon className="fail" icon={faExclamationCircle} size="lg" />
);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const Loader = ({
  loading,
  result,
}): JSX.Element => (loading ? (
  <ClockLoader
    color="#123abc"
    css={override}
    speedMultiplier={1}
    size={30}
    loading={loading}
  />
) : handleFail(result));

export default Loader;
