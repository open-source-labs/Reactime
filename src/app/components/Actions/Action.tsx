import React, { useState, useMemo } from 'react';
import ReactHover, { Trigger, Hover } from 'react-hover';
import { changeView, changeSlider } from '../../slices/mainSlice';
import { ActionProps, OptionsCursorTrueWithMargin } from '../../FrontendTypes';
import { useDispatch } from 'react-redux';
import { calculateSnapshotDiff, formatDiffValue, SnapshotDiff } from '../../utils/snapshotDiff';

const Action = (props: ActionProps): JSX.Element => {
  const dispatch = useDispatch();

  const { selected, last, index, sliderIndex, displayName, componentData, viewIndex, isCurrIndex, snapshots, hierarchy, expandedIndex, setExpandedIndex } =
    props;
  
  // Determine if this snapshot is expanded
  const isExpanded = expandedIndex === index;

  const cleanTime = (): string => {
    if (!componentData || !componentData.actualDuration) {
      return 'NO TIME';
    }

    let seconds: number | string;
    let milliseconds: any = componentData.actualDuration;

    if (Math.floor(componentData.actualDuration) > 60) {
      seconds = Math.floor(componentData.actualDuration / 60);
      seconds = JSON.stringify(seconds);

      if (seconds.length < 2) {
        seconds = '0'.concat(seconds);
      }
      milliseconds = Math.floor(componentData.actualDuration % 60);
    } else {
      seconds = '00';
    }

    milliseconds = Number.parseFloat(milliseconds as string).toFixed(2);
    const arrayMilliseconds: [string, number] = milliseconds.split('.');

    if (arrayMilliseconds[0].length < 2) {
      arrayMilliseconds[0] = '0'.concat(arrayMilliseconds[0]);
    }

    if (index === 0) {
      return `${seconds}:${arrayMilliseconds[0]}.${arrayMilliseconds[1]}`;
    }
    return `+${seconds}:${arrayMilliseconds[0]}.${arrayMilliseconds[1]}`;
  };

  const displayTime: string = cleanTime();

  // Calculate diff between current and previous snapshot
  // Based on History.tsx pattern: snapshots are accessed directly by index
  const diff: SnapshotDiff = useMemo(() => {
    if (index < 0) {
      return {
        changeCount: 0,
        changeType: 'initial',
        propsChanges: [],
        stateChanges: [],
        hasChanges: false,
      };
    }

    // Initial state (index 0) - no previous snapshot to compare
    if (index === 0) {
      return {
        changeCount: 0,
        changeType: 'initial',
        propsChanges: [],
        stateChanges: [],
        hasChanges: false,
      };
    }

    // Access snapshots directly like History.tsx does
    if (!snapshots || !Array.isArray(snapshots) || snapshots.length === 0) {
      return {
        changeCount: 0,
        changeType: 'initial',
        propsChanges: [],
        stateChanges: [],
        hasChanges: false,
      };
      }

    // Check if we have both current and previous snapshots
    if (!snapshots[index] || !snapshots[index - 1]) {
      return {
        changeCount: 0,
        changeType: 'initial',
        propsChanges: [],
        stateChanges: [],
        hasChanges: false,
      };
    }

    // Get snapshots directly - same pattern as History.tsx
    const currentSnapshot = snapshots[index];
    const previousSnapshot = snapshots[index - 1];

    // Additional safety checks
    if (!currentSnapshot || !previousSnapshot) {
      return {
        changeCount: 0,
        changeType: 'initial',
        propsChanges: [],
        stateChanges: [],
        hasChanges: false,
      };
    }

    // Calculate diff using the snapshot objects directly
    const result = calculateSnapshotDiff(previousSnapshot, currentSnapshot);

    return result;
  }, [snapshots, index]);

  // Get badge color and text based on change type
  const getBadgeInfo = () => {
    if (index === 0 || diff.changeType === 'initial') {
      return { color: 'initial', text: 'Initial State', icon: '🟢' };
    }
    switch (diff.changeType) {
      case 'small':
        return { color: 'small', text: `${diff.changeCount}`, icon: '🟢' };
      case 'medium':
        return { color: 'medium', text: `${diff.changeCount}`, icon: '🟡' };
      case 'large':
        return { color: 'large', text: `${diff.changeCount}`, icon: '🔴' };
      default:
        return { color: 'initial', text: 'Initial State', icon: '🟢' };
    }
  };

  const badgeInfo = getBadgeInfo();

  const optionsCursorTrueWithMargin: OptionsCursorTrueWithMargin = {
    followCursor: true,
    shiftX: 20,
    shiftY: 0,
  };

  const handleToggleExpand = (e: any): void => {
    e.stopPropagation();
    if (setExpandedIndex) {
      const newExpandedIndex = isExpanded ? null : index;
      // If clicking the same snapshot that's already expanded, collapse it
      // Otherwise, expand the clicked snapshot (which will collapse the previous one)
      setExpandedIndex(newExpandedIndex);
    }
  };
  return (
    <div className='individual-action'>
      <div
        // @ts-ignore
        className={selected || last ? 'action-component selected' : 'action-component'}
        onClick={() => {
          dispatch(changeView(index));
        }}
        role='presentation'
        style={index > sliderIndex ? { color: '#5f6369' } : {}}
        tabIndex={index}
      >
        <ReactHover options={optionsCursorTrueWithMargin}>
          <Trigger type='trigger'>
            <div
              className='action-component-trigger action-single-row'
              style={index > sliderIndex ? { color: '#5f6369' } : {}}
            >
              {/* Single row: Snapshot name, badge, time, and current button as separate children */}
              <div className='action-single-row-content'>
                <div className='action-snapshot-name'>
                  <input
                    className='actionname'
                    key={`ActionInput${displayName}`}
                    type='text'
                    placeholder={` Snapshot: ${displayName}`}
                  />
                </div>
                  {/* Time display */}
                  {!isCurrIndex && (
                  <div className='action-time-display'>
                    <span className='time-text'>{displayTime}</span>
                  </div>
                )}
                
                {/* Initial State badge for index 0 */}
                {index === 0 && (
                  <div className='diff-badge-inline diff-badge-initial'>
                    <span className='diff-badge-icon'>🟢</span>
                    <span className='diff-badge-text'>Initial State</span>
                  </div>
                )}
                
                {/* Inline badge for non-initial snapshots */}
                {index > 0 && diff.changeCount > 0 && (
                  <button
                    className={`diff-badge-inline diff-badge-${badgeInfo.color} ${isExpanded ? 'expanded' : ''}`}
                    onClick={handleToggleExpand}
                    type='button'
                    aria-label={isExpanded ? 'Collapse diff details' : 'Expand diff details'}
                    aria-expanded={isExpanded}
                  >
                    <span className='diff-badge-icon'>{badgeInfo.icon}</span>
                    <span className='diff-badge-text'>{diff.changeCount}</span>
                    <span className='diff-badge-expand-icon'>▶</span>
                  </button>
                )}
                
              
                
                {/* Current button (always visible for current snapshot) */}
                {isCurrIndex && (
                  <button className='current-location-compact' type='button'>
                    Current
                  </button>
                )}
              </div>
            </div>
          </Trigger>
          <Hover type='hover' />
        </ReactHover>

        {/* Collapsed Summary (when not expanded) */}
        {/* {index > 0 && !isExpanded && diff.changeCount > 0 && (
          <div className='action-diff-header'>
            <button
              className='diff-summary-collapsed'
              onClick={handleToggleExpand}
              type='button'
              aria-label='Expand diff details'
            >
              <span className='diff-summary-icon'>📊</span>
              <span className='diff-summary-text'>
                {diff.changeCount} change{diff.changeCount !== 1 ? 's' : ''} (click to expand)
              </span>
              <span className='diff-summary-arrow'>▶</span>
            </button>
          </div>
        )} */}

        {/* Expanded Diff Details */}
        {isExpanded && diff.changeCount > 0 && (
          <div 
            className='diff-details' 
            style={{ display: 'block' }}
          >
            {/* <div className='diff-details-header'>
              <span className='diff-details-title'>📝 Changes ({diff.changeCount}):</span>
            </div> */}
            
            {diff.stateChanges.length > 0 && (
              <div className='diff-section'>
                <div className='diff-section-header'>State Changes ({diff.stateChanges.length}):</div>
                <div className='diff-changes-list'>
                  {diff.stateChanges.map((change, i) => (
                    <div key={`state-${i}`} className='diff-item-bullet'>
                      <span className='diff-item-content'>
                        {/* <span className='diff-item-label'>State:</span> */}
                        <span className='diff-item-name'>{change.key}</span>
                        <span className='diff-item-change'>
                          ({formatDiffValue(change.oldValue)} → {formatDiffValue(change.newValue)})
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jump button in expanded section */}
            {!isCurrIndex && (
              <button
                className='jump-button-compact jump-button-expanded'
                onClick={(e): void => {
                  e.stopPropagation();
                  dispatch(changeSlider(index));
                  dispatch(changeView(index));
                }}
                tabIndex={index}
                type='button'
              >
                Jump to this snapshot
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Action;
