import type { ParserResult, ArchitectureElement, Relationship } from '@/types';
import { BaseParser } from './baseParser';

export class MermaidParser extends BaseParser {
  type: 'flowchart' = 'flowchart';
  
  protected doParse(content: string): ParserResult {
    const elements: ArchitectureElement[] = [];
    const relationships: Relationship[] = [];
    
    const lines = content.split('\n');
    let elementId = 0;
    let relId = 0;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.match(/^[\w_]+[\s=]+>/)) {
        const parts = trimmedLine.split('-->');
        if (parts.length === 2) {
          const source = parts[0].trim();
          const targetPart = parts[1].trim();
          
          const sourceId = `element-${elementId++}`;
          elements.push({
            id: sourceId,
            name: source,
            type: 'node',
            perspective: ['business', 'product', 'technology']
          });
          
          const targetMatch = targetPart.match(/^[\w_]+/);
          if (targetMatch) {
            const targetId = `element-${elementId++}`;
            elements.push({
              id: targetId,
              name: targetMatch[0],
              type: 'node',
              perspective: ['business', 'product', 'technology']
            });
            
            const labelMatch = targetPart.match(/\|(.+)\|/);
            relationships.push({
              id: `rel-${relId++}`,
              sourceId,
              targetId,
              type: 'flow',
              label: labelMatch ? labelMatch[1] : undefined,
              perspective: ['business', 'product', 'technology']
            });
          }
        }
      } else if (trimmedLine.match(/^[\w_]+:/)) {
        const match = trimmedLine.match(/^([\w_]+):\s*(.+)/);
        if (match) {
          elements.push({
            id: `element-${elementId++}`,
            name: match[2],
            type: 'node',
            perspective: ['business', 'product', 'technology']
          });
        }
      }
    }
    
    return {
      success: true,
      elements,
      relationships
    };
  }
}