"use server";

import connectDB from "@/lib/db";
import Template from "@/models/Template";
import { getCurrentUser } from "@/lib/actions/auth";

export interface TemplateDTO {
  _id: string;
  name: string;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export async function createTemplateAction(
  name: string,
  data: Record<string, any>
): Promise<{ success: boolean; error?: string; template?: TemplateDTO }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "unauthorized" };

    await connectDB();
    const created = await Template.create({ userId: user._id, name, data });
    return {
      success: true,
      template: {
        _id: created._id.toString(),
        name: created.name,
        data: created.data as Record<string, any>,
        createdAt: created.createdAt.toISOString(),
        updatedAt: created.updatedAt.toISOString(),
      },
    };
  } catch (e: any) {
    // Handle unique constraint error on (userId, name)
    if (e?.code === 11000) {
      return { success: false, error: "name_exists" };
    }
    return { success: false, error: e?.message ?? "server_error" };
  }
}

export async function updateTemplateAction(
  templateId: string,
  data: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "unauthorized" };

    await connectDB();
    const res = await Template.findOneAndUpdate(
      { _id: templateId, userId: user._id },
      { $set: { data } },
      { new: true }
    );
    if (!res) return { success: false, error: "not_found" };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "server_error" };
  }
}

export async function listTemplatesAction(): Promise<{
  success: boolean;
  error?: string;
  templates?: Array<{ _id: string; name: string }>;
}> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "unauthorized" };

    await connectDB();
    const docs = await Template.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .select("name");
    return {
      success: true,
      templates: docs.map((d) => ({ _id: d._id.toString(), name: d.name })),
    };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "server_error" };
  }
}

export async function getTemplateAction(
  templateId: string
): Promise<{ success: boolean; error?: string; template?: TemplateDTO }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "unauthorized" };

    await connectDB();
    const t = await Template.findOne({ _id: templateId, userId: user._id });
    if (!t) return { success: false, error: "not_found" };
    return {
      success: true,
      template: {
        _id: t._id.toString(),
        name: t.name,
        data: t.data as Record<string, any>,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      },
    };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "server_error" };
  }
}

export async function deleteTemplateAction(templateId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await getCurrentUser();
    if (!user) return { success: false, error: "unauthorized" };

    await connectDB();
    const res = await Template.findOneAndDelete({ _id: templateId, userId: user._id });
    if (!res) return { success: false, error: "not_found" };
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e?.message ?? "server_error" };
  }
}
