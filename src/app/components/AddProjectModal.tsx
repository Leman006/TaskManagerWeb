import { motion, AnimatePresence } from "motion/react";
import { X, Briefcase, Home, BookOpen, Heart, Palette } from "lucide-react";
import { useState } from "react";

export interface ProjectInput {
  name: string;
  color: string;
  icon: string;
}

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (project: ProjectInput) => void;
}

export function AddProjectModal({ isOpen, onClose, onAdd }: AddProjectModalProps) {
  const [projectName, setProjectName] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedIcon, setSelectedIcon] = useState("briefcase");

  const colors = [
    { name: "blue", label: "Indigo", class: "bg-project-work" },
    { name: "red", label: "Pink", class: "bg-project-personal" },
    { name: "purple", label: "Purple", class: "bg-project-learning" },
    { name: "green", label: "Teal", class: "bg-project-health" },
  ];

  const icons = [
    { name: "briefcase", label: "Briefcase", Icon: Briefcase },
    { name: "home", label: "Home", Icon: Home },
    { name: "book", label: "Book", Icon: BookOpen },
    { name: "heart", label: "Heart", Icon: Heart },
    { name: "palette", label: "Palette", Icon: Palette },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName.trim()) {
      onAdd({
        name: projectName,
        color: selectedColor,
        icon: selectedIcon,
      });
      setProjectName("");
      setSelectedColor("blue");
      setSelectedIcon("briefcase");
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
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-card border border-border rounded-lg shadow-xl dark:shadow-none dark:ring-1 dark:ring-border w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-semibold">Create New Project</h2>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="p-1 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Project Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name..."
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    autoFocus
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Project Icon</label>
                  <div className="grid grid-cols-5 gap-3">
                    {icons.map((icon) => (
                      <button
                        key={icon.name}
                        type="button"
                        onClick={() => setSelectedIcon(icon.name)}
                        className={`p-3 border rounded-lg transition-all hover:border-primary/50 ${
                          selectedIcon === icon.name
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                      >
                        <icon.Icon className="w-5 h-5 mx-auto" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">Project Color</label>
                  <div className="grid grid-cols-4 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => setSelectedColor(color.name)}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          selectedColor === color.name
                            ? "border-primary scale-105"
                            : "border-transparent hover:border-border"
                        }`}
                      >
                        <div className={`w-full h-8 rounded ${color.class}`} />
                        <p className="text-xs mt-2 text-center">{color.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!projectName.trim()}
                    className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create Project
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
