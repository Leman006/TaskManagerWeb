import { motion, AnimatePresence } from "motion/react";
import { X, FolderKanban, Flag, Calendar } from "lucide-react";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  projects: string[];
  priorities: string[];
  dueDates: string[];
}

export function FilterPanel({ isOpen, onClose, filters, onFilterChange }: FilterPanelProps) {
  const projectOptions = ["Work", "Personal", "Learning", "Health & Fitness"];
  const priorityOptions = ["low", "medium", "high"];
  const dueDateOptions = ["Today", "Tomorrow", "This Week", "No Date"];

  const toggleFilter = (category: keyof FilterState, value: string) => {
    const current = filters[category];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    onFilterChange({ ...filters, [category]: updated });
  };

  const clearAll = () => {
    onFilterChange({ projects: [], priorities: [], dueDates: [] });
  };

  const activeFilterCount =
    filters.projects.length + filters.priorities.length + filters.dueDates.length;

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

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-80 bg-card border-l border-border shadow-2xl dark:shadow-none dark:border-l-border/80 z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-br from-primary/5 to-transparent">
              <div>
                <h2 className="text-xl font-semibold">Filters</h2>
                {activeFilterCount > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <p className="text-sm text-primary font-medium">
                      {activeFilterCount} active
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label="Close filter panel"
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              {/* Projects Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <FolderKanban className="w-4 h-4 text-primary" />
                  <label className="font-medium">Projects</label>
                </div>
                <div className="space-y-2">
                  {projectOptions.map((project) => {
                    const projectColors = {
                      "Work": "bg-project-work-bg text-project-work border-project-work/20",
                      "Personal": "bg-project-personal-bg text-project-personal border-project-personal/20",
                      "Learning": "bg-project-learning-bg text-project-learning border-project-learning/20",
                      "Health & Fitness": "bg-project-health-bg text-project-health border-project-health/20",
                    };
                    const isSelected = filters.projects.includes(project);

                    return (
                      <label
                        key={project}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                          isSelected
                            ? projectColors[project as keyof typeof projectColors]
                            : "hover:bg-accent border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFilter("projects", project)}
                          className="w-4 h-4 rounded border-border accent-primary"
                        />
                        <span className={isSelected ? "font-medium" : ""}>{project}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Priority Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Flag className="w-4 h-4 text-primary" />
                  <label className="font-medium">Priority</label>
                </div>
                <div className="space-y-2">
                  {priorityOptions.map((priority) => {
                    const priorityColors = {
                      "high": "bg-priority-high-bg text-priority-high border-priority-high/20",
                      "medium": "bg-priority-medium-bg text-priority-medium border-priority-medium/20",
                      "low": "bg-priority-low-bg text-priority-low border-priority-low/20",
                    };
                    const dotColors = {
                      "high": "bg-priority-high",
                      "medium": "bg-priority-medium",
                      "low": "bg-priority-low",
                    };
                    const isSelected = filters.priorities.includes(priority);

                    return (
                      <label
                        key={priority}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                          isSelected
                            ? priorityColors[priority as keyof typeof priorityColors]
                            : "hover:bg-accent border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFilter("priorities", priority)}
                          className="w-4 h-4 rounded border-border accent-primary"
                        />
                        <span className={`capitalize ${isSelected ? "font-medium" : ""}`}>{priority}</span>
                        <div className={`ml-auto w-2.5 h-2.5 rounded-full ${dotColors[priority as keyof typeof dotColors]}`} />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Due Date Filter */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-primary" />
                  <label className="font-medium">Due Date</label>
                </div>
                <div className="space-y-2">
                  {dueDateOptions.map((date) => {
                    const isSelected = filters.dueDates.includes(date);

                    return (
                      <label
                        key={date}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${
                          isSelected
                            ? "bg-primary/5 text-primary border-primary/20"
                            : "hover:bg-accent border-transparent"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleFilter("dueDates", date)}
                          className="w-4 h-4 rounded border-border accent-primary"
                        />
                        <span className={isSelected ? "font-medium" : ""}>{date}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-border space-y-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="w-full px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
              >
                Apply Filters
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
