import type { ParserResult, ArchitectureElement, Relationship } from '@/types';
import { BaseParser } from './baseParser';

interface OpenApiSpec {
  info?: {
    title?: string;
    version?: string;
    description?: string;
  };
  paths?: Record<string, Record<string, { operationId?: string }>>;
  components?: {
    schemas?: Record<string, unknown>;
  };
}

export class OpenApiParser extends BaseParser {
  type: 'openapi' = 'openapi';
  
  protected doParse(content: string): ParserResult {
    const elements: ArchitectureElement[] = [];
    const relationships: Relationship[] = [];
    
    try {
      const spec = JSON.parse(content) as OpenApiSpec;
      
      if (spec.info) {
        elements.push({
          id: 'api-info',
          name: spec.info.title || 'API',
          type: 'api',
          perspective: ['product', 'technology'],
          properties: {
            version: spec.info.version,
            description: spec.info.description
          }
        });
      }
      
      if (spec.paths) {
        let elementId = 0;
        let relId = 0;
        
        for (const [path, methods] of Object.entries(spec.paths)) {
          elements.push({
            id: `element-${elementId++}`,
            name: path,
            type: 'endpoint',
            perspective: ['product', 'technology']
          });
          
          if (methods && typeof methods === 'object') {
            const methodKeys = Object.keys(methods);
            for (const method of methodKeys) {
              const methodInfo = methods[method];
              if (methodInfo && typeof methodInfo === 'object' && methodInfo.operationId) {
                elements.push({
                  id: `element-${elementId++}`,
                  name: methodInfo.operationId,
                  type: 'operation',
                  perspective: ['product', 'technology'],
                  properties: { method: method.toUpperCase() }
                });
                
                relationships.push({
                  id: `rel-${relId++}`,
                  sourceId: path,
                  targetId: methodInfo.operationId,
                  type: 'has',
                  perspective: ['product', 'technology']
                });
              }
            }
          }
        }
      }
      
      if (spec.components?.schemas) {
        let elementId = 0;
        
        for (const [name, schema] of Object.entries(spec.components.schemas)) {
          elements.push({
            id: `element-${elementId++}`,
            name,
            type: 'schema',
            perspective: ['technology'],
            properties: schema as Record<string, unknown>
          });
        }
      }
      
      return {
        success: true,
        elements,
        relationships
      };
    } catch {
      return {
        success: false,
        elements: [],
        relationships: [],
        errors: ['无效的 OpenAPI JSON']
      };
    }
  }
}