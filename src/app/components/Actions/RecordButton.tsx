import React from 'react';
import { Switch } from '@mui/material';
import ThemeToggle from './ThemeToggle';

const RecordButton = ({ isRecording, onToggle }) => {
  return (
    <div className='record-button-container'>
      <div className='record-label'>
        <div
          className={`record-icon ${isRecording ? 'recording' : ''}`}
          style={{
            backgroundColor: isRecording ? '#ef4444' : '#9ca3af',
            transition: 'background-color 0.3s ease',
          }}
        />
        <span>Record</span>
      </div>
      <Switch
        checked={isRecording}
        onChange={onToggle}
        sx={{
          '& .MuiSwitch-switchBase': {
            color: '#9ca3af',
          },
          '& .MuiSwitch-track': {
            backgroundColor: '#e5e7eb',
          },
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#374151',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#0284c7',
          },
        }}
      />
      <ThemeToggle />
    </div>
  );
};

export default RecordButton;
