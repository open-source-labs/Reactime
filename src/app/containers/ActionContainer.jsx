/* eslint-disable react/no-array-index-key */
/* eslint-disable no-inner-declarations */
import React from 'react';
import { diff } from 'jsondiffpatch';
import Action from '../components/Action';

import { emptySnapshots } from '../actions/actions';
import { useStoreContext } from '../store';

const resetSlider = () => {
  const slider = document.querySelector('.rc-slider-handle');
  if (slider) { slider.setAttribute('style', 'left: 0'); }
};

function ActionContainer() {
  const [{ tabs, currentTab }, dispatch] = useStoreContext();
  const { snapshots, sliderIndex, viewIndex } = tabs[currentTab];

  let actionsArr = [];
  // build actions array
  if (snapshots.length > 0) {
    // breadth  first function - take in an delta obj
    function breadthFirst(delta) {
      if (delta === undefined) return '';
      // aux array = current and one called next
      let current = Object.values(delta.children); // Object.keys(delta.children);
      let next = [];
      let result = '';
      // return a string
      while (current.length > 0) {
        const shifted = current.shift();
        if (shifted.state) {
          // eslint-disable-next-line no-loop-func
          Object.keys(shifted.state).forEach(key => {
            result = result.concat(key, ', ');
          });
        }
        if (shifted.children) {
          // eslint-disable-next-line no-loop-func
          Object.keys(shifted.children).forEach(el => {
            next.push(shifted.children[el]);
          });
        }
        if (current.length === 0) {
          current = next;
          next = [];
        }
      }
      return result;
    }

    function truncate(newDiff, num = 15) {
      if (newDiff.length <= num) return newDiff.replace(',', '');
      const thisdiff = newDiff.slice(0, num);
      return thisdiff.concat('...');
    }
    actionsArr = snapshots.map((snapshot, index) => {
      const selected = index === viewIndex;
      let newDiff = '';
      // if index is greater than 0
      if (index > 0) {
        // calculate the diff
        const delta = diff(snapshots[index - 1], snapshot);
        newDiff = truncate(breadthFirst(delta));
      }
      return (
        <Action
          key={`action${index}`}
          index={index}
          selected={selected}
          dispatch={dispatch}
          sliderIndex={sliderIndex}
          delta={newDiff}
        />
      );
    });
  }
  return (
    <div className="action-container">
      <div className="action-component exclude">
        <button
          className="empty-button"
          onClick={() => {
            dispatch(emptySnapshots());
            // set slider back to zero
            resetSlider();
          }}
          type="button"
        >
          Empty
        </button>
      </div>
      <div>{actionsArr}</div>
    </div>
  );
}

export default ActionContainer;
