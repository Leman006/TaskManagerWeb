import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Flag, FolderKanban, Plus } from "lucide-react";
import { useState } from "react";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (task: TaskInput) => void;
}

export interface TaskInput {
  title: string;
  project: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

export function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [project, setProject] = useState("Work");
  const [dueDate, setDueDate] = useState("Today");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title, project, dueDate, priority });
      setTitle("");
      setProject("Work");
      setDueDate("Today");
      setPriority("medium");
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-card border border-border rounded-lg shadow-2xl dark:shadow-none dark:ring-1 dark:ring-border w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">Add New Task</h2>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Task Title */}
                <div>
                  <label className="block text-sm mb-2">Task Name</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What do you need to do?"
                    autoFocus
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                {/* Project */}
                <div>
                  <label className="block text-sm mb-2">
                    <FolderKanban className="w-4 h-4 inline mr-2" />
                    Project
                  </label>
                  <select
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Work</option>
                    <option>Personal</option>
                    <option>Learning</option>
                    <option>Health & Fitness</option>
                  </select>
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Due Date
                  </label>
                  <select
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>This Week</option>
                    <option>Next Week</option>
                    <option>No Date</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm mb-2">
                    <Flag className="w-4 h-4 inline mr-2" />
                    Priority
                  </label>
                  <div className="flex gap-3">
                    {[
                      { value: "low", label: "Low", color: "bg-priority-low-bg text-priority-low border-priority-low/30", activeColor: "ring-2 ring-priority-low/50" },
                      { value: "medium", label: "Medium", color: "bg-priority-medium-bg text-priority-medium border-priority-medium/30", activeColor: "ring-2 ring-priority-medium/50" },
                      { value: "high", label: "High", color: "bg-priority-high-bg text-priority-high border-priority-high/30", activeColor: "ring-2 ring-priority-high/50" },
                    ].map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriority(p.value as any)}
                        className={`flex-1 px-2 sm:px-4 py-2.5 sm:py-3 text-sm rounded-lg border-2 transition-all font-medium ${
                          priority === p.value
                            ? `${p.color} ${p.activeColor}`
                            : "bg-muted text-muted-foreground border-transparent hover:border-border"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                    disabled={!title.trim()}
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
