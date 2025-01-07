import {
  LinkHorizontal,
  LinkVertical,
  LinkRadial,
  LinkHorizontalStep,
  LinkVerticalStep,
  LinkRadialStep,
  LinkHorizontalCurve,
  LinkVerticalCurve,
  LinkRadialCurve,
  LinkHorizontalLine,
  LinkVerticalLine,
  LinkRadialLine,
} from '@visx/shape';
import { LinkComponent } from '../../../FrontendTypes';

/*
  Changes the shape of the LinkComponent based on the linkType, and orientation
*/

export default function getLinkComponent({
  linkType,
  orientation,
}: LinkComponent): React.ComponentType<unknown> {
  let LinkComponent: React.ComponentType<unknown>;

if (orientation === 'vertical') {
    // if the orientation is vertical, linkType can be either step, curve, line, or a plain LinkVertical
    if (linkType === 'step') {
      LinkComponent = LinkVerticalStep;
    } else if (linkType === 'curve') {
      LinkComponent = LinkVerticalCurve;
    } else if (linkType === 'line') {
      LinkComponent = LinkVerticalLine;
    } else {
      LinkComponent = LinkVertical;
    }
  } else if (linkType === 'step') {
    // if orientation and layout still haven't matched, linkType will determine our linkComponent type based on if linkType is step, curve, line, or a plain LinkHorizontal
    LinkComponent = LinkHorizontalStep;
  } else if (linkType === 'curve') {
    LinkComponent = LinkHorizontalCurve;
  } else if (linkType === 'line') {
    LinkComponent = LinkHorizontalLine;
  } else {
    LinkComponent = LinkHorizontal;
  }
  return LinkComponent;
}
