import { createContext, useContext, useReducer, useEffect, ReactNode } from "react";

export interface Task {
  id: number;
  title: string;
  project: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  time?: string;
}

type Action =
  | { type: "ADD_TASK"; payload: Omit<Task, "id" | "completed"> }
  | { type: "TOGGLE_TASK"; id: number }
  | { type: "REMOVE_TASK"; id: number };

const initialTasks: Task[] = [
  { id: 1, title: "Review project proposal", project: "Work", dueDate: "Today", priority: "high", completed: false },
  { id: 2, title: "Team standup meeting", project: "Work", dueDate: "Today", priority: "medium", completed: true, time: "09:00 AM" },
  { id: 3, title: "Grocery shopping", project: "Personal", dueDate: "Tomorrow", priority: "low", completed: false },
  { id: 4, title: "Finish quarterly report", project: "Work", dueDate: "Today", priority: "high", completed: false },
  { id: 5, title: "Client presentation", project: "Work", dueDate: "Today", priority: "high", completed: false, time: "02:00 PM" },
  { id: 6, title: "Update documentation", project: "Work", dueDate: "Today", priority: "medium", completed: false, time: "04:00 PM" },
  { id: 7, title: "Gym workout", project: "Personal", dueDate: "Today", priority: "low", completed: false, time: "06:00 PM" },
  { id: 8, title: "Call dentist", project: "Personal", dueDate: "Apr 16", priority: "medium", completed: false },
  { id: 9, title: "Update portfolio", project: "Personal", dueDate: "Apr 20", priority: "low", completed: false },
  { id: 10, title: "Review design mockups", project: "Work", dueDate: "Apr 14", priority: "high", completed: true },
  { id: 11, title: "Plan weekend trip", project: "Personal", dueDate: "Apr 18", priority: "low", completed: false },
];

function loadFromStorage(): Task[] {
  try {
    const stored = localStorage.getItem("taskflow_tasks");
    if (stored) return JSON.parse(stored) as Task[];
  } catch {
    // corrupt storage — fall back to defaults
  }
  return initialTasks;
}

function taskReducer(state: Task[], action: Action): Task[] {
  switch (action.type) {
    case "ADD_TASK":
      return [
        ...state,
        {
          ...action.payload,
          id: Math.max(0, ...state.map((t) => t.id)) + 1,
          completed: false,
        },
      ];
    case "TOGGLE_TASK":
      return state.map((t) =>
        t.id === action.id ? { ...t, completed: !t.completed } : t
      );
    case "REMOVE_TASK":
      return state.filter((t) => t.id !== action.id);
    default:
      return state;
  }
}

interface TaskContextValue {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "completed">) => void;
  toggleTask: (id: number) => void;
  removeTask: (id: number) => void;
}

const TaskContext = createContext<TaskContextValue | null>(null);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, dispatch] = useReducer(taskReducer, undefined, loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
    } catch {
      // storage quota exceeded — silently ignore
    }
  }, [tasks]);

  const addTask = (task: Omit<Task, "id" | "completed">) => {
    dispatch({ type: "ADD_TASK", payload: task });
  };

  const toggleTask = (id: number) => {
    dispatch({ type: "TOGGLE_TASK", id });
  };

  const removeTask = (id: number) => {
    dispatch({ type: "REMOVE_TASK", id });
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, removeTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTaskContext must be used inside TaskProvider");
  return ctx;
}
