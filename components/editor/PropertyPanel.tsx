"use client";

import { useBuilderStore } from "@/lib/store";
import { getComponentDefinition } from "@/lib/component-library";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";

export function PropertyPanel() {
  const {
    theme,
    setTheme,
    components,
    updateComponent,
    deleteComponent,
    selectedComponentId,
  } = useBuilderStore();

  const selectedComponent = components.find(
    (c) => c.id === selectedComponentId
  );

  const ThemeControls = (
    <div className="mt-6 p-3 bg-white border rounded-lg space-y-3">
      <h3 className="text-sm font-semibold">Global Colors</h3>
      {(
        [
          { key: "primary", label: "Primary" },
          { key: "secondary", label: "Secondary" },
          { key: "tertiary", label: "Tertiary" },
          { key: "textPrimary", label: "Text Primary" },
          { key: "textSecondary", label: "Text Secondary" },
        ] as const
      ).map((c) => (
        <div key={c.key}>
          <label className="text-xs font-medium text-gray-600 mb-1 block">
            {c.label}
          </label>
          <div className="flex gap-2">
            <input
              type="color"
              value={(theme as any)[c.key]}
              onChange={(e) => setTheme({ [c.key]: e.target.value } as any)}
              className="h-10 w-20 border rounded cursor-pointer"
            />
            <input
              type="text"
              value={(theme as any)[c.key]}
              onChange={(e) => setTheme({ [c.key]: e.target.value } as any)}
              className="flex-1 p-2 border rounded bg-white text-sm"
            />
          </div>
        </div>
      ))}
    </div>
  );

  if (!selectedComponent) {
    return (
      <div className="h-full bg-gray-50 border-l p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <p className="text-sm text-gray-500">No component selected.</p>
        {ThemeControls}
      </div>
    );
  }

  const definition = getComponentDefinition(selectedComponent.type);

  if (!definition) {
    return (
      <div className="h-full bg-gray-50 border-l p-4">
        <h2 className="text-lg font-semibold mb-4">Properties</h2>
        <div className="text-center text-gray-400 mt-8">
          <p>Component definition not found</p>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    // Handle boolean values from select
    if (typeof value === "string" && (value === "true" || value === "false")) {
      value = value === "true";
    }
    // Handle number strings for columns
    if (
      typeof value === "string" &&
      !isNaN(Number(value)) &&
      key === "columns"
    ) {
      value = String(Number(value));
    }
    updateComponent(selectedComponent.id, { [key]: value });
  };

  const handleDelete = () => {
    deleteComponent(selectedComponent.id);
  };

  const handleArrayItemChange = (
    arrayKey: string,
    index: number,
    fieldKey: string,
    value: any
  ) => {
    const currentArray = selectedComponent.props[arrayKey] || [];
    const newArray = [...currentArray];
    newArray[index] = { ...newArray[index], [fieldKey]: value };
    updateComponent(selectedComponent.id, { [arrayKey]: newArray });
  };

  const handleAddArrayItem = (arrayKey: string, defaultItem: any) => {
    const currentArray = selectedComponent.props[arrayKey] || [];
    updateComponent(selectedComponent.id, {
      [arrayKey]: [...currentArray, { ...defaultItem }],
    });
  };

  const handleRemoveArrayItem = (arrayKey: string, index: number) => {
    const currentArray = selectedComponent.props[arrayKey] || [];
    const newArray = currentArray.filter((_: any, i: number) => i !== index);
    updateComponent(selectedComponent.id, { [arrayKey]: newArray });
  };

  return (
    <div className="h-full bg-gray-50 border-l p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Properties</h2>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="flex items-center gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Component Type
          </label>
          <div className="p-2 bg-white rounded border text-sm">
            {definition.label}
          </div>
        </div>

        {definition.editorFields.map((field) => (
          <div key={field.key}>
            {field.type === "array" && field.arrayItemFields ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    {field.label} (
                    {selectedComponent.props[field.key]?.length || 0})
                  </label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const defaultItem: any = {};
                      field.arrayItemFields?.forEach((itemField) => {
                        defaultItem[itemField.key] = "";
                      });
                      handleAddArrayItem(field.key, defaultItem);
                    }}
                    className="h-7 px-2"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {(selectedComponent.props[field.key] || []).map(
                    (item: any, index: number) => (
                      <div
                        key={index}
                        className="p-3 bg-white border rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-gray-600">
                            Item {index + 1}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              handleRemoveArrayItem(field.key, index)
                            }
                            className="h-6 px-2 text-red-600 hover:text-red-700"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                        </div>
                        {field.arrayItemFields?.map((itemField) => (
                          <div key={itemField.key}>
                            <label className="text-xs font-medium text-gray-600 mb-1 block">
                              {itemField.label}
                            </label>
                            {itemField.type === "text" && (
                              <input
                                type="text"
                                value={item[itemField.key] || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    field.key,
                                    index,
                                    itemField.key,
                                    e.target.value
                                  )
                                }
                                className="w-full p-2 border rounded bg-white text-sm"
                              />
                            )}
                            {itemField.type === "textarea" && (
                              <textarea
                                value={item[itemField.key] || ""}
                                onChange={(e) =>
                                  handleArrayItemChange(
                                    field.key,
                                    index,
                                    itemField.key,
                                    e.target.value
                                  )
                                }
                                rows={2}
                                className="w-full p-2 border rounded bg-white text-sm"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )
                  )}
                  {(!selectedComponent.props[field.key] ||
                    selectedComponent.props[field.key].length === 0) && (
                    <p className="text-xs text-gray-400 text-center py-2">
                      No items. Click + to add.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  {field.label}
                </label>
                {field.type === "text" && (
                  <input
                    type="text"
                    value={selectedComponent.props[field.key] || ""}
                    onChange={(e) =>
                      handlePropertyChange(field.key, e.target.value)
                    }
                    className="w-full p-2 border rounded bg-white text-sm"
                  />
                )}
                {field.type === "textarea" && (
                  <textarea
                    value={selectedComponent.props[field.key] || ""}
                    onChange={(e) =>
                      handlePropertyChange(field.key, e.target.value)
                    }
                    rows={3}
                    className="w-full p-2 border rounded bg-white text-sm"
                  />
                )}
                {field.type === "number" && (
                  <input
                    type="number"
                    value={selectedComponent.props[field.key] || ""}
                    onChange={(e) =>
                      handlePropertyChange(field.key, Number(e.target.value))
                    }
                    className="w-full p-2 border rounded bg-white text-sm"
                  />
                )}
                {field.type === "color" && (
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedComponent.props[field.key] || "#000000"}
                      onChange={(e) =>
                        handlePropertyChange(field.key, e.target.value)
                      }
                      className="h-10 w-20 border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedComponent.props[field.key] || "#000000"}
                      onChange={(e) =>
                        handlePropertyChange(field.key, e.target.value)
                      }
                      className="flex-1 p-2 border rounded bg-white text-sm"
                      placeholder="#000000"
                    />
                  </div>
                )}
                {field.type === "select" && field.options && (
                  <select
                    value={String(selectedComponent.props[field.key] ?? "")}
                    onChange={(e) =>
                      handlePropertyChange(field.key, e.target.value)
                    }
                    className="w-full p-2 border rounded bg-white text-sm"
                  >
                    {field.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </>
            )}
          </div>
        ))}
        {ThemeControls}
      </div>
    </div>
  );
}
