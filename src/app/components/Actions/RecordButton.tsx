import React from 'react';
import { Switch } from '@mui/material';

const RecordButton = ({ isRecording, onToggle }) => {
  return (
    <div className='record-button-container'>
      <div className='record-label'>
        <div className={`record-icon ${isRecording ? 'recording' : ''}`} />
        <span>Record</span>
      </div>
      <Switch
        checked={isRecording}
        onChange={onToggle}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#38bdf8',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#0284c7',
          },
        }}
      />
    </div>
  );
};

export default RecordButton;
