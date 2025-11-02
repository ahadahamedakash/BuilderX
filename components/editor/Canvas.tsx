'use client';

import {
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '@/lib/store';
import { getComponentDefinition } from '@/lib/component-library';
import { cn } from '@/lib/utils';
import React from 'react';

interface SortableComponentProps {
  id: string;
  component: {
    id: string;
    type: string;
    props: Record<string, any>;
  };
}

function SortableComponent({ id, component }: SortableComponentProps) {
  const { selectedComponentId, setSelectedComponentId } = useBuilderStore();
  const definition = getComponentDefinition(component.type);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (!definition) return null;

  // Separate drag handle from click handler
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponentId(id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative rounded-lg group',
        isDragging && 'opacity-50',
        selectedComponentId === id && 'ring-2 ring-blue-500 ring-offset-2'
      )}
      onClick={handleClick}
    >
      {/* Drag handle - only for dragging */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 z-10 w-6 h-6 bg-blue-500 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      
      <div className="bg-white rounded border-2 border-dashed border-transparent group-hover:border-gray-300">
        {definition.render(component.props)}
      </div>
      {selectedComponentId === id && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl">
          Selected
        </div>
      )}
    </div>
  );
}

interface CanvasProps {
  className?: string;
  activeId?: string | null;
  activeComponent?: any;
  viewportWidth?: string;
}

function DroppableCanvas({ children }: { children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-drop-zone',
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'h-full bg-gray-100 overflow-y-auto',
        isOver && 'bg-blue-50'
      )}
    >
      {children}
    </div>
  );
}

export function Canvas({ className, activeId, activeComponent, viewportWidth = '100%' }: CanvasProps) {
  const {
    components,
    setSelectedComponentId,
  } = useBuilderStore();

  return (
    <DroppableCanvas>
      <div 
        className={cn('min-h-full mx-auto', className)} 
        onClick={() => setSelectedComponentId(null)}
        style={{
          width: viewportWidth,
          maxWidth: viewportWidth,
        }}
      >
        <SortableContext
          items={components.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {components.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p className="text-lg mb-2">Empty Canvas</p>
                <p className="text-sm">
                  Drag components from the left sidebar to get started
                </p>
              </div>
            ) : (
              components.map((component) => (
                <SortableComponent
                  key={component.id}
                  id={component.id}
                  component={component}
                />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </DroppableCanvas>
  );
}
