import React, { useState } from 'react';
import { JSONTree } from 'react-json-tree'; // React JSON Viewer Component;
import { setCurrentTabInApp, toggleAxTree } from '../../slices/mainSlice';
import { useDispatch } from 'react-redux';
import { display, style } from '@mui/system';

const theme = {
  scheme: 'monokai',
  author: 'wimer hazenberg (http://www.monokai.nl)',
  base00: '#272822',
  base01: '#383830',
  base02: '#49483e',
  base03: '#75715e',
  base04: '#a59f85',
  base05: '#f8f8f2',
  base06: '#f5f4f1',
  base07: '#f9f8f5',
  base08: '#f92672',
  base09: '#fd971f',
  base0A: '#f4bf75',
  base0B: '#a6e22e',
  base0C: '#a1efe4',
  base0D: '#66d9ef',
  base0E: '#ae81ff',
  base0F: '#cc6633',
};

const AxTree = (props) => {
  const {
    snapshot, // from 'tabs[currentTab]' object in 'MainContainer'
    snapshots, // from 'tabs[currentTab].snapshotDisplay' object in 'MainContainer'
    currLocation, // from 'tabs[currentTab]' object in 'MainContainer'
    axSnapshots,
  } = props;

  const dispatch = useDispatch();
  const [hideButton, setHideButton] = useState(true);
  const [showTree, setShowTree] = useState(false);
  const [selectedValue, setSelectedValue] = useState('disable')

  const enableAxTreeButton = () => {
    dispatch(toggleAxTree('toggleAxRecord'));
    dispatch(setCurrentTabInApp('AxTree'));
    setSelectedValue('enable')
    setHideButton(false);
    setShowTree(true);
  }

  const disableAxTree = () => {
    dispatch(toggleAxTree('toggleAxRecord'));
    setSelectedValue('disable');
    setShowTree(false);
  }

  return (
    <div>
      <p>A Note to Developers: Reactime is using the Chrome Debugging API in order to grab the Accessibility Tree. Enabling this option will allow you to record Accessibility Tree snapshots, but will result in the Chrome browser notifying you that the Chrome Debugger has started.</p>
      <div>
        {<input
        type='radio'
        value='enable'
        checked={selectedValue === 'enable'}
        onChange={() => {
          enableAxTreeButton();
        }}
        />} 
        <label htmlFor='enable'>Enable</label>
        {<input
        type='radio'
        value='disable'
        checked={selectedValue === 'disable'}
        onChange={() => {
          disableAxTree();
        }}
        />} 
        <label htmlFor='disable'>Disable</label>
      </div>
        {showTree && <JSONTree
        data={axSnapshots[currLocation.index]}
        theme={theme}
        />}
      </div>
  )
};
export default AxTree;
