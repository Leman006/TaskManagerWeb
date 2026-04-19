import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Clock, Plus, X, CheckCircle2, Circle } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useTaskContext } from "../context/TaskContext";
import type { Task } from "../context/TaskContext";

const MONTH_MAP: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function fmtIso(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// Converts a task's dueDate string (e.g. "Today", "Apr 20") to YYYY-MM-DD
function resolveDueDate(dueDate: string): string | null {
  const today = new Date();
  if (dueDate === "Today") return fmtIso(today);
  if (dueDate === "Tomorrow") {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return fmtIso(d);
  }
  if (dueDate === "This Week") {
    const d = new Date(today);
    const rem = (7 - d.getDay()) % 7 || 7;
    d.setDate(d.getDate() + rem);
    return fmtIso(d);
  }
  if (dueDate === "Next Week") {
    const d = new Date(today);
    const toMon = (8 - d.getDay()) % 7 || 7;
    d.setDate(d.getDate() + toMon);
    return fmtIso(d);
  }
  if (dueDate === "No Date") return null;
  const m = dueDate.match(/^([A-Za-z]{3})\s+(\d{1,2})$/);
  if (m && MONTH_MAP[m[1]] !== undefined) {
    return fmtIso(new Date(today.getFullYear(), MONTH_MAP[m[1]], parseInt(m[2])));
  }
  return null;
}

// Converts YYYY-MM-DD back to a task dueDate label
function isoToDueDate(iso: string): string {
  const today = new Date();
  const todayStr = fmtIso(today);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (iso === todayStr) return "Today";
  if (iso === fmtIso(tomorrow)) return "Tomorrow";
  const [y, mo, d] = iso.split("-").map(Number);
  return new Date(y, mo - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const PRIORITY_CHIP: Record<"low" | "medium" | "high", string> = {
  high: "bg-priority-high-bg text-priority-high",
  medium: "bg-priority-medium-bg text-priority-medium",
  low: "bg-priority-low-bg text-priority-low",
};

const PRIORITY_DOT: Record<"low" | "medium" | "high", string> = {
  high: "bg-priority-high",
  medium: "bg-priority-medium",
  low: "bg-priority-low",
};

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number) => void }) {
  return (
    <button
      onClick={() => onToggle(task.id)}
      className="w-full flex items-center gap-3 p-3 hover:bg-accent rounded-lg transition-colors text-left"
    >
      {task.completed ? (
        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
      ) : (
        <Circle className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div
          className={`text-sm sm:text-base font-medium truncate ${
            task.completed ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.time && (
            <span className="text-muted-foreground mr-1.5 font-normal">{task.time} —</span>
          )}
          {task.title}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority]}`} />
          <span className="text-xs text-muted-foreground capitalize">
            {task.priority} · {task.project}
          </span>
        </div>
      </div>
    </button>
  );
}

export function Calendar() {
  const { tasks, addTask, toggleTask } = useTaskContext();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(() => fmtIso(new Date()));
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
  const [newProject, setNewProject] = useState("Work");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Map each ISO date to the tasks due that day
  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const task of tasks) {
      const key = resolveDueDate(task.dueDate);
      if (key) {
        if (!map[key]) map[key] = [];
        map[key].push(task);
      }
    }
    return map;
  }, [tasks]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      daysInMonth: new Date(year, month + 1, 0).getDate(),
      startingDayOfWeek: new Date(year, month, 1).getDay(),
    };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const previousMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const goToday = () => {
    const t = new Date();
    setCurrentDate(new Date(t.getFullYear(), t.getMonth(), 1));
    setSelectedDateStr(fmtIso(t));
  };

  const getDateKey = (day: number) =>
    fmtIso(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const todayStr = fmtIso(new Date());
  const isSelectedToday = selectedDateStr === todayStr;

  const selectedTasks = tasksByDate[selectedDateStr] || [];
  const withTime = [...selectedTasks]
    .filter((t) => t.time)
    .sort((a, b) => (a.time! > b.time! ? 1 : -1));
  const withoutTime = selectedTasks.filter((t) => !t.time);

  const [selYear, selMonth, selDay] = selectedDateStr.split("-").map(Number);
  const scheduleTitle = isSelectedToday
    ? "Today's Schedule"
    : `Schedule for ${new Date(selYear, selMonth - 1, selDay).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })}`;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      project: newProject,
      dueDate: isoToDueDate(selectedDateStr),
      priority: newPriority,
    });
    setNewTitle("");
    setNewPriority("medium");
    setShowAddForm(false);
  };

  const handleDayClick = (dateKey: string) => {
    setSelectedDateStr(dateKey);
    setShowAddForm(false);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Calendar</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Plan and organize your schedule
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-card border border-border rounded-lg">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-medium">
                  {currentTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
                <span className="text-xs text-muted-foreground">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-1.5 sm:gap-4">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <h2 className="text-base sm:text-lg font-semibold min-w-[120px] sm:min-w-[200px] text-center">
                {monthName}
              </h2>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={goToday}
                className="text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 lg:gap-4">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-medium text-muted-foreground py-2 sm:py-3"
            >
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.slice(0, 1)}</span>
            </div>
          ))}

          {Array.from({ length: startingDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const dateKey = getDateKey(day);
            const dayTasks = tasksByDate[dateKey] || [];
            const today = isToday(day);
            const isSelected = dateKey === selectedDateStr && !today;

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.01, duration: 0.2 }}
                onClick={() => handleDayClick(dateKey)}
                className={`aspect-square p-1.5 sm:p-2 lg:p-3 border rounded-lg cursor-pointer transition-all hover:border-primary/50 ${
                  today
                    ? "bg-primary/5 border-primary"
                    : isSelected
                    ? "bg-accent border-accent-foreground/20"
                    : "bg-card border-border"
                }`}
              >
                <div
                  className={`text-xs sm:text-sm mb-1 sm:mb-2 ${
                    today
                      ? "font-semibold text-primary"
                      : isSelected
                      ? "font-semibold text-foreground"
                      : "text-foreground"
                  }`}
                >
                  {day}
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className={`text-[10px] sm:text-xs p-0.5 sm:p-1 lg:p-1.5 rounded truncate ${
                        PRIORITY_CHIP[task.priority]
                      } ${task.completed ? "opacity-40 line-through" : ""}`}
                    >
                      <span className="hidden sm:inline">
                        {task.time ? `${task.time} - ` : ""}
                        {task.title}
                      </span>
                      <span className="sm:hidden">{task.title}</span>
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-[10px] sm:text-xs text-muted-foreground pl-0.5 sm:pl-1.5">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Schedule panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 sm:mt-8 p-4 sm:p-6 bg-card border border-border rounded-lg"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold">{scheduleTitle}</h3>
            <button
              onClick={() => {
                setShowAddForm(true);
                setNewTitle("");
              }}
              className="flex items-center gap-1.5 text-xs sm:text-sm px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              <Plus className="w-3.5 h-3.5" />
              Add task
            </button>
          </div>

          {/* Inline add form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleAddTask}
                className="mb-4 p-3 border border-dashed border-border rounded-lg space-y-3 overflow-hidden"
              >
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Task title..."
                    className="flex-1 text-sm px-3 py-2 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="p-2 hover:bg-accent rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={newProject}
                    onChange={(e) => setNewProject(e.target.value)}
                    className="text-xs px-2 py-1.5 bg-input-background border border-border rounded-lg focus:outline-none"
                  >
                    <option>Work</option>
                    <option>Personal</option>
                    <option>Learning</option>
                    <option>Health &amp; Fitness</option>
                  </select>
                  <div className="flex gap-1.5 flex-1 min-w-[180px]">
                    {(["low", "medium", "high"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setNewPriority(p)}
                        className={`flex-1 text-xs py-1.5 rounded-lg border-2 transition-all capitalize ${
                          newPriority === p
                            ? `${PRIORITY_CHIP[p]} border-current`
                            : "bg-muted text-muted-foreground border-transparent hover:border-border"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    type="submit"
                    disabled={!newTitle.trim()}
                    className="text-xs px-3 py-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    Add
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {selectedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No tasks scheduled for this day
            </div>
          ) : (
            <div className="space-y-4">
              {withTime.length > 0 && (
                <div className="space-y-1">
                  {withTime.map((task) => (
                    <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                  ))}
                </div>
              )}
              {withoutTime.length > 0 && (
                <div>
                  {withTime.length > 0 && (
                    <div className="text-xs text-muted-foreground mb-1 font-medium px-3">
                      No time set
                    </div>
                  )}
                  <div className="space-y-1">
                    {withoutTime.map((task) => (
                      <TaskRow key={task.id} task={task} onToggle={toggleTask} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
