/**
 * Snapshot Diff Utility
 * 
 * Calculates differences between snapshots to show what changed.
 * Used for displaying state change details in the snapshot sidebar.
 */

import { diff } from 'jsondiffpatch';

export interface SnapshotDiff {
  changeCount: number;
  changeType: 'initial' | 'small' | 'medium' | 'large';
  propsChanges: Array<{
    key: string;
    oldValue: any;
    newValue: any;
    component: string;
  }>;
  stateChanges: Array<{
    key: string;
    oldValue: any;
    newValue: any;
    component: string;
  }>;
  hasChanges: boolean;
}

/**
 * Cleans snapshot data by removing stateless components and unnecessary data
 */
function statelessCleaning(obj: {
  name?: string;
  componentData?: { props?: any; [key: string]: any };
  state?: string | any;
  stateSnapshot?: object;
  children?: any[];
}): any {
  if (!obj) return {};

  const newObj = { ...obj };
  if (newObj.name === 'nameless') delete newObj.name;
  
  // Remove componentData entirely - we only track state changes, not props changes
  if (newObj.componentData) {
    delete newObj.componentData;
  }
  
  if (newObj.state === 'stateless') delete newObj.state;
  if (newObj.stateSnapshot) {
    newObj.stateSnapshot = statelessCleaning(obj.stateSnapshot as any);
  }
  if (newObj.children) {
    newObj.children = [];
    if (Array.isArray(obj.children) && obj.children.length > 0) {
      obj.children.forEach((element: { state?: object | string; children?: [] }) => {
        if (
          element &&
          ((element.state && element.state !== 'stateless') ||
            (element.children && element.children.length > 0))
        ) {
          const clean = statelessCleaning(element as any);
          newObj.children.push(clean);
        }
      });
    }
  }
  return newObj;
}

/**
 * Extracts state and props changes from a diff delta
 * Based on History.tsx findStateChangeObj pattern
 * jsondiffpatch format: state changes are arrays [oldValue, newValue, 0]
 */
function extractChanges(
  delta: any,
  componentName: string = 'Unknown',
  propsChanges: SnapshotDiff['propsChanges'] = [],
  stateChanges: SnapshotDiff['stateChanges'] = [],
): { propsChanges: SnapshotDiff['propsChanges']; stateChanges: SnapshotDiff['stateChanges'] } {
  if (!delta) return { propsChanges, stateChanges };


  // Check for state changes - jsondiffpatch format can be:
  // 1. Array: [oldValue, newValue, 0] - direct state change
  // 2. Object: { key: [oldValue, newValue] } - nested state changes
  if (delta.state) {
    // Case 1: State is an array [oldValue, newValue, 0]
    if (Array.isArray(delta.state) && delta.state.length >= 2) {
    const oldValue = delta.state[0];
    const newValue = delta.state[1];
    
    // Skip stateless components (as per History.tsx)
      if (oldValue !== 'stateless' && newValue !== 'stateless') {
      // If state is an object, extract individual key changes
      if (typeof oldValue === 'object' && oldValue !== null && typeof newValue === 'object' && newValue !== null) {
        // Get all keys from both objects
          const allKeys = new Set([...Object.keys(oldValue || {}), ...Object.keys(newValue || {})]);
        allKeys.forEach((key) => {
          // Use JSON.stringify for deep comparison
          const oldVal = oldValue[key];
          const newVal = newValue[key];
          if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
            // For array changes (like board), extract specific index changes
            if (Array.isArray(oldVal) && Array.isArray(newVal)) {
              // Find which indices changed
              const maxLength = Math.max(oldVal.length, newVal.length);
              for (let i = 0; i < maxLength; i++) {
                const oldItem = oldVal[i];
                const newItem = newVal[i];
                
                // If it's a nested array (2D array like board), check nested indices
                if (Array.isArray(oldItem) && Array.isArray(newItem)) {
                  const maxInnerLength = Math.max(oldItem.length, newItem.length);
                  for (let j = 0; j < maxInnerLength; j++) {
                    const oldCell = oldItem[j];
                    const newCell = newItem[j];
                    if (JSON.stringify(oldCell) !== JSON.stringify(newCell)) {
                      stateChanges.push({
                        key: `${key}[${i}][${j}]`,
                        oldValue: oldCell,
                        newValue: newCell,
                        component: componentName,
                      });
                    }
                  }
                } else if (JSON.stringify(oldItem) !== JSON.stringify(newItem)) {
                  // 1D array change
                  stateChanges.push({
                    key: `${key}[${i}]`,
                    oldValue: oldItem,
                    newValue: newItem,
                    component: componentName,
                  });
                }
              }
            } else {
              // Non-array object property change
            stateChanges.push({
              key,
              oldValue: oldVal,
              newValue: newVal,
              component: componentName,
            });
            }
          }
        });
      } else {
          // Primitive value change or different types
        stateChanges.push({
          key: 'state',
          oldValue,
          newValue,
          component: componentName,
        });
      }
      }
    }
    // Case 2: State is an object with nested changes { key: [oldValue, newValue] }
    else if (typeof delta.state === 'object' && delta.state !== null && !Array.isArray(delta.state)) {
      // State changes are nested - iterate through keys
      Object.keys(delta.state).forEach((key) => {
        const stateChange = delta.state[key];
        
        // jsondiffpatch format for arrays: { '0': { '0': [oldValue, newValue] } } for 2D arrays
        // or { '0': [oldValue, newValue] } for 1D arrays
        if (typeof stateChange === 'object' && stateChange !== null && !Array.isArray(stateChange)) {
          // This is a nested object (likely an array change)
          // Check if it's a 2D array change (like board[row][col])
          const is2DArray = Object.keys(stateChange).some(k => 
            typeof stateChange[k] === 'object' && 
            stateChange[k] !== null && 
            !Array.isArray(stateChange[k])
          );
          
          if (is2DArray) {
            // 2D array change - extract row and column changes
            Object.keys(stateChange).forEach((rowKey) => {
              const rowChange = stateChange[rowKey];
              if (typeof rowChange === 'object' && rowChange !== null && !Array.isArray(rowChange)) {
                Object.keys(rowChange).forEach((colKey) => {
                  const cellChange = rowChange[colKey];
                  if (Array.isArray(cellChange) && cellChange.length >= 2) {
                    // Clean up jsondiffpatch keys (remove leading underscores)
                    const rowIndex = rowKey.startsWith('_') ? rowKey.substring(1) : rowKey;
                    const colIndex = colKey.startsWith('_') ? colKey.substring(1) : colKey;
                    
                    // jsondiffpatch format: [oldValue, newValue, 0] or [oldValue, newValue]
                    // The third element (if present) is a type indicator, not a value
                    const oldValue = cellChange[0];
                    const newValue = cellChange[1];
                    
                    // Only add if values are actually different (avoid false positives)
                    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                      stateChanges.push({
                        key: `${key}[${rowIndex}][${colIndex}]`,
                        oldValue,
                        newValue,
                        component: componentName,
                      });
                    }
                  }
                });
              }
            });
          } else {
            // 1D array change or object property change
            // Check if values are arrays [oldValue, newValue]
            Object.keys(stateChange).forEach((indexKey) => {
              const itemChange = stateChange[indexKey];
              if (Array.isArray(itemChange) && itemChange.length >= 2) {
                // Clean up jsondiffpatch keys (remove leading underscores)
                const index = indexKey.startsWith('_') ? indexKey.substring(1) : indexKey;
                
                // jsondiffpatch format: [oldValue, newValue, 0] or [oldValue, newValue]
                const oldValue = itemChange[0];
                const newValue = itemChange[1];
                
                // Only add if values are actually different
                if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                  stateChanges.push({
                    key: `${key}[${index}]`,
                    oldValue,
                    newValue,
                    component: componentName,
                  });
                }
              }
            });
          }
        } else if (Array.isArray(stateChange) && stateChange.length >= 2) {
          // Direct array format: [oldValue, newValue, 0]
          const oldValue = stateChange[0];
          const newValue = stateChange[1];
          
          // Only add if values are actually different
          if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          stateChanges.push({
            key,
              oldValue,
              newValue,
            component: componentName,
          });
          }
        }
      });
    }
  }

  // Check for props changes (if componentData.props exists in the diff)
  // jsondiffpatch stores prop changes as nested objects with arrays [oldValue, newValue]
  if (delta.componentData && typeof delta.componentData === 'object') {
    const componentDataDelta = delta.componentData;
    
    // Check if props exist in the delta
    if (componentDataDelta.props && typeof componentDataDelta.props === 'object') {
      // Props delta can be:
      // 1. Object with prop keys: { propName: [oldValue, newValue] }
      // 2. Array format if entire props object changed: [oldProps, newProps]
      if (Array.isArray(componentDataDelta.props) && componentDataDelta.props.length >= 2) {
        // Entire props object changed - extract individual prop changes
        const oldProps = componentDataDelta.props[0];
        const newProps = componentDataDelta.props[1];
        if (typeof oldProps === 'object' && oldProps !== null && typeof newProps === 'object' && newProps !== null) {
          const allPropKeys = new Set([...Object.keys(oldProps || {}), ...Object.keys(newProps || {})]);
          allPropKeys.forEach((propKey) => {
            const oldPropVal = oldProps[propKey];
            const newPropVal = newProps[propKey];
            if (JSON.stringify(oldPropVal) !== JSON.stringify(newPropVal)) {
              propsChanges.push({
                key: propKey,
                oldValue: oldPropVal,
                newValue: newPropVal,
                component: componentName,
              });
            }
          });
        }
      } else {
        // Individual prop changes: { propName: [oldValue, newValue] }
      Object.keys(componentDataDelta.props).forEach((key) => {
        const propChange = componentDataDelta.props[key];
        // jsondiffpatch format: [oldValue, newValue, 0] or just [oldValue, newValue]
        if (Array.isArray(propChange) && propChange.length >= 2) {
            const oldValue = propChange[0];
            const newValue = propChange[1];
            // Only add if values are actually different
            if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
          propsChanges.push({
            key,
                oldValue,
                newValue,
            component: componentName,
          });
            }
        }
      });
      }
    }
  }

  // Recursively check children - this is critical for finding nested state changes
  // Based on History.tsx findStateChangeObj pattern
  // jsondiffpatch uses '_t' as a type marker, we should skip it
  if (delta.children && typeof delta.children === 'object') {
    Object.keys(delta.children).forEach((childIndex) => {
      // Skip jsondiffpatch's type marker
      if (childIndex === '_t') return;
      
      const childDelta = delta.children[childIndex];
      if (childDelta && typeof childDelta === 'object') {
        // Try to get component name from the child delta
        // The name might be in the delta itself (as an array [oldName, newName])
        let childName: string | undefined;
        
        // Check if name is in the delta as an array [oldName, newName]
        if (childDelta.name && Array.isArray(childDelta.name) && childDelta.name.length >= 2) {
          childName = childDelta.name[1] || childDelta.name[0]; // Use new name, fallback to old
        } else if (childDelta.name && typeof childDelta.name === 'string') {
          childName = childDelta.name;
        }
        
        // If we still don't have a name, try to construct a meaningful one
        if (!childName) {
          // Use parent component name + index for better identification
          childName = `${componentName} > Component ${childIndex}`;
        }
        
        // Recursively extract changes from children
        extractChanges(childDelta, childName, propsChanges, stateChanges);
      }
    });
  }

  return { propsChanges, stateChanges };
}

/**
 * Calculates the diff between two snapshots
 * @param previousSnapshot - The previous snapshot (from snapshots array)
 * @param currentSnapshot - The current snapshot (from snapshots array)
 * @returns SnapshotDiff object with change details
 */
export function calculateSnapshotDiff(
  previousSnapshot: any,
  currentSnapshot: any,
): SnapshotDiff {
  // No current snapshot - can't calculate diff
  if (!currentSnapshot) {
    return {
      changeCount: 0,
      changeType: 'initial',
      propsChanges: [],
      stateChanges: [],
      hasChanges: false,
    };
  }

  // Initial state (no previous snapshot) - this is expected for index 0
  if (!previousSnapshot) {
    return {
      changeCount: 0,
      changeType: 'initial',
      propsChanges: [],
      stateChanges: [],
      hasChanges: false,
    };
  }

  try {
    // Additional safety checks
    if (!currentSnapshot || typeof currentSnapshot !== 'object') {
      return {
        changeCount: 0,
        changeType: 'initial',
        propsChanges: [],
        stateChanges: [],
        hasChanges: false,
      };
    }

    if (!previousSnapshot || typeof previousSnapshot !== 'object') {
      return {
        changeCount: 0,
        changeType: 'initial',
        propsChanges: [],
        stateChanges: [],
        hasChanges: false,
      };
    }

    // Clean snapshots using the same pattern as History.tsx
    // The snapshot objects are passed directly to statelessCleaning
    const cleanedPrevious = statelessCleaning(previousSnapshot);
    const cleanedCurrent = statelessCleaning(currentSnapshot);

    // Calculate diff using jsondiffpatch (same as History.tsx)
    const delta = diff(cleanedPrevious, cleanedCurrent);

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      const hasDelta = !!delta;
      const deltaKeys = delta ? Object.keys(delta).slice(0, 10) : [];
      const hasChildren = !!(delta?.children);
      const childrenKeys = delta?.children ? Object.keys(delta.children).slice(0, 5) : [];
      
      console.log('[calculateSnapshotDiff] Delta analysis:', {
        hasDelta,
        deltaKeys,
        hasChildren,
        childrenKeys,
        cleanedPreviousKeys: Object.keys(cleanedPrevious || {}).slice(0, 5),
        cleanedCurrentKeys: Object.keys(cleanedCurrent || {}).slice(0, 5),
      });
    }

    if (!delta) {
      return {
        changeCount: 0,
        changeType: 'initial',
        propsChanges: [],
        stateChanges: [],
        hasChanges: false,
      };
    }

    const propsChanges: SnapshotDiff['propsChanges'] = [];
    const stateChanges: SnapshotDiff['stateChanges'] = [];


    // Extract changes from the delta
    // The delta structure follows jsondiffpatch format where children are indexed objects
    // and state changes are arrays [oldValue, newValue, 0]
    // Note: extractChanges already handles recursive extraction of children, so we only call it once
    
    // Start extraction from root level - this will recursively process all children
    const rootName = cleanedCurrent.name || currentSnapshot.name || 'Root';
    extractChanges(delta, rootName, propsChanges, stateChanges);

    // Deduplicate changes - same key, component, and values should only appear once
    // Use a Set to track unique changes based on key + component + oldValue + newValue
    const deduplicateChanges = (changes: SnapshotDiff['stateChanges'] | SnapshotDiff['propsChanges']) => {
      const seen = new Set<string>();
      return changes.filter((change) => {
        const key = `${change.component}::${change.key}::${JSON.stringify(change.oldValue)}::${JSON.stringify(change.newValue)}`;
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
    };

    const deduplicatedStateChanges = deduplicateChanges(stateChanges) as SnapshotDiff['stateChanges'];
    const deduplicatedPropsChanges = deduplicateChanges(propsChanges) as SnapshotDiff['propsChanges'];

    // Sort changes to prioritize meaningful changes (board changes before currentPlayer, etc.)
    const prioritizeChanges = (changes: SnapshotDiff['stateChanges'] | SnapshotDiff['propsChanges']) => {
      return [...changes].sort((a, b) => {
        // Prioritize board changes
        const aIsBoard = a.key.startsWith('board');
        const bIsBoard = b.key.startsWith('board');
        if (aIsBoard && !bIsBoard) return -1;
        if (!aIsBoard && bIsBoard) return 1;
        
        // Then prioritize array index changes (more specific)
        const aHasIndex = a.key.includes('[');
        const bHasIndex = b.key.includes('[');
        if (aHasIndex && !bHasIndex) return -1;
        if (!aHasIndex && bHasIndex) return 1;
        
        // Otherwise maintain original order
        return 0;
      });
    };

    const prioritizedStateChanges = prioritizeChanges(deduplicatedStateChanges) as SnapshotDiff['stateChanges'];
    const prioritizedPropsChanges = prioritizeChanges(deduplicatedPropsChanges) as SnapshotDiff['propsChanges'];

    // Only count state changes since props changes are redundant
    const changeCount = prioritizedStateChanges.length;

    // Determine change type based on count
    let changeType: SnapshotDiff['changeType'] = 'small';
    if (changeCount === 0) {
      changeType = 'initial';
    } else if (changeCount <= 3) {
      changeType = 'small';
    } else if (changeCount <= 7) {
      changeType = 'medium';
    } else {
      changeType = 'large';
    }

    return {
      changeCount,
      changeType,
      propsChanges: [], // Not displayed - props changes are redundant with state changes
      stateChanges: prioritizedStateChanges,
      hasChanges: changeCount > 0,
    };
  } catch (error) {
    console.error('Error calculating snapshot diff:', error);
    return {
      changeCount: 0,
      changeType: 'initial',
      propsChanges: [],
      stateChanges: [],
      hasChanges: false,
    };
  }
}

/**
 * Formats a value for display in the diff view
 * Truncates long values for sidebar display
 */
export function formatDiffValue(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (typeof value === 'string') {
    // Truncate long strings for sidebar
    const maxLength = 30;
    if (value.length > maxLength) {
      return `"${value.substring(0, maxLength)}..."`;
    }
    return `"${value}"`;
  }
  if (typeof value === 'object') {
    try {
      const str = JSON.stringify(value);
      // Truncate long JSON strings for sidebar
      const maxLength = 40;
      if (str.length > maxLength) {
        return `${str.substring(0, maxLength)}...`;
      }
      return str;
    } catch {
      return '[Object]';
    }
  }
  const str = String(value);
  // Truncate long numbers/other values
  const maxLength = 30;
  if (str.length > maxLength) {
    return `${str.substring(0, maxLength)}...`;
  }
  return str;
}

