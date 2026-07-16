import { useState } from 'react';
import { useStore } from '@/store/useStore';

export function Header() {
  const { project, exportProject, importProject } = useStore();
  const [showImport, setShowImport] = useState(false);
  const [importContent, setImportContent] = useState('');

  const handleExport = () => {
    const json = exportProject();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}.arch.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (importContent) {
      try {
        importProject(importContent);
        setShowImport(false);
        setImportContent('');
      } catch {
        alert('导入失败，无效的JSON格式');
      }
    }
  };

  return (
    <header className="h-14 bg-gray-800 text-white flex items-center justify-between px-4 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="text-xl font-bold">Arch Designer</div>
        <div className="text-sm text-gray-400">系统架构设计工具</div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="text-sm text-gray-300">
          当前项目: {project.name}
        </div>
        
        <button
          onClick={() => setShowImport(true)}
          className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
        >
          导入
        </button>
        
        <button
          onClick={handleExport}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm transition-colors"
        >
          导出
        </button>
      </div>

      {showImport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-3">导入项目</h3>
            <textarea
              value={importContent}
              onChange={(e) => setImportContent(e.target.value)}
              className="w-full h-48 p-2 bg-gray-900 border border-gray-700 rounded text-white text-sm resize-none"
              placeholder="粘贴项目JSON..."
            />
            <div className="flex justify-end gap-3 mt-3">
              <button
                onClick={() => setShowImport(false)}
                className="px-4 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-sm"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm"
              >
                导入
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}