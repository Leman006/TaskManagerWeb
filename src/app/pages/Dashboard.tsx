import { motion } from "motion/react";
import { Plus, CheckCircle2, Circle, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import { AddTaskModal, TaskInput } from "../components/AddTaskModal";
import { useTaskContext } from "../context/TaskContext";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function Dashboard() {
  const { tasks, addTask, toggleTask } = useTaskContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const firstName = (localStorage.getItem("taskflow-user-name") ?? "Alex Morgan").split(" ")[0];

  const handleAddTask = (taskInput: TaskInput) => {
    addTask(taskInput);
  };

  const todayTasks = tasks.filter((t) => t.dueDate === "Today");
  const completedCount = tasks.filter((t) => t.completed).length;
  const inProgressCount = tasks.filter((t) => !t.completed).length;
  const todayCompleted = todayTasks.filter((t) => t.completed).length;
  const todayCompletionRate =
    todayTasks.length > 0
      ? Math.round((todayCompleted / todayTasks.length) * 100)
      : 0;
  const overallRate =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
  const productivityDelta = overallRate - 50;
  const formatSigned = (value: number, suffix = "") =>
    `${value > 0 ? "+" : ""}${value}${suffix}`;

  const stats = [
    {
      label: "Tasks Today",
      value: String(todayTasks.length),
      change: formatSigned(todayTasks.length),
      changeClass:
        todayTasks.length > 0
          ? "text-green-600 dark:text-green-400"
          : "text-muted-foreground",
      icon: Circle,
    },
    {
      label: "Completed",
      value: String(completedCount),
      change: formatSigned(completedCount),
      changeClass:
        completedCount > 0
          ? "text-green-600 dark:text-green-400"
          : "text-muted-foreground",
      icon: CheckCircle2,
    },
    {
      label: "In Progress",
      value: String(inProgressCount),
      change: formatSigned(inProgressCount),
      changeClass:
        inProgressCount > 0
          ? "text-amber-600 dark:text-amber-400"
          : "text-muted-foreground",
      icon: Clock,
    },
    {
      label: "Productivity",
      value: `${overallRate}%`,
      change: formatSigned(productivityDelta, "%"),
      changeClass:
        productivityDelta >= 0
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              {getGreeting()}, {firstName}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              You have {inProgressCount} tasks to complete today
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            aria-label="Add new task"
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-lg hover:shadow-lg hover:shadow-primary/25 dark:hover:shadow-none dark:hover:ring-1 dark:hover:ring-primary/40 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Add Task</span>
            <span className="sm:hidden">Add</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-4 sm:p-6 bg-card border border-border rounded-lg"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <span className={`text-xs sm:text-sm ${stat.changeClass}`}>{stat.change}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-semibold mb-1">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-6 sm:mb-8 p-4 sm:p-6 bg-card border border-border rounded-lg"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="text-base sm:text-lg font-semibold">
              Today's Progress
            </h2>
            <span className="text-xs sm:text-sm text-muted-foreground">
              {todayCompletionRate}% Complete
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${todayCompletionRate}%` }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
              className="h-full bg-primary"
            />
          </div>
        </motion.div>

        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            Recent Tasks
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {todayTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer group"
              >
                <button
                  className="flex-shrink-0"
                  onClick={() => toggleTask(task.id)}
                  aria-label={
                    task.completed ? "Mark as incomplete" : "Mark as complete"
                  }
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  ) : (
                    <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-sm sm:text-base font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                  >
                    {task.title}
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                    {task.project}
                  </div>
                </div>
                <div
                  className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    task.priority === "high"
                      ? "bg-priority-high-bg text-priority-high"
                      : task.priority === "medium"
                        ? "bg-priority-medium-bg text-priority-medium"
                        : "bg-priority-low-bg text-priority-low"
                  }`}
                >
                  {task.priority}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}
