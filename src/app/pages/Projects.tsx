import { motion } from "motion/react";
import { Plus, MoreHorizontal, CheckCircle2, Circle, Briefcase, Home, BookOpen, Heart, Palette } from "lucide-react";
import { useState } from "react";
import { AddProjectModal, ProjectInput } from "../components/AddProjectModal";

interface ProjectTask {
  id: number;
  title: string;
  completed: boolean;
}

interface Project {
  id: number;
  name: string;
  color: string;
  icon: React.ElementType;
  tasks: ProjectTask[];
}

export function Projects() {
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: "Work",
      color: "blue",
      icon: Briefcase,
      tasks: [
        { id: 1, title: "Review project proposal", completed: false },
        { id: 2, title: "Team standup meeting", completed: true },
        { id: 3, title: "Finish quarterly report", completed: false },
        { id: 11, title: "Update client documentation", completed: true },
        { id: 12, title: "Code review for PR #234", completed: true },
        { id: 13, title: "Weekly team meeting", completed: true },
        { id: 14, title: "Deploy staging environment", completed: false },
        { id: 15, title: "Fix authentication bug", completed: true },
        { id: 16, title: "Update API endpoints", completed: false },
        { id: 17, title: "Write unit tests", completed: true },
        { id: 18, title: "Optimize database queries", completed: false },
        { id: 19, title: "Security audit review", completed: false },
      ],
    },
    {
      id: 2,
      name: "Personal",
      color: "green",
      icon: Home,
      tasks: [
        { id: 4, title: "Grocery shopping", completed: false },
        { id: 5, title: "Call dentist", completed: false },
        { id: 6, title: "Update portfolio", completed: false },
        { id: 20, title: "Pay utility bills", completed: true },
        { id: 21, title: "Schedule car maintenance", completed: false },
        { id: 22, title: "Organize home office", completed: true },
        { id: 23, title: "Buy birthday gift", completed: false },
        { id: 24, title: "Plan vacation itinerary", completed: true },
      ],
    },
    {
      id: 3,
      name: "Learning",
      color: "purple",
      icon: BookOpen,
      tasks: [
        { id: 7, title: "Complete React course module 3", completed: true },
        { id: 8, title: "Read design patterns book", completed: false },
        { id: 25, title: "Watch TypeScript tutorial", completed: false },
        { id: 26, title: "Practice algorithm problems", completed: false },
        { id: 27, title: "Attend webinar on AI", completed: true },
      ],
    },
    {
      id: 4,
      name: "Health & Fitness",
      color: "red",
      icon: Heart,
      tasks: [
        { id: 9, title: "Morning run", completed: true },
        { id: 10, title: "Meal prep for week", completed: false },
        { id: 28, title: "Yoga session", completed: true },
        { id: 29, title: "Weekly grocery for healthy meals", completed: false },
        { id: 30, title: "Track daily water intake", completed: true },
        { id: 31, title: "30-minute strength training", completed: true },
      ],
    },
  ]);

  const toggleProjectTask = (projectId: number, taskId: number) => {
    setProjects(projects.map((p) =>
      p.id === projectId
        ? {
            ...p,
            tasks: p.tasks.map((t) =>
              t.id === taskId ? { ...t, completed: !t.completed } : t
            ),
          }
        : p
    ));
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-gradient-to-r from-project-work to-project-work/80",
      green: "bg-gradient-to-r from-project-health to-project-health/80",
      purple: "bg-gradient-to-r from-project-learning to-project-learning/80",
      red: "bg-gradient-to-r from-project-personal to-project-personal/80",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getProjectBadge = (color: string) => {
    const badges = {
      blue: "bg-project-work-bg text-project-work border-project-work/20",
      green: "bg-project-health-bg text-project-health border-project-health/20",
      purple: "bg-project-learning-bg text-project-learning border-project-learning/20",
      red: "bg-project-personal-bg text-project-personal border-project-personal/20",
    };
    return badges[color as keyof typeof badges] || badges.blue;
  };

  const iconMap: Record<string, React.ElementType> = {
    briefcase: Briefcase,
    home: Home,
    book: BookOpen,
    heart: Heart,
    palette: Palette,
  };

  const handleAddProject = (projectInput: ProjectInput) => {
    const newProject: Project = {
      id: Math.max(0, ...projects.map((p) => p.id)) + 1,
      name: projectInput.name,
      color: projectInput.color,
      icon: iconMap[projectInput.icon] || Briefcase,
      tasks: [],
    };
    setProjects([...projects, newProject]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Projects</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{projects.length} active projects</p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            aria-label="Add new project"
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project, index) => {
            const completedCount = project.tasks.filter((t) => t.completed).length;
            const taskCount = project.tasks.length;
            const progress = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="p-4 sm:p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`p-1.5 sm:p-2 rounded-lg ${getProjectBadge(project.color)}`}>
                      <project.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-medium text-xs sm:text-sm border ${getProjectBadge(project.color)}`}>
                      {project.name}
                    </div>
                  </div>
                  <button
                    aria-label={`More options for ${project.name}`}
                    className="p-1 hover:bg-accent rounded transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="mb-3 sm:mb-4">
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ delay: 0.2 + index * 0.1, duration: 0.8, ease: "easeOut" }}
                      className={`h-full ${getColorClasses(project.color)}`}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs sm:text-sm text-muted-foreground">
                    <span>{completedCount} of {taskCount} tasks</span>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  {(expandedProject === project.id ? project.tasks : project.tasks.slice(0, 3)).map((task, taskIndex) => (
                    <motion.div
                      key={task.id}
                      initial={expandedProject === project.id && taskIndex >= 3 ? { opacity: 0, height: 0 } : {}}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ delay: taskIndex * 0.05 }}
                      className="flex items-center gap-2 sm:gap-3 p-1.5 sm:p-2 hover:bg-accent rounded-lg transition-colors"
                    >
                      <button
                        onClick={() => toggleProjectTask(project.id, task.id)}
                        aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
                        className="flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground hover:text-primary transition-colors" />
                        )}
                      </button>
                      <span className={`text-xs sm:text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </span>
                    </motion.div>
                  ))}
                  {project.tasks.length > 3 && expandedProject !== project.id && (
                    <button
                      onClick={() => setExpandedProject(project.id)}
                      className="text-xs sm:text-sm text-primary hover:text-primary/80 pl-5 sm:pl-7 py-1 transition-colors font-medium"
                    >
                      +{project.tasks.length - 3} more tasks
                    </button>
                  )}
                  {expandedProject === project.id && (
                    <button
                      onClick={() => setExpandedProject(null)}
                      className="text-xs sm:text-sm text-primary hover:text-primary/80 pl-5 sm:pl-7 py-1 transition-colors font-medium"
                    >
                      Show less
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProject}
      />
    </div>
  );
}
