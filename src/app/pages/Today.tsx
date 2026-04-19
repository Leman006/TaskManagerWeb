import { motion } from "motion/react";
import { Plus, CheckCircle2, Circle, Calendar, Flag, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddTaskModal, TaskInput } from "../components/AddTaskModal";
import { useTaskContext } from "../context/TaskContext";

export function Today() {
  const { tasks, addTask, toggleTask, removeTask } = useTaskContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const todayTasks = tasks.filter((t) => t.dueDate === "Today");

  const handleAddTask = (taskInput: TaskInput) => {
    addTask({ ...taskInput, dueDate: "Today", time: "12:00 PM" });
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">{dateStr}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Today</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            {todayTasks.filter((t) => t.completed).length} of {todayTasks.length} completed
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          aria-label="Add a task for today"
          className="w-full flex items-center gap-3 p-3 sm:p-4 mb-4 sm:mb-6 border-2 border-dashed border-border rounded-lg hover:border-primary/50 hover:bg-accent/50 transition-colors group"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="text-sm sm:text-base text-muted-foreground group-hover:text-foreground transition-colors">Add a task for today</span>
        </button>

        <div className="space-y-2 sm:space-y-3">
          {todayTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              className="group"
            >
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-5 bg-card border border-border rounded-lg hover:border-primary/50 transition-all">
                <button
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                  className="flex-shrink-0 mt-0.5"
                >
                  {task.completed ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 25 }}
                    >
                      <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </motion.div>
                  ) : (
                    <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className={`text-sm sm:text-base font-medium mb-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    {task.time && <span>{task.time}</span>}
                    <div className="flex items-center gap-1">
                      <Flag className="w-3 h-3" />
                      <span className="capitalize">{task.priority}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeTask(task.id)}
                  aria-label={`Delete task: ${task.title}`}
                  className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {todayTasks.length > 0 && todayTasks.filter((t) => t.completed).length === todayTasks.length && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 sm:mt-8 p-6 sm:p-8 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-xl text-center"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">All tasks completed!</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">Great work today. Take a moment to celebrate your progress.</p>
          </motion.div>
        )}
      </motion.div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}
