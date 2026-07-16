export type DiagramType = 
  | 'c4'
  | 'sequence'
  | 'state'
  | 'class'
  | 'flowchart'
  | 'dbml'
  | 'openapi';

export type PerspectiveType = 
  | 'business'
  | 'product'
  | 'technology';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface ArchitectureElement {
  id: string;
  name: string;
  type: string;
  description?: string;
  perspective: PerspectiveType[];
  position?: Position;
  size?: Size;
  properties?: Record<string, unknown>;
}

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
  label?: string;
  perspective: PerspectiveType[];
}

export interface Diagram {
  id: string;
  name: string;
  type: DiagramType;
  perspective: PerspectiveType;
  elements: ArchitectureElement[];
  relationships: Relationship[];
  dslContent: string;
}

export interface Project {
  id: string;
  name: string;
  diagrams: Diagram[];
  activeDiagramId: string;
  activePerspective: PerspectiveType;
}

export interface ParserResult {
  success: boolean;
  elements: ArchitectureElement[];
  relationships: Relationship[];
  errors?: string[];
}

export interface RenderResult {
  success: boolean;
  svg?: string;
  errors?: string[];
}