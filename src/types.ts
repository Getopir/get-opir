export type TaskStatus = "planned" | "active" | "blocked" | "done";
export type TaskPriority = "low" | "normal" | "high";

export interface OpirTask {
  id: string;
  title: string;
  output: string;
  process: string;
  input: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner: string;
  startDate: string;
  dueDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  outcome: string;
  createdAt: string;
  updatedAt: string;
  tasks: OpirTask[];
}

export interface WorkspaceData {
  version: 1;
  projects: Project[];
  activeProjectId: string;
}

