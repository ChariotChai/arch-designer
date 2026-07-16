import type { ParserResult, ArchitectureElement, Relationship } from '@/types';
import { BaseParser } from './baseParser';

export class DbmlParser extends BaseParser {
  type: 'dbml' = 'dbml';
  
  protected doParse(content: string): ParserResult {
    const elements: ArchitectureElement[] = [];
    const relationships: Relationship[] = [];
    
    const lines = content.split('\n');
    let elementId = 0;
    let relId = 0;
    let currentTable = '';
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('Table ')) {
        const match = trimmedLine.match(/Table\s+(\w+)/);
        if (match) {
          currentTable = match[1];
          elements.push({
            id: `element-${elementId++}`,
            name: match[1],
            type: 'table',
            perspective: ['technology']
          });
        }
      } else if (trimmedLine.startsWith('Ref:')) {
        const match = trimmedLine.match(/Ref:\s*(\w+)\.\w+\s*<>\s*(\w+)\.\w+/);
        if (match) {
          relationships.push({
            id: `rel-${relId++}`,
            sourceId: match[1],
            targetId: match[2],
            type: 'foreign_key',
            perspective: ['technology']
          });
        }
      } else if (currentTable && trimmedLine.match(/^\s+\w+\s+\w+/)) {
        const match = trimmedLine.match(/^\s+(\w+)\s+(\w+)/);
        if (match) {
          elements.push({
            id: `element-${elementId++}`,
            name: `${currentTable}.${match[1]}`,
            type: 'column',
            perspective: ['technology'],
            properties: { type: match[2] }
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