import { SeriesPoint } from '@visx/shape/lib/types';

// PerformanceVisx types

export interface Series {
  data: {
    barStack: ActionObj[];
  };
  name: string;
}

// interface Event {
//     target: EventTarget
// }

// interface EventTarget {
//   x: WithParentSizeProvidedProps,
//   y: OptionalKeys,
//   value?: idk
//   }

export interface ActionObj {
  name: string;
  seriesName: string;
  currentTab: string;
}

export interface PerfData {
  barStack: BarStackProp[];
  componentData?: Record<string, unknown>;
  maxTotalRender: number;
}

export interface BarStackProp {
  snapshotId: string;
  route: string;
  currentTab?: string;
}

// On-hover data for BarGraph/BarGraphComparison.tsx
export interface TooltipData {
  bar: SeriesPoint<snapshot>;
  key: string;
  index: number;
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
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
