import { useActiveDiagram } from '@/store/useStore';
import { parse } from '@/engine/parser';
import { perspectiveLabels } from '@/engine/perspective/perspectiveEngine';

export function PropertyPanel() {
  const diagram = useActiveDiagram();

  if (!diagram) {
    return (
      <div className="w-64 bg-gray-900 text-white p-4">
        <h3 className="font-semibold mb-4">属性面板</h3>
        <p className="text-gray-500 text-sm">请选择一个图表</p>
      </div>
    );
  }

  const parseResult = parse(diagram.dslContent, diagram.type);

  return (
    <div className="w-64 bg-gray-900 text-white p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">属性面板</h3>
      
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-400 mb-2">图表信息</h4>
          <div className="space-y-1 text-sm">
            <div>
              <span className="text-gray-500">名称:</span>
              <span className="ml-2">{diagram.name}</span>
            </div>
            <div>
              <span className="text-gray-500">类型:</span>
              <span className="ml-2">{getTypeName(diagram.type)}</span>
            </div>
            <div>
              <span className="text-gray-500">视角:</span>
              <span className="ml-2">{perspectiveLabels[diagram.perspective]}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-400 mb-2">元素 ({parseResult.elements.length})</h4>
          <div className="space-y-1">
            {parseResult.elements.slice(0, 10).map((el) => (
              <div key={el.id} className="text-sm">
                <span className="text-blue-400">[{el.type}]</span>
                <span className="ml-2 truncate">{el.name}</span>
              </div>
            ))}
            {parseResult.elements.length > 10 && (
              <div className="text-gray-500 text-xs">+{parseResult.elements.length - 10} 更多</div>
            )}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-400 mb-2">关系 ({parseResult.relationships.length})</h4>
          <div className="space-y-1">
            {parseResult.relationships.slice(0, 10).map((rel) => (
              <div key={rel.id} className="text-sm">
                <span className="text-green-400">{rel.sourceId}</span>
                <span className="mx-1">→</span>
                <span className="text-green-400">{rel.targetId}</span>
                {rel.label && (
                  <span className="text-gray-500 ml-2">({rel.label})</span>
                )}
              </div>
            ))}
            {parseResult.relationships.length > 10 && (
              <div className="text-gray-500 text-xs">+{parseResult.relationships.length - 10} 更多</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getTypeName(type: string): string {
  const map: Record<string, string> = {
    c4: 'C4图',
    sequence: '时序图',
    state: '状态机图',
    class: '类图',
    flowchart: '流程图',
    dbml: '数据库模型',
    openapi: 'OpenAPI'
  };
  return map[type] || type;
}