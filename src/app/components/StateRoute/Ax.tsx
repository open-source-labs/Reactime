import React, { useEffect } from 'react';
import { JSONTree } from 'react-json-tree'; // React JSON Viewer Component;
import { setCurrentTabInApp } from '../../slices/mainSlice';
import { useDispatch } from 'react-redux';

// const getItemString = (
//     type: any,
//     data: { state?: object | string; name: string; children: [] },
//   ) => {
//     // function that allows the customization of how arrays, objects, and iterable nodes are displayed.
//     if (data && data.name) {
//       return <span>{data.name}</span>;
//     }
//     return <span />;
//   };
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
      } = props;

      const dispatch = useDispatch();

      useEffect(() => {
        dispatch(setCurrentTabInApp('AxTree')); // dispatch sent at initial page load allowing changing "immer's" draft.currentTabInApp to 'tree' to facilitate render.
      }, []);
    // const json = {
    //     array: [1, 2, 3],
    //     bool: true,
    //     object: {
    //     foo: 'bar',
    //     },
    // };

    //removing/adding snapshot at beginning of return statement didn't change anything
    return(
        <> {snapshot && (
            <JSONTree 
            data={snapshots[currLocation.index] || snapshot} 
            shouldExpandNodeInitially={() => true}
            theme = {theme}
            />
                )}
        </>
    )
}
export default AxTree;