import type { DiagramType, RenderResult } from '@/types';
import { renderMermaid } from './mermaidRenderer';

export async function render(dslContent: string, type: DiagramType): Promise<RenderResult> {
  return renderMermaid(dslContent, type);
}