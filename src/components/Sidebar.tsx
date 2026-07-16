import { useState } from 'react';
import { useStore } from '@/store/useStore';
import type { DiagramType, PerspectiveType } from '@/types';
import { perspectiveLabels } from '@/engine/perspective/perspectiveEngine';

const diagramTypeLabels: Record<DiagramType, string> = {
  c4: 'C4图',
  sequence: '时序图',
  state: '状态机图',
  class: '类图',
  flowchart: '流程图',
  dbml: '数据库模型',
  openapi: 'OpenAPI'
};

export function Sidebar() {
  const { project, setActiveDiagram, addDiagram, deleteDiagram, activePerspective } = useStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDiagram, setNewDiagram] = useState({
    name: '',
    type: 'c4' as DiagramType,
    perspective: 'business' as PerspectiveType
  });

  const filteredDiagrams = project.diagrams.filter((d) => d.perspective === activePerspective);

  const handleAddDiagram = () => {
    if (newDiagram.name) {
      addDiagram({
        name: newDiagram.name,
        type: newDiagram.type,
        perspective: newDiagram.perspective,
        elements: [],
        relationships: [],
        dslContent: getDefaultContent(newDiagram.type)
      });
      setShowAddModal(false);
      setNewDiagram({ name: '', type: 'c4', perspective: 'business' });
    }
  };

  const getDefaultContent = (type: DiagramType): string => {
    switch (type) {
      case 'c4':
        return `@startuml
title C4 系统上下文图

actor 用户 as User
rectangle 系统 as System
database 数据库 as DB

User --> System : 使用
System --> DB : 存储数据
@enduml`;
      case 'sequence':
        return `participant 用户
participant 服务

用户 -> 服务: 请求
服务 --> 用户: 响应`;
      case 'state':
        return `[*] --> 初始化
初始化 --> 运行中
运行中 --> 暂停
暂停 --> 运行中
运行中 --> [*]`;
      case 'flowchart':
        return `A --> B
B --> C
C --> D`;
      case 'dbml':
        return `Table users {
  id int
  name varchar
  email varchar
}`;
      case 'openapi':
        return `{
  "openapi": "3.0.0",
  "info": {
    "title": "API",
    "version": "1.0.0"
  },
  "paths": {}
}`;
      default:
        return '';
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="font-semibold text-lg">图表列表</h2>
        <div className="text-sm text-gray-400 mt-1">
          {perspectiveLabels[activePerspective]}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredDiagrams.length === 0 ? (
          <div className="text-gray-500 text-center py-8 text-sm">
            暂无图表
          </div>
        ) : (
          <div className="space-y-1">
            {filteredDiagrams.map((diagram) => (
              <div
                key={diagram.id}
                className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                  project.activeDiagramId === diagram.id
                    ? 'bg-blue-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setActiveDiagram(diagram.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm truncate">{diagram.name}</div>
                  <div className="text-xs text-gray-400">
                    {diagramTypeLabels[diagram.type]}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDiagram(diagram.id);
                  }}
                  className="p-1 hover:bg-red-600 rounded text-gray-400 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => setShowAddModal(true)}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors"
        >
          + 添加图表
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-80">
            <h3 className="text-lg font-semibold mb-4">新建图表</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">名称</label>
                <input
                  type="text"
                  value={newDiagram.name}
                  onChange={(e) => setNewDiagram({ ...newDiagram, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                  placeholder="图表名称"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">类型</label>
                <select
                  value={newDiagram.type}
                  onChange={(e) => setNewDiagram({ ...newDiagram, type: e.target.value as DiagramType })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                >
                  {Object.entries(diagramTypeLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-gray-400 mb-1">视角</label>
                <select
                  value={newDiagram.perspective}
                  onChange={(e) => setNewDiagram({ ...newDiagram, perspective: e.target.value as PerspectiveType })}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white text-sm"
                >
                  {Object.entries(perspectiveLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                取消
              </button>
              <button
                onClick={handleAddDiagram}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}