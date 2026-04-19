import { motion } from "motion/react";
import { Plus, Search, Filter, CheckCircle2, Circle, Calendar, Trash2 } from "lucide-react";
import { useState } from "react";
import { AddTaskModal, TaskInput } from "../components/AddTaskModal";
import { FilterPanel, FilterState } from "../components/FilterPanel";
import { useTaskContext } from "../context/TaskContext";

export function AllTasks() {
  const { tasks, addTask, toggleTask, removeTask } = useTaskContext();
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    projects: [],
    priorities: [],
    dueDates: [],
  });

  const handleAddTask = (taskInput: TaskInput) => {
    addTask(taskInput);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active" && task.completed) return false;
    if (filter === "completed" && !task.completed) return false;

    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    if (filters.projects.length > 0 && !filters.projects.includes(task.project)) {
      return false;
    }
    if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
      return false;
    }
    if (filters.dueDates.length > 0 && !filters.dueDates.includes(task.dueDate)) {
      return false;
    }

    return true;
  });

  const activeFilterCount = filters.projects.length + filters.priorities.length + filters.dueDates.length;

  const filterOptions = [
    { value: "all", label: "All", count: tasks.length },
    { value: "active", label: "Active", count: tasks.filter((t) => !t.completed).length },
    { value: "completed", label: "Completed", count: tasks.filter((t) => t.completed).length },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">All Tasks</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{filteredTasks.length} tasks</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            aria-label="Add new task"
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tasks"
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            aria-label={`Open filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ""}`}
            className="flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 border border-border rounded-lg hover:bg-accent transition-colors relative"
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Filter</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 p-1 bg-muted rounded-lg w-full sm:w-fit overflow-x-auto">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as "all" | "active" | "completed")}
              aria-pressed={filter === option.value}
              className={`flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-md transition-colors relative text-sm sm:text-base whitespace-nowrap ${
                filter === option.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {option.label}
              <span className="ml-1.5 sm:ml-2 text-xs">{option.count}</span>
              {filter === option.value && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-background rounded-md shadow-sm -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tasks List */}
        <div className="space-y-2 sm:space-y-3">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="flex items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-5 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors group cursor-pointer"
            >
              <button
                className="flex-shrink-0 mt-0.5 sm:mt-0"
                onClick={() => toggleTask(task.id)}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                ) : (
                  <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className={`text-sm sm:text-base font-medium mb-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span>{task.project}</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className={`px-2 sm:px-3 py-1 rounded-full text-xs flex-shrink-0 font-medium ${
                task.priority === "high" ? "bg-priority-high-bg text-priority-high" :
                task.priority === "medium" ? "bg-priority-medium-bg text-priority-medium" :
                "bg-priority-low-bg text-priority-low"
              }`}>
                {task.priority}
              </div>

              <button
                onClick={() => removeTask(task.id)}
                aria-label={`Delete task: ${task.title}`}
                className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Circle className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-muted-foreground">No tasks found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters or search</p>
          </motion.div>
        )}
      </motion.div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTask}
      />

      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
      />
    </div>
  );
}
