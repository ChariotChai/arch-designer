import { useStore } from '@/store/useStore';
import { perspectiveLabels } from '@/engine/perspective/perspectiveEngine';
import type { PerspectiveType } from '@/types';

export function PerspectiveSelector() {
  const { activePerspective, setActivePerspective } = useStore();

  const perspectives: PerspectiveType[] = ['business', 'product', 'technology'];

  return (
    <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
      <span className="text-gray-400 text-sm mr-2">视角:</span>
      {perspectives.map((perspective) => (
        <button
          key={perspective}
          onClick={() => setActivePerspective(perspective)}
          className={`px-3 py-1 rounded text-sm transition-colors ${
            activePerspective === perspective
              ? 'bg-blue-600 text-white'
              : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
          }`}
        >
          {perspectiveLabels[perspective]}
        </button>
      ))}
    </div>
  );
}