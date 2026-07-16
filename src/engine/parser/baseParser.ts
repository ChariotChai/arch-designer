import type { ParserResult, DiagramType } from '@/types';

export abstract class BaseParser {
  abstract type: DiagramType;
  
  parse(content: string): ParserResult {
    try {
      return this.doParse(content);
    } catch (error) {
      return {
        success: false,
        elements: [],
        relationships: [],
        errors: [error instanceof Error ? error.message : '解析失败']
      };
    }
  }
  
  protected abstract doParse(content: string): ParserResult;
}