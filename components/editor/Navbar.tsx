"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Save, FolderOpen, Smartphone, Tablet, Monitor } from "lucide-react";

import { useBuilderStore } from "@/lib/store";
import { logoutAction } from "@/lib/actions/auth";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ViewportSize {
  name: string;
  width: string;
  icon: React.ReactNode;
}

const viewportSizes: ViewportSize[] = [
  { name: "Mobile", width: "375px", icon: <Smartphone className="h-4 w-4" /> },
  { name: "Tablet", width: "768px", icon: <Tablet className="h-4 w-4" /> },
  { name: "Desktop", width: "100%", icon: <Monitor className="h-4 w-4" /> },
];

interface NavbarProps {
  onViewportChange?: (width: string) => void;
  currentViewport?: string;
}

export function Navbar({ onViewportChange, currentViewport }: NavbarProps) {
  const { components, setComponents } = useBuilderStore();
  const [projectNames, setProjectNames] = useState<string[]>([]);

  const router = useRouter();

  // Load project names from localStorage
  useEffect(() => {
    const savedProjects = Object.keys(localStorage)
      .filter((key) => key.startsWith("builder-project-"))
      .map((key) => key.replace("builder-project-", ""));
    setProjectNames(savedProjects);
  }, []);

  const handleSave = () => {
    const projectName = prompt("Enter project name:");
    if (!projectName) return;

    const template = {
      components: components.map((comp) => ({
        id: comp.id,
        type: comp.type,
        props: comp.props,
        order: comp.order,
      })),
      version: "1.0",
      savedAt: new Date().toISOString(),
      projectName,
    };

    const json = JSON.stringify(template, null, 2);

    // Save to localStorage with project name
    localStorage.setItem(`builder-project-${projectName}`, json);

    // Also save latest
    localStorage.setItem("builder-template", json);

    // Update project list
    setProjectNames((prev) => {
      if (!prev.includes(projectName)) {
        return [...prev, projectName];
      }
      return prev;
    });

    // Show success message
    alert(`Project "${projectName}" saved successfully!`);
  };

  const handleLoadProject = (projectName: string) => {
    const savedData = localStorage.getItem(`builder-project-${projectName}`);
    if (!savedData) {
      alert("Project not found!");
      return;
    }

    try {
      const template = JSON.parse(savedData);
      if (template.components) {
        // Sort components by order
        const sortedComponents = [...template.components].sort(
          (a, b) => (a.order || 0) - (b.order || 0)
        );
        setComponents(sortedComponents);
        alert(`Project "${projectName}" loaded successfully!`);
      }
    } catch (error) {
      alert("Error loading project. Invalid JSON format.");
      console.error(error);
    }
  };

  const handleDeleteProject = (projectName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete "${projectName}"?`)) {
      localStorage.removeItem(`builder-project-${projectName}`);
      setProjectNames((prev) => prev.filter((name) => name !== projectName));
    }
  };

  async function handleLogout() {
    await logoutAction();
    toast.success("Logged out successfully!");

    router.push("/login");
    router.refresh();
  }

  return (
    <nav className="h-16 bg-white border-b flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">BuilderX</h1>

        {/* Project Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-4">
              <FolderOpen className="h-4 w-4 mr-2" />
              Projects
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Saved Projects</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {projectNames.length === 0 ? (
              <DropdownMenuItem disabled>No projects saved</DropdownMenuItem>
            ) : (
              projectNames.map((name) => (
                <DropdownMenuItem
                  key={name}
                  onClick={() => handleLoadProject(name)}
                  className="flex items-center justify-between group"
                >
                  <span className="truncate flex-1">{name}</span>
                  <button
                    onClick={(e) => handleDeleteProject(name, e)}
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 ml-2"
                    title="Delete project"
                  >
                    ×
                  </button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        {/* Responsive View Buttons */}
        <div className="flex items-center gap-1 border rounded-md p-1">
          {viewportSizes.map((size) => (
            <Button
              key={size.name}
              variant={currentViewport === size.width ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewportChange(size.width)}
              className="flex items-center gap-1"
              title={size.name}
            >
              {size.icon}
              <span className="hidden md:inline">{size.name}</span>
            </Button>
          ))}
        </div>

        <Button
          onClick={handleSave}
          variant="default"
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Template
        </Button>

        <Button
          onClick={handleLogout}
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          Logout
        </Button>
      </div>
    </nav>
  );
}
