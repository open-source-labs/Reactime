import * as React from 'react';
export declare type EventListeners = CallableEventListener[];
export declare type CallableEventListener = EventListener & {
    called?: boolean;
};
export declare type InputEventListener = EventListener | EventListener[];
export declare type InputTargetElement = boolean | string | TargetElement | React.RefObject<TargetElement>;
export declare type TargetElement = Document | HTMLElement | Window;
export declare type GenericMap<T> = Map<String, T>;
export declare type Options = {
    pool?: string;
    target?: InputTargetElement;
};
