import React from 'react';
import styled from 'styled-components';

const Dot = styled('div')({
  borderRadius: '50%',
  width: '12px',
  height: '12px',
  display: 'inline-block',
});

const StatusDot = ({ status }) => {
  let color: 'green' | 'red';
  switch (status) {
    case 'active':
      color = 'green';
      break;
    case 'inactive':
      color = 'red';
      break;
    default:
      color = 'green';
  }
  return <Dot style={{ backgroundColor: color }} />;
};

export default StatusDot;
