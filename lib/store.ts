import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Component {
  id: string;
  type: string;
  props?: string;
  order: number;
}

interface BuilderState {
  components: Component[];
  selectedComponentId: string | null;
  setComponents: (components: Component[]) => void;
  addComponent: (component: Component) => void;
  updateComponent: (id: string, props: Partial<Component['props']>) => void;
  deleteComponent: (id: string) => void;
  reorderComponents: (activeId: string, overId: string) => void;
  setSelectedComponentId: (id: string | null) => void;
  clearComponents: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      components: [],
      selectedComponentId: null,
      setComponents: (components) => set({ components }),
      addComponent: (component) =>
        set((state) => ({
          components: [...state.components, component],
        })),
      updateComponent: (id, props) =>
        set((state) => ({
          components: state.components.map((comp) =>
            comp.id === id ? { ...comp, props: { ...comp.props, ...props } } : comp
          ),
        })),
      deleteComponent: (id) =>
        set((state) => ({
          components: state.components.filter((comp) => comp.id !== id),
          selectedComponentId:
            state.selectedComponentId === id ? null : state.selectedComponentId,
        })),
      reorderComponents: (activeId, overId) =>
        set((state) => {
          const activeIndex = state.components.findIndex((c) => c.id === activeId);
          const overIndex = state.components.findIndex((c) => c.id === overId);

          if (activeIndex === -1 || overIndex === -1) return state;

          const newComponents = [...state.components];
          const [removed] = newComponents.splice(activeIndex, 1);
          newComponents.splice(overIndex, 0, removed);

          // Update order
          newComponents.forEach((comp, index) => {
            comp.order = index;
          });

          return { components: newComponents };
        }),
      setSelectedComponentId: (id) => set({ selectedComponentId: id }),
      clearComponents: () => set({ components: [], selectedComponentId: null }),
    }),
    {
      name: 'builder-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

