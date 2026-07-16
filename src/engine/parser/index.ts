import type { DiagramType, ParserResult } from '@/types';
import { PlantUmlParser } from './plantumlParser';
import { MermaidParser } from './mermaidParser';
import { DbmlParser } from './dbmlParser';
import { OpenApiParser } from './openapiParser';

const parsers: Record<DiagramType, PlantUmlParser | MermaidParser | DbmlParser | OpenApiParser> = {
  c4: new PlantUmlParser(),
  sequence: new PlantUmlParser(),
  state: new PlantUmlParser(),
  class: new PlantUmlParser(),
  flowchart: new MermaidParser(),
  dbml: new DbmlParser(),
  openapi: new OpenApiParser()
};

export function parse(dslContent: string, type: DiagramType): ParserResult {
  const parser = parsers[type];
  if (!parser) {
    return {
      success: false,
      elements: [],
      relationships: [],
      errors: [`不支持的图表类型: ${type}`]
    };
  }
  return parser.parse(dslContent);
}