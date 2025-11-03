"use client";

import { useDraggable } from "@dnd-kit/core";
import { componentLibrary } from "@/lib/component-library";

interface DraggableComponentItemProps {
  component: (typeof componentLibrary)[0];
}

function DraggableComponentItem({ component }: DraggableComponentItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `palette-${component.type}`,
      data: {
        type: "palette-item",
        componentType: component.type,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        border rounded-lg cursor-grab active:cursor-grabbing
        bg-white hover:bg-gray-50 transition-colors overflow-hidden
        ${isDragging ? "opacity-50" : ""}
      `}
    >
      <div className="p-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-xl">{component.icon}</span>
          <span className="font-medium text-sm">{component.label}</span>
        </div>
      </div>
      <div
        className="p-3 bg-white overflow-hidden"
        style={{
          minHeight: "150px",
          maxHeight: "100%",
          width: "100%",
        }}
      >
        <div
          style={{
            transform: "scale(1)",
            transformOrigin: "top left",
            width: "100%",
          }}
        >
          {component.render(component.defaultProps)}
        </div>
      </div>
    </div>
  );
}

export function ComponentPalette() {
  return (
    <div className="h-full bg-gray-50 border-r p-4 overflow-y-auto overflow-x-hidden">
      <h2 className="text-lg font-semibold mb-4">Components</h2>
      <div className="space-y-3">
        {componentLibrary.map((component) => (
          <DraggableComponentItem key={component.type} component={component} />
        ))}
      </div>
    </div>
  );
}
