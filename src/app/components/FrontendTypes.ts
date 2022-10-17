import { SeriesPoint } from '@visx/shape/lib/types';

export interface PerfData {
  barStack: BarStackProp[],
  componentData?: Record<string, unknown>,
  maxTotalRender: number,
}

interface BarStackProp {
  snapshotId: string,
  route: URL,
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
  componentData: any;
  name: string;
  state: string;
}

export interface margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface BarGraphBase {
  width: number,
  height: number,
  data: PerfData,
  comparison: string | [],
}
export interface BarGraphComparisonProps extends BarGraphBase {
  setSeries: () => void,
  series: unknown,
  setAction: () => void,
}

export interface BarGraphProps extends BarGraphBase{
  setRoute: () => void,
  allRoutes: unknown,
  filteredSnapshots: unknown,
  snapshot: unknown,
  setSnapshot: () => void
}
