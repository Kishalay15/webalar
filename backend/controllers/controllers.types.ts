export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: "Low" | "Medium" | "High";
  status?: "Todo" | "In Progress" | "Done";
  assignedTo: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: "Low" | "Medium" | "High";
  status?: "Todo" | "In Progress" | "Done";
  assignedTo?: string;
  clientUpdatedAt: string;
}
