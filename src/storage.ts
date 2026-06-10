import { sampleData } from "./sampleData";
import type { WorkspaceData } from "./types";

const storageKey = "get-opir.workspace.v1";

export function loadWorkspace(): WorkspaceData {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return sampleData;

  try {
    const parsed = JSON.parse(raw) as WorkspaceData;
    if (parsed.version === 1 && Array.isArray(parsed.projects)) {
      return parsed;
    }
  } catch {
    return sampleData;
  }

  return sampleData;
}

export function saveWorkspace(data: WorkspaceData): void {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

export function exportWorkspace(data: WorkspaceData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `get-opir-${new Date().toISOString().slice(0, 10)}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function importWorkspace(file: File): Promise<WorkspaceData> {
  const text = await file.text();
  const parsed = JSON.parse(text) as WorkspaceData;
  if (parsed.version !== 1 || !Array.isArray(parsed.projects)) {
    throw new Error("The selected file is not a Get OPIR workspace export.");
  }
  return parsed;
}

