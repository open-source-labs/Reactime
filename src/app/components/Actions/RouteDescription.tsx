import React, { useRef, useEffect, useState } from 'react';
import VerticalSlider from '../TimeTravel/VerticalSlider';

/*
  Render's the red route description on app's left sided column between the clear button and the list of state snapshots. The route description is derived from the first state snapshot.
*/

type RouteProps = {
  actions: JSX.Element[];
};

const RouteDescription = (props: RouteProps): JSX.Element => {
  const { actions = [] } = props;
  const actionsContainerRef = useRef(null as HTMLDivElement | null);
  const [contentHeight, setContentHeight] = useState(0);
  const ignoreResizeObserverRef = useRef(false); // Flag to ignore ResizeObserver after clear button
  const ignoreResizeDuringCollapseRef = useRef(false); // Flag to ignore ResizeObserver during collapse transition
  const previousExpandedHeightRef = useRef(0); // Store expanded height for collapse comparison

  // Safety check for actions
  if (!Array.isArray(actions) || actions.length === 0) {
    return <div className='route-container' />;
  }

  const url: URL = new URL(actions[0].props.routePath); // Use new URL to use the url.pathname method.

  // Extract expandedIndex from actions to react to expansion changes
  // Each Action component has expandedIndex prop, so we can get it from any action
  const expandedIndex = actions[0]?.props?.expandedIndex ?? null;

  // Track previous expandedIndex to detect collapse transitions
  const prevExpandedIndexRef = useRef(expandedIndex);

  // Track previous actions.length to detect clear button (sudden decrease)
  const prevActionsLengthRef = useRef(actions.length);
  
  // Reset contentHeight when actions.length changes significantly (e.g., clear button)
  // Detect clear button by checking if actions.length decreased significantly
  useEffect(() => {
    // Detect clear button: actions.length decreased significantly (more than 1)
    const isClearButton = prevActionsLengthRef.current > 1 && actions.length <= 1;
    if (isClearButton) {
      // Force reset to baseMinHeight immediately to prevent stale measurements
      const newBaseMinHeight = actions.length * 40.5;
      setContentHeight(newBaseMinHeight);
      // Ignore ResizeObserver for 200ms to prevent stale measurements from overriding the reset
      ignoreResizeObserverRef.current = true;
      setTimeout(() => {
        ignoreResizeObserverRef.current = false;
      }, 200);
    }
    prevActionsLengthRef.current = actions.length;
  }, [actions.length]);

  // Calculate height dynamically based on actual content
  // This updates when actions change or when snapshots expand/collapse
  useEffect(() => {
    // Detect if we're collapsing (transitioning from expanded to collapsed)
    const isCollapsing = prevExpandedIndexRef.current !== null && expandedIndex === null;
    
    // Set ignoreResizeDuringCollapseRef IMMEDIATELY when collapsing to prevent ResizeObserver from measuring stale expanded height
    if (isCollapsing) {
      ignoreResizeDuringCollapseRef.current = true;
      // Store the expanded height before setting collapsed height for comparison
      previousExpandedHeightRef.current = contentHeight;
      // Calculate expected collapsed height (baseMinHeight) and set it immediately
      // This gives immediate visual feedback while React removes the expanded content
      const expectedCollapsedHeight = actions.length * 40.5;
      setContentHeight(expectedCollapsedHeight);
    } else {
      // Not collapsing, ensure flag is cleared
      ignoreResizeDuringCollapseRef.current = false;
    }

    // Use requestAnimationFrame to ensure DOM has updated
    // Use double RAF + delay to ensure collapse/expand animations complete
    const updateHeight = () => {
      // Ignore updateHeight if we just cleared (to prevent stale measurements from overriding reset)
      if (ignoreResizeObserverRef.current) {
        return;
      }
      // Ignore updateHeight during collapse transition (remeasurement will handle it)
      if (ignoreResizeDuringCollapseRef.current) {
        return;
      }
      if (actionsContainerRef.current) {
        const height = actionsContainerRef.current.scrollHeight;
        setContentHeight(height);
      }
    };
    
    // Use double requestAnimationFrame + delay to ensure DOM and any CSS transitions have completed
    // This is especially important for collapse animations - need extra time for content to shrink
    // Use longer delay when expandedIndex is null (collapsed state) to ensure collapse animation completes
    // Use even longer delay when transitioning from expanded to collapsed
    let rafId: number;
    let timeoutId: ReturnType<typeof setTimeout>;
    let remeasureTimeoutId: ReturnType<typeof setTimeout>;
    const delay = isCollapsing ? 250 : (expandedIndex === null ? 150 : 50); // Much longer delay when collapsing
    const firstRaf = requestAnimationFrame(() => {
      rafId = requestAnimationFrame(() => {
        // Add delay after double RAF for animations to complete
        timeoutId = setTimeout(updateHeight, delay);
        
        // When collapsing, use polling to check if height has decreased
        // ResizeObserver will also detect the decrease, but polling ensures we eventually get the correct height
        if (isCollapsing) {
          // Use the stored expanded height for comparison
          const previousExpandedHeight = previousExpandedHeightRef.current;
          let pollCount = 0;
          const maxPolls = 10; // Poll for up to 1 second (10 * 100ms)
          
          const pollForCollapse = () => {
            pollCount++;
            if (actionsContainerRef.current && !ignoreResizeObserverRef.current) {
              const currentMeasuredHeight = actionsContainerRef.current.scrollHeight;
              
              // If height decreased from the expanded height, we've successfully collapsed
              if (currentMeasuredHeight < previousExpandedHeight) {
                setContentHeight(currentMeasuredHeight);
                // Re-enable ResizeObserver
                ignoreResizeDuringCollapseRef.current = false;
              } else if (pollCount < maxPolls) {
                // Keep polling
                remeasureTimeoutId = setTimeout(pollForCollapse, 100);
              } else {
                // Max polls reached, give up and re-enable ResizeObserver
                ignoreResizeDuringCollapseRef.current = false;
              }
            } else {
              // Can't measure, re-enable ResizeObserver
              ignoreResizeDuringCollapseRef.current = false;
            }
          };
          
          // Start polling after initial delay
          remeasureTimeoutId = setTimeout(pollForCollapse, delay + 100); // Start after initial measurement delay
        }
      });
    });
    
    // Update prevExpandedIndexRef after setting up the effect
    prevExpandedIndexRef.current = expandedIndex;
    
    return () => {
      cancelAnimationFrame(firstRaf);
      if (rafId) cancelAnimationFrame(rafId);
      if (timeoutId) clearTimeout(timeoutId);
      if (remeasureTimeoutId) clearTimeout(remeasureTimeoutId);
    };
  }, [actions.length, expandedIndex]); // React to changes in actions array length AND expandedIndex

  // Use ResizeObserver to update height when content changes (e.g., when details expand/collapse)
  useEffect(() => {
    if (!actionsContainerRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      // Ignore ResizeObserver if we just cleared (to prevent stale measurements)
      if (ignoreResizeObserverRef.current) {
        return;
      }
      // During collapse, only accept ResizeObserver updates that show a DECREASE in height
      // This allows us to capture the actual collapsed height when React removes the expanded content
      if (ignoreResizeDuringCollapseRef.current) {
        for (const entry of entries) {
          const newHeight = entry.contentRect.height;
          // Only accept if height actually decreased from the previous expanded height
          // Compare against the stored expanded height, not the current contentHeight
          if (newHeight < previousExpandedHeightRef.current) {
            setContentHeight(newHeight);
            // Re-enable ResizeObserver after we've captured the decrease
            ignoreResizeDuringCollapseRef.current = false;
            return;
          } else {
            // Height hasn't decreased yet, ignore this update
            return;
          }
        }
      }
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        // Always update to the actual measured height (even if smaller)
        setContentHeight(newHeight);
      }
    });

    resizeObserver.observe(actionsContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [actions.length, expandedIndex]); // Re-setup ResizeObserver when actions change OR expansion state changes

  // Calculate minimum height based on number of actions
  // This is the base height without any expanded content
  const baseMinHeight = actions.length * 40.5;

  // Use the actual content height if available, otherwise use base min height
  // IMPORTANT: Trust ResizeObserver measurements completely - it accurately measures expanded/collapsed state
  // When collapsed, ResizeObserver will measure the smaller height and update contentHeight
  // We use Math.max only to ensure we never go below baseMinHeight (safety for edge cases)
  // ResizeObserver should naturally measure >= baseMinHeight when collapsed (all snapshots still visible)
  // This allows the slider to shrink when collapsing (from expanded height to collapsed height)
  const containerHeight = contentHeight > 0 
    ? Math.max(contentHeight, baseMinHeight)  // Use measured height, with baseMinHeight as absolute floor
    : baseMinHeight; // Use base min height only when contentHeight is 0 (initial/unmeasured state)

  return (
    <div className='route-container'>
      <div className='route-header'>Route: {url.pathname}</div>
      <div className='route-content' style={{ minHeight: `${baseMinHeight}px`, height: `${containerHeight}px` }}>
        <div className='slider-wrapper' style={{ height: `${containerHeight}px`, minHeight: `${containerHeight}px` }}>
          <VerticalSlider className='main-slider' snapshots={actions} />
        </div>
        <div className='actions-container' ref={actionsContainerRef}>
          {/* actual snapshots per route */}
          {actions}
        </div>
      </div>
    </div>
  );
};

export default RouteDescription;
