import instance from "../../api/axios";
import { AlertTriangle, Clock, ArrowDown } from "lucide-react";
import type { TCProps } from "./props.types";
import { useDraggable } from "@dnd-kit/core";

const getPriorityColor = (priority: "Low" | "Medium" | "High") => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-700";
    case "Medium":
      return "bg-yellow-100 text-yellow-700";
    case "Low":
      return "bg-green-100 text-green-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getPriorityIcon = (priority: "Low" | "Medium" | "High") => {
  switch (priority) {
    case "High":
      return <AlertTriangle className="w-3 h-3 text-red-500" />;
    case "Medium":
      return <Clock className="w-3 h-3 text-yellow-500" />;
    case "Low":
      return <ArrowDown className="w-3 h-3 text-green-500" />;
    default:
      return null;
  }
};

const TaskCard = ({ task }: TCProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task._id,
  });

  const handleSmartAssign = async () => {
    try {
      await instance.post(`/tasks/${task._id}/smart-assign`);
    } catch (error: any) {
      alert(
        "Smart Assign failed: " + (error?.response?.data?.message || "Error")
      );
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-white rounded-md border border-gray-200 p-3 hover:border-gray-300 transition-colors duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 mr-2">
          {task.title}
        </h3>
        <div className="flex items-center gap-1">
          {getPriorityIcon(task.priority)}
          <span
            className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {typeof task.assignedTo === "object" && "name" in task.assignedTo ? (
            <>
              <div className="w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-700">
                  {task.assignedTo.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-xs text-gray-600">
                {task.assignedTo.name}
              </span>
            </>
          ) : (
            <>
              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-gray-400">?</span>
              </div>
              <span className="text-xs text-gray-400">Unassigned</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSmartAssign}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            Assign
          </button>
          <span className="text-xs text-gray-400">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
