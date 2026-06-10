import type { WorkspaceData } from "./types";

const now = new Date().toISOString();

export const sampleData: WorkspaceData = {
  version: 1,
  activeProjectId: "project-personal-launch",
  projects: [
    {
      id: "project-personal-launch",
      name: "Personal OPIR Workspace",
      outcome: "Plan a focused personal project with visible tasks and dates.",
      createdAt: now,
      updatedAt: now,
      tasks: [
        {
          id: "task-define-output",
          title: "Define the output",
          output: "A written description of the result that should exist.",
          process: "Clarify the goal, acceptance criteria, and owner.",
          input: "Existing notes, constraints, available time.",
          status: "active",
          priority: "high",
          owner: "Me",
          startDate: todayOffset(0),
          dueDate: todayOffset(2),
          notes: "Keep the output concrete enough to verify.",
          createdAt: now,
          updatedAt: now,
        },
        {
          id: "task-build-timeline",
          title: "Build the first timeline",
          output: "A realistic sequence of work.",
          process: "Break the work into visible steps and order them by dependency.",
          input: "Calendar availability and known deadlines.",
          status: "planned",
          priority: "normal",
          owner: "Me",
          startDate: todayOffset(3),
          dueDate: todayOffset(8),
          notes: "",
          createdAt: now,
          updatedAt: now,
        },
      ],
    },
  ],
};

function todayOffset(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

