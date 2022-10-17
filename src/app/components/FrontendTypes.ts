export interface PerfData {
  barStack: BarStackProp[],
  componentData?: Record<string, unknown>,
  maxTotalRender: number,
}

interface BarStackProp {
  snapshotId: string,
  route: URL,
}
