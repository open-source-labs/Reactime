import * as React from 'react';
import { InputEventListener, GenericMap, InputTargetElement, TargetElement, EventListeners } from '../types';
/**
 * An IE11-compatible function.
 *
 * @see https://jsperf.com/suir-clone-map
 */
export declare function cloneMap<T>(map: GenericMap<T>): GenericMap<T>;
export declare function normalizeHandlers(handlers: InputEventListener): EventListeners;
/**
 * Asserts that the passed value is React.RefObject
 *
 * @see https://github.com/facebook/react/blob/v16.8.2/packages/react-reconciler/src/ReactFiberCommitWork.js#L665
 */
export declare const isRefObject: <T>(ref: any) => ref is React.RefObject<T>;
/**
 * Normalizes `target` for EventStack, because `target` can be passed as `boolean` or `string`.
 *
 * @see https://jsperf.com/suir-normalize-target
 */
export declare function normalizeTarget(target: InputTargetElement): TargetElement;
