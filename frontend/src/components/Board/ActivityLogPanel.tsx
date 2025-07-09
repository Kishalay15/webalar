import { useEffect, useState } from "react";
import { Activity, X, Clock, User, AlertCircle } from "lucide-react";
import instance from "../../api/axios";
import { socket } from "../../config/socket";
import type { Log } from "./props.types";

const ActivityLogPanel = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/logs");
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();

    socket.on("activity-log", (newLog: Log) => {
      setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
    });

    return () => {
      socket.off("activity-log");
    };
  }, []);

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
      return date.toLocaleDateString();
    } catch {
      return timestamp;
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes("created"))
      return <div className="w-2 h-2 bg-green-500 rounded-full" />;
    if (action.includes("updated"))
      return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
    if (action.includes("deleted"))
      return <div className="w-2 h-2 bg-red-500 rounded-full" />;
    if (action.includes("assigned"))
      return <div className="w-2 h-2 bg-purple-500 rounded-full" />;
    return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-white border border-gray-200 rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow duration-200 z-40"
        title="Activity Log"
      >
        <Activity className="w-5 h-5 text-gray-700" />
        {logs.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {logs.length > 9 ? "9+" : logs.length}
          </span>
        )}
      </button>

      {/* Activity Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black bg-opacity-25 md:bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="bg-white w-full md:w-96 h-full shadow-xl overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-gray-700" />
                <h2 className="text-lg font-medium text-gray-900">
                  Activity Log
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm">No activity yet</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-3 h-3 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {log.user}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">
                          {log.action}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatTimestamp(log.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityLogPanel;
