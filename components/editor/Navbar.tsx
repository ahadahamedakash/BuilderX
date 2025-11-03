"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Save, FolderOpen, Trash, PlusCircle } from "lucide-react";

import { useBuilderStore } from "@/lib/store";
import { logoutAction } from "@/lib/actions/auth";
import {
  getTemplateAction,
  listTemplatesAction,
  createTemplateAction,
  updateTemplateAction,
} from "@/lib/actions/templates";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type NavbarProps = object;

export function Navbar({}: NavbarProps) {
  const {
    components,
    setComponents,
    currentTemplateId,
    currentTemplateName,
    setCurrentTemplate,
  } = useBuilderStore();

  const [templates, setTemplates] = useState<
    Array<{ _id: string; name: string }>
  >([]);

  const router = useRouter();

  // Load templates for current user
  useEffect(() => {
    (async () => {
      const res = await listTemplatesAction();
      if (res.success && res.templates) setTemplates(res.templates);
    })();
  }, []);

  const handleSave = async () => {
    const payload = {
      components: components.map((comp) => ({
        id: comp.id,
        type: comp.type,
        props: comp.props,
        order: comp.order,
      })),
      version: "1.0",
      savedAt: new Date().toISOString(),
    };

    if (!currentTemplateId) {
      const name = prompt("Enter project name:");
      if (!name) return;
      const res = await createTemplateAction(name, payload as any);
      if (!res.success) {
        toast.error(
          res.error === "name_exists"
            ? "A template with this name already exists."
            : "Failed to save template."
        );
        return;
      }
      setCurrentTemplate(res.template!._id, res.template!.name);
      router.push(`/?template=${res.template!._id}`);
      toast.success("Template saved.");
      const list = await listTemplatesAction();
      if (list.success && list.templates) setTemplates(list.templates);
    } else {
      const res = await updateTemplateAction(currentTemplateId, payload as any);
      if (!res.success) {
        toast.error("Failed to update template.");
        return;
      }
      toast.success("Template updated.");
      const list = await listTemplatesAction();
      if (list.success && list.templates) setTemplates(list.templates);
    }
  };

  const handleLoadProject = async (templateId: string) => {
    const res = await getTemplateAction(templateId);
    if (!res.success || !res.template) {
      toast.error("Failed to load project.");
      return;
    }
    const t = res.template;
    const list = Array.isArray((t.data as any)?.components)
      ? (t.data as any).components
      : [];
    const sortedComponents = [...list].sort(
      (a: any, b: any) => (a.order || 0) - (b.order || 0)
    );
    setComponents(sortedComponents);
    setCurrentTemplate(t._id, t.name);
    router.push(`/?template=${t._id}`);
    toast.success(`Loaded \"${t.name}\"`);
  };

  // Deleting templates is not required per spec; keeping placeholder removed.

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
            {templates.length === 0 ? (
              <DropdownMenuItem disabled>No projects saved</DropdownMenuItem>
            ) : (
              templates.map((t) => (
                <DropdownMenuItem
                  key={t._id}
                  onClick={() => handleLoadProject(t._id)}
                  className="flex items-center justify-between group"
                >
                  <span className="truncate flex-1">{t.name}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-2">
        {currentTemplateId && (
          <div className="flex items-center gap-2 mr-2">
            <span
              className="text-sm text-gray-600 truncate max-w-[200px]"
              title={currentTemplateName || ""}
            >
              {currentTemplateName}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={async () => {
                const ok = confirm("Delete this project?");
                if (!ok || !currentTemplateId) return;
                const { deleteTemplateAction } = await import(
                  "@/lib/actions/templates"
                );
                const res = await deleteTemplateAction(currentTemplateId);
                if (!res.success) return toast.error("Failed to delete.");
                setComponents([]);
                setCurrentTemplate(null, null);
                const list = await listTemplatesAction();
                if (list.success && list.templates)
                  setTemplates(list.templates);
                router.push("/");
                toast.success("Deleted.");
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button
          onClick={handleSave}
          variant="default"
          size="sm"
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {currentTemplateId ? "Update Template" : "Save Template"}
        </Button>

        {currentTemplateId && (
          <Button
            onClick={async () => {
              setComponents([]);
              setCurrentTemplate(null, null);
              router.push("/");
            }}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            title="Start a new project"
          >
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
        )}

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
