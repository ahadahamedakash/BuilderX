"use client";

import { useState } from "react";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { Menu, Settings } from "lucide-react";
import { Navbar } from "@/components/editor/Navbar";
import { Canvas } from "@/components/editor/Canvas";
import { getComponentDefinition } from "@/lib/component-library";
import { PropertyPanel } from "@/components/editor/PropertyPanel";
import { ComponentPalette } from "@/components/editor/ComponentPalette";

import { useBuilderStore } from "@/lib/store";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  useSensor,
  DndContext,
  useSensors,
  DragOverlay,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  DragStartEvent,
  KeyboardSensor,
} from "@dnd-kit/core";

export default function Home() {
  const [leftSheetOpen, setLeftSheetOpen] = useState(false);
  const [rightSheetOpen, setRightSheetOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [viewportWidth, setViewportWidth] = useState<string>("100%");
  // Always responsive; no manual viewport controls

  const {
    components,
    addComponent,
    reorderComponents,
    setSelectedComponentId,
  } = useBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    // Check if dragging from palette
    if (active.data.current?.type === "palette-item") {
      const componentType = active.data.current.componentType;
      const definition = getComponentDefinition(componentType);

      if (definition) {
        const newComponent = {
          id: `component-${Date.now()}-${Math.random()}`,
          type: componentType,
          props: { ...definition.defaultProps },
          order: components.length,
        };

        // If dropping on an existing component, insert at that position
        if (
          over.id !== "canvas-drop-zone" &&
          components.find((c) => c.id === over.id)
        ) {
          const overIndex = components.findIndex((c) => c.id === over.id);
          const newComponents = [...components];
          newComponents.splice(overIndex, 0, newComponent);
          // Update order
          newComponents.forEach((comp, index) => {
            comp.order = index;
          });
          // Update store with new components array
          useBuilderStore.getState().setComponents(newComponents);
        } else {
          // Dropping on empty canvas, add to end
          addComponent(newComponent);
        }

        setSelectedComponentId(newComponent.id);
      }
    } else if (active.id !== over.id && over.id !== "canvas-drop-zone") {
      // Reordering existing components
      reorderComponents(active.id as string, over.id as string);
    }

    setActiveId(null);
  };

  const activeComponent = activeId
    ? components.find((c) => c.id === activeId)
    : null;

  const activeDefinition = activeComponent
    ? getComponentDefinition(activeComponent.type)
    : null;

  // Handle palette item drag overlay
  const isPaletteItem = activeId?.toString().startsWith("palette-");
  const paletteComponentType = isPaletteItem
    ? activeId?.toString().replace("palette-", "")
    : null;
  const paletteDefinition = paletteComponentType
    ? getComponentDefinition(paletteComponentType)
    : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-screen flex flex-col">
        <Navbar onViewportChange={(w) => setViewportWidth(w)} currentViewport={viewportWidth} />
        <div className="flex-1 flex overflow-hidden">
          {/* Desktop Left Sidebar */}
          <aside className="hidden md:block w-96 shrink-0">
            <ComponentPalette />
          </aside>

          {/* Mobile Left Sheet */}
          <Sheet open={leftSheetOpen} onOpenChange={setLeftSheetOpen}>
            <SheetContent side="left" className="w-64 p-0 z-50">
              <ComponentPalette />
            </SheetContent>
          </Sheet>

          {/* Main Canvas Area */}
          <main className="flex-1 flex flex-col overflow-hidden relative z-0">
            {/* Mobile Control Buttons */}
            <div className="md:hidden flex gap-2 p-2 bg-white border-b z-10">
              <Sheet open={leftSheetOpen} onOpenChange={setLeftSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Menu className="h-4 w-4 mr-2" />
                    Components
                  </Button>
                </SheetTrigger>
              </Sheet>
              <Sheet open={rightSheetOpen} onOpenChange={setRightSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Properties
                  </Button>
                </SheetTrigger>
              </Sheet>
            </div>

            <div className="w-full flex justify-center px-2 md:px-6">
              <div className="w-full" style={{ maxWidth: viewportWidth }}>
                <Canvas className="flex-1" />
              </div>
            </div>
          </main>

          {/* Desktop Right Sidebar */}
          <aside className="hidden md:block w-80 shrink-0">
            <PropertyPanel />
          </aside>

          {/* Mobile Right Sheet */}
          <Sheet open={rightSheetOpen} onOpenChange={setRightSheetOpen}>
            <SheetContent side="right" className="w-80 p-0">
              <PropertyPanel />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <DragOverlay>
        {activeDefinition && activeComponent ? (
          <div className="p-2 bg-white rounded-lg shadow-lg border-2 border-blue-500 opacity-90">
            {activeDefinition.render(activeComponent.props)}
          </div>
        ) : paletteDefinition ? (
          <div className="p-2 bg-white rounded-lg shadow-lg border-2 border-blue-500 opacity-90">
            {paletteDefinition.render(paletteDefinition.defaultProps)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
