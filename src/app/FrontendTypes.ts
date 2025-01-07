import { SeriesPoint } from '@visx/shape/lib/types';
import { Dispatch } from 'redux';

export interface ActionObj {
  name: string;
  seriesName: string;
  currentTab: string;
}
export interface Series {
  data: {
    barStack: ActionObj[];
  };
  name: string;
}

export interface PerfData {
  barStack: BarStackProp[];
  componentData?: Record<string, unknown>;
  maxTotalRender: number;
}

export interface PerformanceVisxProps {
  width: number;
  height: number;
  snapshots: any[];
  hierarchy: any;
}

export interface TreeProps {
  snapshot: {
    name?: string;
    componentData?: object;
    state?: string | object;
    stateSnaphot?: object;
    children?: any[];
  };
  snapshots?: [];
  currLocation?: object;
}

export interface BarStackProp {
  snapshotId: string;
  route: string;
  currentTab?: string;
}

export interface TooltipData {
  bar: SeriesPoint<snapshot>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
  name?: string;
}

export interface snapshot {
  snapshotId?: string;
  children: [];
  componentData: { actualDuration: number } | undefined;
  name: string;
  state: string;
}

export interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BarGraphBase {
  width: number;
  height: number;
  data: PerfData;
  comparison: Series[];
}

export interface BarGraphComparisonProps extends BarGraphBase {
  setSeries: (e: boolean | string) => void;
  series: number;
  setAction: (e: boolean | string) => void;
}

export interface BarGraphProps extends BarGraphBase {
  setRoute: () => void;
  allRoutes: unknown;
  filteredSnapshots: unknown;
  snapshot: unknown;
  setSnapshot: () => void;
}

export interface BarGraphComparisonAction {
  action: ActionObj;
  data: ActionObj[];
  width: number;
  height: number;
  comparison: Series[];
  setSeries: (e: boolean | string) => void;
  series?: number;
  setAction: (e: boolean | string) => void;
}

export interface ActionContainerProps {
  snapshots?: any;
  currLocation?: any;
}

export interface ProvConContainerProps {
  currentSnapshot: any;
}

export interface StateContainerProps {
  snapshot: Record<
    number,
    {
      name?: string;
      componentData?: Record<string, unknown>;
      state?: Record<string, unknown>;
      stateSnaphot?: Record<string, unknown>;
      children?: unknown[];
    }
  >;
  toggleActionContainer?: any;
  webMetrics?: object;
  hierarchy: Record<string, unknown>;
  snapshots?: [];
  viewIndex?: number;
  currLocation?: object;
}

export interface TravelContainerProps {
  snapshotsLength: number;
}

export interface Obj {
  stateSnapshot: {
    route: any;
    children: any[];
  };
  name: number;
  branch: number;
  index: number;
  children?: [];
}

export interface RootState {
  main: MainState;
}

export interface InitialState {
  port: null | chrome.runtime.Port;
  currentTab: null | number;
  currentTitle: null | string;
  tabs: {} | { [k: string]: { [k: string]: unknown } };
  currentTabInApp: null | string;
  connectionStatus: boolean;
  connectRequested: boolean;
}

export interface MainState {
  port: null | chrome.runtime.Port;
  currentTab: number;
  currentTitle: string;
  tabs: { [k: string]: { [k: string]: unknown } };
  currentTabInApp: string;
  connectionStatus: boolean;
  connectRequested: boolean;
}

export interface CurrentTab {
  currBranch: number;
  currLocation: { [k: string]: any };
  currParent: number;
  hierarchy: {
    stateSnapshot: {
      route: any;
      children: any[];
    };
    name: number;
    branch: number;
    index: number;
    children?: [];
  };
  index: number;
  intervalId: null | number;
  mode: { paused: boolean };
  playing: boolean;
  seriesSavedStatus: boolean;
  sliderIndex: number;
  snapshots: { [k: string]: any }[];
  status: { [k: string]: any };
  title: string;
  viewIndex: number;
  webMetrics: {
    LCP: undefined | number;
    FID: undefined | number;
    FCP: undefined | number;
    TTFB: undefined | number;
    CLS: undefined | number;
    INP: undefined | number;
  };
}

export interface DiffProps {
  snapshot: { state?: Record<string, unknown> };
  show?: boolean | undefined;
}

/**
 * @template ActionProps Props for the action component
 */

export interface ActionProps {
  key: string;
  selected: boolean;
  last: boolean;
  index: number;
  sliderIndex: number;
  displayName: string;
  componentName: string;
  componentData: { actualDuration: number } | undefined;
  routePath: unknown;
  state?: Record<string, unknown>;
  viewIndex: number | undefined;
  isCurrIndex: boolean;
}

export interface DiffRouteProps {
  snapshot: Record<
    string,
    {
      name?: string;
      componentData?: Record<string, unknown>;
      state?: string | unknown;
      stateSnaphot?: Record<string, unknown>;
      children?: unknown[];
    }
  >;
}

export interface HandleProps {
  value: number;
  dragging: boolean;
  index: number;
}

export interface MainSliderProps {
  className?: string;
  snapshots?: any[];
}

export interface DefaultMargin {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface StateRouteProps {
  snapshot: {
    name?: string;
    componentData?: object;
    state?: string | object;
    stateSnaphot?: object;
    children?: any[];
  };
  hierarchy: any;
  snapshots: [];
  viewIndex: number;
  webMetrics: object;
  currLocation: object;
}

export interface DropdownProps {
  selectedSpeed: { value: number; label: string };
  speeds: { value: number; label: string }[];
  setSpeed: () => void;
}

export interface TutorialProps {
  dispatch: Dispatch;
  currentTabInApp: string;
}

export interface TutorialState {
  stepsEnabled: boolean;
}

export interface StepsObj {
  title: string;
  element?: string | Element;
  intro: string;
  position: string;
}

export interface LinkControlProps {
  orientation: string;
  linkType: string;
  stepPercent: number;
  selectedNode: string;
  setOrientation: (orientation: string) => void;
  setLinkType: (linkType: string) => void;
  setStepPercent: (percent: number) => void;
  setSelectedNode: (selectedNode: string) => void;
  snapShots: Record<string, unknown>;
}

export interface ControlStyles {
  padding: string;
}

export interface DropDownStyle {
  margin: string;
  fontFamily: string;
  borderRadius: string;
  borderStyle: string;
  borderWidth: string;
  backgroundColor: string;
  color: string;
  padding: string;
}

export interface Node {
  children?: Node[];
  name?: string;
}

export interface LinkComponent {
  linkType: string;
  orientation: string;
}

export interface LinkTypesProps {
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  snapshots: Record<string, unknown>;
  currentSnapshot?: Record<string, unknown>;
}

export interface ToolTipStyles {
  defaultStyles: React.CSSProperties;
  minWidth: number;
  maxWidth: number;
  backgroundColor: string;
  color: string;
  fontSize: string;
  lineHeight: string;
  fontFamily: string;
  zIndex: number;
  pointerEvents: string;
}

export interface OptionsCursorTrueWithMargin {
  followCursor: boolean;
  shiftX: number;
  shiftY: number;
}

export interface StatelessCleaning {
  name?: string;
  componentData?: Record<string, unknown>;
  state?: string | {};
  stateSnaphot?: Record<string, unknown>;
  children?: StatelessCleaning[];
}

export interface Snapshots {
  snapshot: number;
  component1: number;
  component2: number;
  component3: number;
  'all others': number;
}

export interface ErrorContainerProps {
  port: chrome.runtime.Port | null;
}

export interface AxContainer {
  axSnapshots: [];
  snapshot: {
    name?: string;
    componentData?: object;
    state?: string | object;
    stateSnaphot?: object;
    children?: any[];
  };
  snapshots: [];
  currLocation: object;
  setShowTree: any;
  setShowParagraph: any;
}

export interface FilteredNode {
  name?: string;
  state?: any;
  hooksState?: any;
  props?: any;
  componentData?: {
    context?: any;
    hooksState?: any;
    props?: any;
  };
  children?: FilteredNode[];
  context?: any;
}

export interface FilteredNodeChildren {
  [key: string]: FilteredNode;
}
