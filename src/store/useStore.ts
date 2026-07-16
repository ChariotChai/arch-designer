import { create } from 'zustand';
import type { Project, Diagram, PerspectiveType } from '@/types';

interface Store {
  project: Project;
  activePerspective: PerspectiveType;
  setProject: (project: Project) => void;
  updateDiagramContent: (diagramId: string, content: string) => void;
  setActiveDiagram: (diagramId: string) => void;
  setActivePerspective: (perspective: PerspectiveType) => void;
  addDiagram: (diagram: Omit<Diagram, 'id'>) => void;
  updateDiagram: (diagramId: string, updates: Partial<Diagram>) => void;
  deleteDiagram: (diagramId: string) => void;
  exportProject: () => string;
  importProject: (json: string) => void;
}

const initialProject: Project = {
  id: 'project-1',
  name: '系统架构设计',
  diagrams: [
    {
      id: 'diagram-1',
      name: 'C4 系统上下文图',
      type: 'c4',
      perspective: 'business',
      elements: [],
      relationships: [],
      dslContent: `@startuml
!theme plain

title 系统上下文图

actor 用户 as User
rectangle 系统 as System {
  rectangle "业务服务" as Service
}
database 数据库 as DB

User --> System : 使用
System --> DB : 存储数据
@enduml`
    }
  ],
  activeDiagramId: 'diagram-1',
  activePerspective: 'business'
};

export const useStore = create<Store>((set, get) => ({
  project: initialProject,
  activePerspective: 'business',
  setProject: (project) => set({ project }),
  updateDiagramContent: (diagramId, content) => {
    set((state) => ({
      project: {
        ...state.project,
        diagrams: state.project.diagrams.map((d) =>
          d.id === diagramId ? { ...d, dslContent: content } : d
        )
      }
    }));
  },
  setActiveDiagram: (diagramId) => {
    set((state) => ({
      project: { ...state.project, activeDiagramId: diagramId }
    }));
  },
  setActivePerspective: (perspective) => {
    set((state) => ({
      project: { ...state.project, activePerspective: perspective }
    }));
  },
  addDiagram: (diagram) => {
    const id = `diagram-${Date.now()}`;
    set((state) => ({
      project: {
        ...state.project,
        diagrams: [...state.project.diagrams, { ...diagram, id }]
      }
    }));
  },
  updateDiagram: (diagramId, updates) => {
    set((state) => ({
      project: {
        ...state.project,
        diagrams: state.project.diagrams.map((d) =>
          d.id === diagramId ? { ...d, ...updates } : d
        )
      }
    }));
  },
  deleteDiagram: (diagramId) => {
    set((state) => ({
      project: {
        ...state.project,
        diagrams: state.project.diagrams.filter((d) => d.id !== diagramId),
        activeDiagramId:
          state.project.activeDiagramId === diagramId
            ? state.project.diagrams[0]?.id
            : state.project.activeDiagramId
      }
    }));
  },
  exportProject: () => {
    return JSON.stringify(get().project, null, 2);
  },
  importProject: (json) => {
    const project = JSON.parse(json) as Project;
    set({ project });
  }
}));

export const useActiveDiagram = () => {
  const project = useStore((state) => state.project);
  return project.diagrams.find((d) => d.id === project.activeDiagramId);
};