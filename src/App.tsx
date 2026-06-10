import { For, Show, createEffect, createMemo, createSignal } from "solid-js";
import { exportWorkspace, importWorkspace, loadWorkspace, saveWorkspace } from "./storage";
import type { OpirTask, Project, TaskPriority, TaskStatus, WorkspaceData } from "./types";

const statusLabels: Record<TaskStatus, string> = {
  planned: "Planned",
  active: "Active",
  blocked: "Blocked",
  done: "Done",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
};

export default function App() {
  const [workspace, setWorkspace] = createSignal<WorkspaceData>(loadWorkspace());
  const [selectedTaskId, setSelectedTaskId] = createSignal<string>("");
  const [importError, setImportError] = createSignal("");

  createEffect(() => saveWorkspace(workspace()));

  const activeProject = createMemo(() => {
    const data = workspace();
    return data.projects.find((project) => project.id === data.activeProjectId) ?? data.projects[0];
  });

  const selectedTask = createMemo(() => {
    const project = activeProject();
    if (!project) return undefined;
    return project.tasks.find((task) => task.id === selectedTaskId()) ?? project.tasks[0];
  });

  const sortedTasks = createMemo(() => {
    const tasks = activeProject()?.tasks ?? [];
    return [...tasks].sort((a, b) => dateValue(a.dueDate) - dateValue(b.dueDate));
  });

  const completion = createMemo(() => {
    const tasks = activeProject()?.tasks ?? [];
    if (!tasks.length) return 0;
    return Math.round((tasks.filter((task) => task.status === "done").length / tasks.length) * 100);
  });

  function updateProject(patch: Partial<Project>) {
    const project = activeProject();
    if (!project) return;
    setWorkspace((current) => ({
      ...current,
      projects: current.projects.map((item) =>
        item.id === project.id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item,
      ),
    }));
  }

  function updateTask(taskId: string, patch: Partial<OpirTask>) {
    const project = activeProject();
    if (!project) return;
    setWorkspace((current) => ({
      ...current,
      projects: current.projects.map((item) =>
        item.id === project.id
          ? {
              ...item,
              updatedAt: new Date().toISOString(),
              tasks: item.tasks.map((task) =>
                task.id === taskId ? { ...task, ...patch, updatedAt: new Date().toISOString() } : task,
              ),
            }
          : item,
      ),
    }));
  }

  function addProject() {
    const id = crypto.randomUUID();
    const project: Project = {
      id,
      name: "New project",
      outcome: "Describe the output this project should create.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tasks: [],
    };
    setWorkspace((current) => ({
      ...current,
      activeProjectId: id,
      projects: [...current.projects, project],
    }));
    setSelectedTaskId("");
  }

  function addTask() {
    const project = activeProject();
    if (!project) return;
    const id = crypto.randomUUID();
    const task: OpirTask = {
      id,
      title: "New task",
      output: "Expected result",
      process: "Steps to complete it",
      input: "Required input",
      status: "planned",
      priority: "normal",
      owner: "",
      startDate: today(),
      dueDate: today(),
      notes: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    updateProject({ tasks: [...project.tasks, task] });
    setSelectedTaskId(id);
  }

  function deleteTask(taskId: string) {
    const project = activeProject();
    if (!project) return;
    updateProject({ tasks: project.tasks.filter((task) => task.id !== taskId) });
    setSelectedTaskId("");
  }

  async function onImport(file: File | undefined) {
    if (!file) return;
    setImportError("");
    try {
      setWorkspace(await importWorkspace(file));
      setSelectedTaskId("");
    } catch (error) {
      setImportError(error instanceof Error ? error.message : "Import failed.");
    }
  }

  return (
    <main class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">OP</div>
          <div>
            <h1>Get OPIR</h1>
            <p>Personal desktop edition</p>
          </div>
        </div>

        <div class="sidebar-actions">
          <button type="button" onClick={addProject}>New project</button>
          <button type="button" onClick={() => exportWorkspace(workspace())}>Export</button>
          <label class="import-button">
            Import
            <input
              type="file"
              accept="application/json"
              onChange={(event) => void onImport(event.currentTarget.files?.[0])}
            />
          </label>
        </div>

        <Show when={importError()}>
          <p class="error-text">{importError()}</p>
        </Show>

        <nav class="project-list" aria-label="Projects">
          <For each={workspace().projects}>
            {(project) => (
              <button
                type="button"
                classList={{ active: workspace().activeProjectId === project.id }}
                onClick={() => {
                  setWorkspace((current) => ({ ...current, activeProjectId: project.id }));
                  setSelectedTaskId("");
                }}
              >
                <span>{project.name}</span>
                <small>{project.tasks.length} tasks</small>
              </button>
            )}
          </For>
        </nav>

        <section class="license-note">
          <strong>Personal use is free.</strong>
          <span>Commercial use requires a separate OPIR commercial license.</span>
        </section>
      </aside>

      <Show when={activeProject()} fallback={<EmptyState onCreate={addProject} />}>
        {(project) => (
          <section class="workspace">
            <header class="project-header">
              <div>
                <input
                  class="project-title"
                  value={project().name}
                  onInput={(event) => updateProject({ name: event.currentTarget.value })}
                />
                <textarea
                  class="project-outcome"
                  value={project().outcome}
                  onInput={(event) => updateProject({ outcome: event.currentTarget.value })}
                />
              </div>
              <div class="progress-panel">
                <span>{completion()}%</span>
                <div class="progress-track">
                  <div style={{ width: `${completion()}%` }} />
                </div>
              </div>
            </header>

            <section class="content-grid">
              <div class="task-column">
                <div class="section-heading">
                  <h2>Tasks</h2>
                  <button type="button" onClick={addTask}>Add task</button>
                </div>
                <div class="task-list">
                  <For each={project().tasks} fallback={<p class="muted">No tasks yet.</p>}>
                    {(task) => (
                      <button
                        type="button"
                        class="task-row"
                        classList={{ selected: selectedTask()?.id === task.id }}
                        onClick={() => setSelectedTaskId(task.id)}
                      >
                        <span class={`status-dot ${task.status}`} />
                        <span class="task-main">
                          <strong>{task.title}</strong>
                          <small>{task.owner || "Unassigned"} - {formatDate(task.dueDate)}</small>
                        </span>
                        <span class={`priority ${task.priority}`}>{priorityLabels[task.priority]}</span>
                      </button>
                    )}
                  </For>
                </div>
              </div>

              <Show when={selectedTask()} fallback={<div class="editor empty-editor">Select a task.</div>}>
                {(task) => (
                  <TaskEditor
                    task={task()}
                    onChange={(patch) => updateTask(task().id, patch)}
                    onDelete={() => deleteTask(task().id)}
                  />
                )}
              </Show>

              <div class="timeline-column">
                <div class="section-heading">
                  <h2>Timeline</h2>
                </div>
                <div class="timeline">
                  <For each={sortedTasks()} fallback={<p class="muted">Add tasks to build the timeline.</p>}>
                    {(task) => (
                      <button
                        type="button"
                        class="timeline-item"
                        classList={{ selected: selectedTask()?.id === task.id }}
                        onClick={() => setSelectedTaskId(task.id)}
                      >
                        <span>{formatDate(task.startDate)}</span>
                        <strong>{task.title}</strong>
                        <small>{formatDate(task.dueDate)} - {statusLabels[task.status]}</small>
                      </button>
                    )}
                  </For>
                </div>
              </div>
            </section>
          </section>
        )}
      </Show>
    </main>
  );
}

function TaskEditor(props: {
  task: OpirTask;
  onChange: (patch: Partial<OpirTask>) => void;
  onDelete: () => void;
}) {
  return (
    <form class="editor" onSubmit={(event) => event.preventDefault()}>
      <div class="section-heading">
        <h2>Task Detail</h2>
        <button type="button" class="danger" onClick={props.onDelete}>Delete</button>
      </div>

      <label>
        <span>Title</span>
        <input value={props.task.title} onInput={(event) => props.onChange({ title: event.currentTarget.value })} />
      </label>

      <div class="field-row">
        <label>
          <span>Status</span>
          <select
            value={props.task.status}
            onChange={(event) => props.onChange({ status: event.currentTarget.value as TaskStatus })}
          >
            <For each={Object.entries(statusLabels)}>
              {([value, label]) => <option value={value}>{label}</option>}
            </For>
          </select>
        </label>
        <label>
          <span>Priority</span>
          <select
            value={props.task.priority}
            onChange={(event) => props.onChange({ priority: event.currentTarget.value as TaskPriority })}
          >
            <For each={Object.entries(priorityLabels)}>
              {([value, label]) => <option value={value}>{label}</option>}
            </For>
          </select>
        </label>
      </div>

      <div class="field-row">
        <label>
          <span>Owner</span>
          <input value={props.task.owner} onInput={(event) => props.onChange({ owner: event.currentTarget.value })} />
        </label>
        <label>
          <span>Start</span>
          <input type="date" value={props.task.startDate} onInput={(event) => props.onChange({ startDate: event.currentTarget.value })} />
        </label>
        <label>
          <span>Due</span>
          <input type="date" value={props.task.dueDate} onInput={(event) => props.onChange({ dueDate: event.currentTarget.value })} />
        </label>
      </div>

      <label>
        <span>Output</span>
        <textarea value={props.task.output} onInput={(event) => props.onChange({ output: event.currentTarget.value })} />
      </label>
      <label>
        <span>Process</span>
        <textarea value={props.task.process} onInput={(event) => props.onChange({ process: event.currentTarget.value })} />
      </label>
      <label>
        <span>Input</span>
        <textarea value={props.task.input} onInput={(event) => props.onChange({ input: event.currentTarget.value })} />
      </label>
      <label>
        <span>Notes</span>
        <textarea value={props.task.notes} onInput={(event) => props.onChange({ notes: event.currentTarget.value })} />
      </label>
    </form>
  );
}

function EmptyState(props: { onCreate: () => void }) {
  return (
    <section class="workspace empty-state">
      <h2>No projects yet</h2>
      <button type="button" onClick={props.onCreate}>Create project</button>
    </section>
  );
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateValue(value: string): number {
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? Number.MAX_SAFE_INTEGER : time;
}

function formatDate(value: string): string {
  if (!value) return "No date";
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value));
}
