import { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { DslEditor } from '@/components/DslEditor';
import { Canvas } from '@/components/Canvas';
import { PropertyPanel } from '@/components/PropertyPanel';
import { PerspectiveSelector } from '@/components/PerspectiveSelector';
import { useStore } from '@/store/useStore';

type EditorMode = 'dsl' | 'canvas';

function App() {
  const { updateDiagramContent, project } = useStore();
  const [editorMode, setEditorMode] = useState<EditorMode>('canvas');

  const handleContentChange = (content: string) => {
    updateDiagramContent(project.activeDiagramId, content);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <PerspectiveSelector />
              
              <div className="flex bg-gray-700 rounded-lg">
                <button
                  onClick={() => setEditorMode('canvas')}
                  className={`px-4 py-1.5 rounded text-sm transition-colors ${
                    editorMode === 'canvas'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  画布视图
                </button>
                <button
                  onClick={() => setEditorMode('dsl')}
                  className={`px-4 py-1.5 rounded text-sm transition-colors ${
                    editorMode === 'dsl'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  DSL 编辑
                </button>
              </div>
            </div>
            
            <div className="text-sm text-gray-400">
              {project.diagrams.length} 个图表
            </div>
          </div>
          
          <div className="flex-1 flex overflow-hidden">
            {editorMode === 'canvas' ? (
              <Canvas />
            ) : (
              <DslEditor onChange={handleContentChange} />
            )}
            
            <PropertyPanel />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;