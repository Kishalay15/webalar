import { useEffect, useState } from "react";
import instance from "../api/axios";
import { type Task } from "../types/models.types";
import KanbanColumn from "../components/Board/KanbanColumn";
import { socket } from "../config/socket.ts";
import {
  DndContext,
  closestCorners,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import ActivityLogPanel from "../components/Board/ActivityLogPanel.tsx";

const Board = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/tasks");
      setTasks(res.data);
    } catch (err: any) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();

    socket.on("task-created", (newTask: Task) => {
      setTasks((prev) => [...prev, newTask]);
    });

    socket.on("task-updated", (updated: Task) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updated._id ? updated : t))
      );
    });

    socket.on("task-deleted", (deleted: Task) => {
      setTasks((prev) => prev.filter((t) => t._id !== deleted._id));
    });

    return () => {
      socket.off("task-created");
      socket.off("task-updated");
      socket.off("task-deleted");
    };
  }, []);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id.toString();
    const newStatus = over.id.toString();

    const draggedTask = tasks.find((t) => t._id === taskId);
    if (!draggedTask || draggedTask.status === newStatus) return;

    try {
      await instance.put(`/tasks/${taskId}`, {
        status: newStatus,
        clientUpdatedAt: draggedTask.updatedAt,
      });
    } catch (err) {
      console.error("Failed to update task status", err);
    }
  };

  const statuses: Task["status"][] = ["Todo", "In Progress", "Done"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-md">
            <h3 className="font-medium mb-2">Error</h3>
            <p className="text-sm">{error}</p>
            <button
              onClick={fetchTasks}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-medium text-gray-900 mb-2">
            Project Board
          </h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {statuses.map((status) => (
              <KanbanColumn
                key={status}
                title={status}
                tasks={tasks.filter((t) => t.status === status)}
                onNewTask={(task) => setTasks((prev) => [...prev, task])}
              />
            ))}
          </div>
        </DndContext>
      </div>
      <ActivityLogPanel />
    </div>
  );
};

export default Board;
