/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 'reactime' module has a single export
 * @function linkFiber
 */
// regenerator runtime supports async functionality
import 'regenerator-runtime/runtime';
import linkFiberStart from './routers/linkFiber';
import timeJumpStart from './controllers/timeJump';
import { Snapshot, Status, MsgData } from './types/backendTypes';
import componentActionsRecord from './models/masterState';
import routes from './models/routes';

// * State snapshot object initialized here
const snapShot: Snapshot = {
  tree: null,
};

const mode: Status = {
  jumping: false,
  paused: false,
};

// linkFiber is now assigned the default function exported from the file linkFiber.ts
console.log('Index ts', { snapShot: JSON.parse(JSON.stringify(snapShot)) });
const linkFiber = linkFiberStart(snapShot, mode);
// timeJump is now assigned the default function exported from the file timeJump.ts
const timeJump = timeJumpStart(mode);

// * Event listener for time-travel actions
window.addEventListener('message', ({ data: { action, payload } }: MsgData) => {
  switch (action) {
    case 'jumpToSnap':
      console.log('Index ts', { payload });
      console.log('Index ts', { componentAction: componentActionsRecord.getAllComponents() });
      // Set mode to jumping to prevent snapShot being sent to frontEnd
      mode.jumping = true;
      // Check if we need to navigate to another route
      const needNavigation: boolean = routes.navigate(payload.route);
      // If need to navigate
      if (needNavigation) {
        // Pass timeJump function to mode.jumping => which will be invoked during onCommitFiberRoot:
        mode.navigating = () => timeJump(payload, true);
        // Navigate to the new route
        // Navigate to a new route will cause ReactFiber to re-render
        // => this in-turn will invoke onCommitFiberRoot inside linkFiber.ts
        // window.location.href = payload.route.url;
      } else {
        timeJump(payload, true); // * This sets state with given payload
      }
      break;

    case 'setPause':
      console.log('PAUSED');
      mode.paused = payload;
      break;

    default:
      break;
  }
});
// connect to dev tools and new fiber,
// invokes anonymous function from linkFiber.ts set to linkFiber on line 30
linkFiber();
