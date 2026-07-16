import Editor from '@monaco-editor/react';
import { useActiveDiagram } from '@/store/useStore';

interface DslEditorProps {
  onChange: (value: string) => void;
}

export function DslEditor({ onChange }: DslEditorProps) {
  const diagram = useActiveDiagram();

  if (!diagram) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        请选择一个图表
      </div>
    );
  }

  const getLanguage = () => {
    switch (diagram.type) {
      case 'dbml':
        return 'dbml';
      case 'openapi':
        return 'json';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="h-full bg-gray-900">
      <Editor
        height="100%"
        language={getLanguage()}
        theme="vs-dark"
        value={diagram.dslContent}
        onChange={(value) => value && onChange(value)}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Fira Code', 'Monaco', 'Consolas', monospace",
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </div>
  );
}