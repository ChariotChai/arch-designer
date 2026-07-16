import type { PerspectiveType, ArchitectureElement, Relationship, Diagram } from '@/types';

export interface PerspectiveFilter {
  elements: ArchitectureElement[];
  relationships: Relationship[];
}

export const perspectiveLabels: Record<PerspectiveType, string> = {
  business: '业务架构',
  product: '产品架构',
  technology: '技术架构'
};

export function applyPerspective(
  diagram: Diagram,
  perspective: PerspectiveType
): PerspectiveFilter {
  const filteredElements = diagram.elements.filter((el) =>
    el.perspective.includes(perspective)
  );
  
  const elementIds = new Set(filteredElements.map((el) => el.id));
  const filteredRelationships = diagram.relationships.filter(
    (rel) => elementIds.has(rel.sourceId) && elementIds.has(rel.targetId)
  );
  
  return {
    elements: filteredElements,
    relationships: filteredRelationships
  };
}

export function filterDiagramsByPerspective(
  diagrams: Diagram[],
  perspective: PerspectiveType
): Diagram[] {
  return diagrams.filter((d) => d.perspective === perspective);
}