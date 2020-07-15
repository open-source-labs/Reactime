import * as React from 'react'
import {
  InputEventListener,
  GenericMap,
  InputTargetElement,
  TargetElement,
  EventListeners,
} from '../types'

/**
 * An IE11-compatible function.
 *
 * @see https://jsperf.com/suir-clone-map
 */
export function cloneMap<T>(map: GenericMap<T>): GenericMap<T> {
  const newMap = new Map()

  map.forEach((value, key) => {
    newMap.set(key, value)
  })

  return newMap
}

export function normalizeHandlers(handlers: InputEventListener): EventListeners {
  return Array.isArray(handlers) ? handlers : [handlers]
}

/**
 * Asserts that the passed value is React.RefObject
 *
 * @see https://github.com/facebook/react/blob/v16.8.2/packages/react-reconciler/src/ReactFiberCommitWork.js#L665
 */
export const isRefObject = <T>(ref: any): ref is React.RefObject<T> =>
  // eslint-disable-next-line
  ref !== null && typeof ref === 'object' && ref.hasOwnProperty('current')

/**
 * Normalizes `target` for EventStack, because `target` can be passed as `boolean` or `string`.
 *
 * @see https://jsperf.com/suir-normalize-target
 */
export function normalizeTarget(target: InputTargetElement): TargetElement {
  if (target === 'document') return document
  if (target === 'window') return window
  if (isRefObject(target)) return target.current || document

  return (target as HTMLElement) || document
}
