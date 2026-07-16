import mermaid from 'mermaid';
import type { RenderResult, DiagramType } from '@/types';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true
  }
});

export async function renderMermaid(dslContent: string, type: DiagramType): Promise<RenderResult> {
  try {
    let mermaidContent = dslContent;
    
    if (!mermaidContent.startsWith('```')) {
      const typeMap: Record<DiagramType, string> = {
        flowchart: 'flowchart TD',
        sequence: 'sequenceDiagram',
        state: 'stateDiagram-v2',
        class: 'classDiagram',
        c4: 'flowchart TD',
        dbml: 'flowchart TD',
        openapi: 'flowchart TD'
      };
      
      if (type === 'c4' || type === 'dbml' || type === 'openapi') {
        mermaidContent = convertToMermaid(dslContent, type);
      } else if (!mermaidContent.includes(typeMap[type])) {
        mermaidContent = `${typeMap[type]}\n${mermaidContent}`;
      }
    }
    
    const { svg } = await mermaid.render(`diagram-${Date.now()}`, mermaidContent);
    return { success: true, svg };
  } catch (error) {
    return {
      success: false,
      errors: [error instanceof Error ? error.message : '渲染失败']
    };
  }
}

function convertToMermaid(content: string, type: DiagramType): string {
  if (type === 'c4') {
    return convertPlantUmlToMermaid(content);
  }
  if (type === 'dbml') {
    return convertDbmlToMermaid(content);
  }
  if (type === 'openapi') {
    return convertOpenApiToMermaid(content);
  }
  return content;
}

function convertPlantUmlToMermaid(content: string): string {
  let mermaidContent = 'flowchart TD\n';
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('actor ')) {
      const match = trimmed.match(/actor\s+(.+?)\s+as\s+(\w+)/);
      if (match) {
        mermaidContent += `  ${match[2]}[${match[1]}]\n`;
      }
    } else if (trimmed.startsWith('rectangle ')) {
      const match = trimmed.match(/rectangle\s+"?(.+?)"?\s+as\s+(\w+)/);
      if (match) {
        mermaidContent += `  ${match[2]}[${match[1]}]\n`;
      }
    } else if (trimmed.startsWith('database ')) {
      const match = trimmed.match(/database\s+"?(.+?)"?\s+as\s+(\w+)/);
      if (match) {
        mermaidContent += `  ${match[2]}[((${match[1]}))]\n`;
      }
    } else if (trimmed.includes('-->')) {
      const parts = trimmed.split('-->');
      if (parts.length === 2) {
        const source = parts[0].trim();
        const targetPart = parts[1].trim();
        const targetMatch = targetPart.match(/^(\w+)/);
        const labelMatch = targetPart.match(/:\s+(.+)$/);
        
        if (targetMatch) {
          const label = labelMatch ? `|${labelMatch[1]}|` : '';
          mermaidContent += `  ${source} -->${label} ${targetMatch[1]}\n`;
        }
      }
    }
  }
  
  return mermaidContent;
}

function convertDbmlToMermaid(content: string): string {
  let mermaidContent = 'flowchart TD\n';
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('Table ')) {
      const match = trimmed.match(/Table\s+(\w+)/);
      if (match) {
        mermaidContent += `  ${match[1]}[((${match[1]}))]\n`;
      }
    } else if (trimmed.startsWith('Ref:')) {
      const match = trimmed.match(/Ref:\s*(\w+)\.\w+\s*<>\s*(\w+)\.\w+/);
      if (match) {
        mermaidContent += `  ${match[1]} --> ${match[2]}\n`;
      }
    }
  }
  
  return mermaidContent;
}

interface OpenApiSpec {
  paths?: Record<string, Record<string, { operationId?: string }>>;
}

function convertOpenApiToMermaid(content: string): string {
  let mermaidContent = 'flowchart TD\n';
  
  try {
    const spec = JSON.parse(content) as OpenApiSpec;
    
    if (spec.paths) {
      for (const [path, methods] of Object.entries(spec.paths)) {
        const pathId = path.replace(/[\/{}]/g, '_');
        mermaidContent += `  ${pathId}[${path}]\n`;
        
        if (methods && typeof methods === 'object') {
          const methodKeys = Object.keys(methods);
          for (const method of methodKeys) {
            const methodInfo = methods[method];
            if (methodInfo && typeof methodInfo === 'object') {
              const opId = methodInfo.operationId || `${method}_${pathId}`;
              mermaidContent += `  ${opId}{${method.toUpperCase()}}\n`;
              mermaidContent += `  ${pathId} --> ${opId}\n`;
            }
          }
        }
      }
    }
  } catch {
    mermaidContent += '  Error[解析失败]\n';
  }
  
  return mermaidContent;
}