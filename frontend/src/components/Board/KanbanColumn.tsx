import type { KCProps } from "./props.types";
import TaskCard from "./TaskCard";
import CreateTaskModal from "./CreateTaskModal";
import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";

const getStatusColor = (status: string) => {
  switch (status) {
    case "Todo":
      return "bg-gray-50 border-gray-200";
    case "In Progress":
      return "bg-gray-50 border-gray-200";
    case "Done":
      return "bg-gray-50 border-gray-200";
    default:
      return "bg-gray-50 border-gray-200";
  }
};

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Todo":
      return "bg-gray-100 text-gray-600";
    case "In Progress":
      return "bg-gray-100 text-gray-600";
    case "Done":
      return "bg-gray-100 text-gray-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

const KanbanColumn = ({ title, tasks, onNewTask }: KCProps) => {
  const [showModal, setShowModal] = useState(false);
  const { setNodeRef } = useDroppable({ id: title });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border ${getStatusColor(title)} p-4 min-h-[500px]`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getStatusBadgeColor(
              title
            )}`}
          >
            {tasks.length}
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            + Add
          </button>
        </div>
      </div>

      {showModal && (
        <CreateTaskModal
          onClose={() => setShowModal(false)}
          onCreate={(task) => onNewTask?.(task)}
          defaultStatus={title}
        />
      )}

      <div className="space-y-2">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-300 mb-3">
              <svg
                className="mx-auto h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <p className="text-xs text-gray-400">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => <TaskCard key={task._id} task={task} />)
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
