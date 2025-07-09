import type { Task } from "../../types/models.types";

export interface KCProps {
  title: "Todo" | "In Progress" | "Done";
  tasks: Task[];
  onNewTask?: (task: Task) => void;
}

export interface CTMProps {
  onClose: () => void;
  onCreate: (newTask: Task) => void;
  defaultStatus: Task["status"];
}

export interface TCProps {
  task: Task;
}

export interface Log {
  timestamp: string;
  user: string;
  action: string;
}
