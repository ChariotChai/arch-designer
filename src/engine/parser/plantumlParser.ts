import type { ParserResult, ArchitectureElement, Relationship } from '@/types';
import { BaseParser } from './baseParser';

export class PlantUmlParser extends BaseParser {
  type: 'c4' = 'c4';
  
  protected doParse(content: string): ParserResult {
    const elements: ArchitectureElement[] = [];
    const relationships: Relationship[] = [];
    const errors: string[] = [];
    
    const lines = content.split('\n');
    let elementId = 0;
    let relId = 0;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('actor ')) {
        const match = trimmedLine.match(/actor\s+(.+?)\s+as\s+(\w+)/);
        if (match) {
          elements.push({
            id: `element-${elementId++}`,
            name: match[1],
            type: 'actor',
            perspective: ['business', 'product', 'technology']
          });
        }
      } else if (trimmedLine.startsWith('rectangle ')) {
        const match = trimmedLine.match(/rectangle\s+"?(.+?)"?\s+as\s+(\w+)/);
        if (match) {
          elements.push({
            id: `element-${elementId++}`,
            name: match[1],
            type: 'rectangle',
            perspective: ['business', 'product', 'technology']
          });
        }
      } else if (trimmedLine.startsWith('database ')) {
        const match = trimmedLine.match(/database\s+"?(.+?)"?\s+as\s+(\w+)/);
        if (match) {
          elements.push({
            id: `element-${elementId++}`,
            name: match[1],
            type: 'database',
            perspective: ['technology']
          });
        }
      } else if (trimmedLine.includes('-->')) {
        const parts = trimmedLine.split('-->');
        if (parts.length === 2) {
          const source = parts[0].trim();
          const targetPart = parts[1].trim();
          const targetMatch = targetPart.match(/^(\w+)/);
          const labelMatch = targetPart.match(/:\s+(.+)$/);
          
          if (targetMatch) {
            relationships.push({
              id: `rel-${relId++}`,
              sourceId: source,
              targetId: targetMatch[1],
              type: 'association',
              label: labelMatch ? labelMatch[1] : undefined,
              perspective: ['business', 'product', 'technology']
            });
          }
        }
      }
    }
    
    return {
      success: true,
      elements,
      relationships,
      errors: errors.length > 0 ? errors : undefined
    };
  }
}