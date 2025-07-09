export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: "Todo" | "In Progress" | "Done";
  priority: "Low" | "Medium" | "High";
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskProps {
  title: Task["status"];
  tasks: Task[];
  onNewTask?: (task: Task) => void;
}
