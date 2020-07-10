import React from 'react';
import { diff, formatters } from 'jsondiffpatch';
import ReactHtmlParser from 'react-html-parser';
import { useStoreContext } from '../store';

interface DiffProps {
  snapshot: {state?:object|string}; 
  show?: boolean|undefined; 
}

function Diff(props: DiffProps) {
  const { snapshot, show } = props
  const [mainState] = useStoreContext();
  const { currentTab, tabs } = mainState; // Nate:: k/v pairs of mainstate store object being created
  const { snapshots, viewIndex, sliderIndex } = tabs[currentTab];
  let previous;

  // previous follows viewIndex or sliderIndex
  if (viewIndex !== -1) { // if tab isnt selected, view index is set to -1
    previous = snapshots[viewIndex - 1];
  } else {
    previous = snapshots[sliderIndex - 1];
  }

  // gabi :: cleanning preview from stateless data
  const statelessCleanning = (obj:{name?:string; componentData?:object; state?:object|string;stateSnaphot?:object; children?:any[]}) => {
    const newObj = { ...obj };
    if (newObj.name === 'nameless') {
      delete newObj.name;
    }
    if (newObj.componentData) {
      delete newObj.componentData;
    }
    if (newObj.state === 'stateless') {
      delete newObj.state;
    }
    if (newObj.stateSnaphot) {
      newObj.stateSnaphot = statelessCleanning(obj.stateSnaphot);
    }
    if (newObj.children) {
      newObj.children = [];
      if (obj.children.length > 0) {
        obj.children.forEach((element:{state?:object | string; children?:[]}) => {
          if (element.state !== 'stateless' || element.children.length > 0) {
            const clean = statelessCleanning(element);
            newObj.children.push(clean);
          }
        });
      }
    }
    return newObj;
  };
  // gabi :: just display stateful data
  const previousDisplay = statelessCleanning(previous);
  // Nate:: diff function returns a comparison of two objects, one has an updated change
  // gabi :: just display stateful data
  const delta = diff(previousDisplay, snapshot);
  // returns html in string
  // gabi :: just display stateful data
  const html = formatters.html.format(delta, previousDisplay);
  if (show) formatters.html.showUnchanged();
  else formatters.html.hideUnchanged();

  if (previous === undefined || delta === undefined) {
    return <div className='noState'> No state change detected. Trigger an event to change state </div>;
  }
  return <div>{ReactHtmlParser(html)}</div>;
}

export default Diff;
