import { useEffect, useState, useRef } from 'react';
import { useActiveDiagram } from '@/store/useStore';
import { render } from '@/engine/renderer';

export function Canvas() {
  const diagram = useActiveDiagram();
  const [svgContent, setSvgContent] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!diagram) {
      setSvgContent('');
      setErrors([]);
      return;
    }

    const doRender = async () => {
      const result = await render(diagram.dslContent, diagram.type);
      if (result.success && result.svg) {
        setSvgContent(result.svg);
        setErrors([]);
      } else {
        setSvgContent('');
        setErrors(result.errors || ['渲染失败']);
      }
    };

    const timer = setTimeout(doRender, 500);
    return () => clearTimeout(timer);
  }, [diagram]);

  if (!diagram) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-800 text-gray-500">
        请选择一个图表进行编辑
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-800 overflow-auto">
      {errors.length > 0 ? (
        <div className="h-full flex items-center justify-center p-8">
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 max-w-2xl">
            <h3 className="text-red-400 font-semibold mb-3">渲染错误</h3>
            <ul className="text-red-300 text-sm space-y-1">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="min-h-full p-8 flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      )}
    </div>
  );
}