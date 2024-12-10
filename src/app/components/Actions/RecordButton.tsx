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
          '& .MuiSwitch-switchBase': {
            color: '#6b7280', // Medium gray for unchecked thumb - better contrast against white background
          },
          '& .MuiSwitch-track': {
            backgroundColor: '#e5e7eb', // Light gray for unchecked track
          },
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#374151', // Same dark gray for checked thumb
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#0284c7', // Blue for checked track
          },
        }}
      />
    </div>
  );
};

export default RecordButton;
