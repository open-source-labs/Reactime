import React, { useEffect } from 'react';
import JSONTree from 'react-json-tree'; // React JSON Viewer Component
import { setCurrentTabInApp } from '../../slices/mainSlice';
import { useDispatch } from 'react-redux';
import { TreeProps } from '../../FrontendTypes';

/*
  Creats a component based on the JSON. Options may be passed into the props of the JSONTree component
*/

const colors = {
  scheme: 'paraiso',
  author: 'jan t. sott',
  base00: '#2f1e2e',
  base01: '#41323f',
  base02: '#4f424c',
  base03: '#776e71',
  base04: '#8d8687',
  base05: '#a39e9b',
  base06: '#b9b6b0',
  base07: '#e7e9db',
  base08: '#ef6155',
  base09: '#f99b15',
  base0A: '#fec418',
  base0B: '#48b685',
  base0C: '#5bc4bf',
  base0D: '#06b6ef',
  base0E: '#815ba4',
  base0F: '#e96ba8',
};

const getItemString = (type: any, data: { state?: object | string; name: string; children: [] }) => { // function that allows the customization of how arrays, objects, and iterable nodes are displayed.
  if (data && data.name) {
    return <span>{data.name}</span>;
  }
  return <span />;
};

const Tree = (props: TreeProps) => {
  const { 
    snapshot, // from 'tabs[currentTab]' object in 'MainContainer'
    snapshots, // from 'tabs[currentTab].snapshotDisplay' object in 'MainContainer'
    currLocation // from 'tabs[currentTab]' object in 'MainContainer'
  } = props;
  // @ts-ignore
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentTabInApp('tree')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'tree' to facilitate render.
  }, []);

  return (
    <>
      {snapshot && (
        // @ts-ignore
        <JSONTree
          // @ts-ignore
          data={snapshots[currLocation.index] || snapshot} // data to be rendered, a snapshot object
          theme={{ extend: colors, tree: () => ({ className: 'json-tree' }) }} // theme set to a base16 theme that has been extended to include  "className: 'json-tree'"
          shouldExpandNodeInitially={() => true} // determines if node should be expanded when it first renders (root is expanded by default)
          getItemString={getItemString} // allows the customization of how arrays, objects, and iterable nodes are displayed.
          labelRenderer={(raw: any[]) => { //  renders a label if the first element of raw is a number.
            return typeof raw[0] !== 'number' ? <span>{raw[0]}</span> : null;
          }}
        />
      )}
    </>
  );
};

export default Tree;
