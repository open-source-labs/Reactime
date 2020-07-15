import * as PropTypes from 'prop-types';
import { EventListenerOptions, EventTypes } from './types';
declare function EventListener<T extends EventTypes>(props: EventListenerOptions<T>): any;
declare namespace EventListener {
    var displayName: string;
    var propTypes: {
        capture: PropTypes.Requireable<boolean>;
        listener: PropTypes.Validator<(...args: any[]) => any>;
        targetRef: PropTypes.Validator<import("react").RefObject<Node | Window>>;
        type: PropTypes.Validator<"waiting" | "error" | "abort" | "cancel" | "progress" | "ended" | "change" | "input" | "select" | "fullscreenchange" | "fullscreenerror" | "readystatechange" | "visibilitychange" | "animationcancel" | "animationend" | "animationiteration" | "animationstart" | "auxclick" | "blur" | "canplay" | "canplaythrough" | "click" | "close" | "contextmenu" | "cuechange" | "dblclick" | "drag" | "dragend" | "dragenter" | "dragexit" | "dragleave" | "dragover" | "dragstart" | "drop" | "durationchange" | "emptied" | "focus" | "gotpointercapture" | "invalid" | "keydown" | "keypress" | "keyup" | "load" | "loadeddata" | "loadedmetadata" | "loadend" | "loadstart" | "lostpointercapture" | "mousedown" | "mouseenter" | "mouseleave" | "mousemove" | "mouseout" | "mouseover" | "mouseup" | "pause" | "play" | "playing" | "pointercancel" | "pointerdown" | "pointerenter" | "pointerleave" | "pointermove" | "pointerout" | "pointerover" | "pointerup" | "ratechange" | "reset" | "resize" | "scroll" | "securitypolicyviolation" | "seeked" | "seeking" | "stalled" | "submit" | "suspend" | "timeupdate" | "toggle" | "touchcancel" | "touchend" | "touchmove" | "touchstart" | "transitioncancel" | "transitionend" | "transitionrun" | "transitionstart" | "volumechange" | "wheel" | "copy" | "cut" | "paste">;
    } | {
        capture?: undefined;
        listener?: undefined;
        targetRef?: undefined;
        type?: undefined;
    };
    var defaultProps: {
        capture: boolean;
    };
}
export default EventListener;
