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

// conditional's to adjust the controls for the componentMap drop downs
export default function getLinkComponent({
  layout,
  linkType,
  orientation,
}: {
  layout: string;
  linkType: string;
  orientation: string;
}): React.ComponentType<any> {
  let LinkComponent: React.ComponentType<any>;

  if (layout === 'polar') {
    if (linkType === 'step') {
      LinkComponent = LinkRadialStep;
    } else if (linkType === 'line') {
      LinkComponent = LinkRadialLine;
    } else {
      LinkComponent = LinkRadial;
    }
  } else if (orientation === 'vertical') {
    if (linkType === 'step') {
      LinkComponent = LinkVerticalStep;
    } else if (linkType === 'line') {
      LinkComponent = LinkVerticalLine;
    } else {
      LinkComponent = LinkVertical;
    }
  } else if (linkType === 'step') {
    LinkComponent = LinkHorizontalStep;
  } else if (linkType === 'line') {
    LinkComponent = LinkHorizontalLine;
  } else {
    LinkComponent = LinkHorizontal;
  }
  return LinkComponent;
}
