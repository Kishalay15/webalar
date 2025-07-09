import { useEffect, useState } from "react";
import axios from "../../api/axios";
import type { User } from "../../types/models.types";
import type { CTMProps } from "./props.types";

const CreateTaskModal = ({ onClose, onCreate, defaultStatus }: CTMProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    axios.get("/auth/users").then((res) => setUsers(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post("/tasks", {
      title,
      description,
      priority,
      assignedTo,
      status: defaultStatus,
    });
    onCreate(res.data);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96"
      >
        <h2 className="text-lg font-bold mb-4">Create Task</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select
          className="border p-2 w-full mb-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
        <select
          className="border p-2 w-full mb-4"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">-- Assign to --</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1 bg-blue-600 text-white rounded"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskModal;
