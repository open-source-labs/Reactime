export interface ComponentData {
  context?: Record<string, any>;
  props?: Record<string, any>;
  hooksState?: Record<string, any>;
  reducerStates?: Record<string, any>;
}

export interface Node {
  name?: string;
  componentData?: ComponentData;
  props?: Record<string, any>;
  children?: Node[];
}

export interface FilteredNode {
  [key: string]: any;
}

export interface JsonTheme {
  scheme: string;
  base00: string;
  base0B: string;
  base0D: string;
  base09: string;
  base0C: string;
} 