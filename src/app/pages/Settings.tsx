import { motion } from "motion/react";
import { User, Bell, Palette, Globe, Lock, Download } from "lucide-react";
import { useState, useEffect } from "react";

const THEME_STORAGE_KEY = "taskflow-theme";

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const [name, setName] = useState(() => localStorage.getItem("taskflow-user-name") ?? "Alex Morgan");
  const [email, setEmail] = useState("alex.morgan@email.com");
  const [editingField, setEditingField] = useState<"name" | "email" | null>(null);
  const [draftName, setDraftName] = useState(name);
  const [draftEmail, setDraftEmail] = useState(email);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const startEditing = (field: "name" | "email") => {
    setDraftName(name);
    setDraftEmail(email);
    setEditingField(field);
  };

  const saveEdits = () => {
    if (draftName.trim()) {
      setName(draftName.trim());
      localStorage.setItem("taskflow-user-name", draftName.trim());
    }
    if (draftEmail.trim()) setEmail(draftEmail.trim());
    setEditingField(null);
  };

  const cancelEdits = () => {
    setDraftName(name);
    setDraftEmail(email);
    setEditingField(null);
  };

  const handleFieldKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") saveEdits();
    if (e.key === "Escape") cancelEdits();
  };

  const settingsSections = [
    {
      title: "Profile",
      icon: User,
      items: [
        { label: "Name", fieldKey: "name" as const, value: name, type: "text" },
        { label: "Email", fieldKey: "email" as const, value: email, type: "text" },
        { label: "Time Zone", value: "Pacific Time (PT)", type: "select" },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Push Notifications", value: notifications, type: "toggle", onChange: setNotifications },
        { label: "Email Digest", value: emailDigest, type: "toggle", onChange: setEmailDigest },
        { label: "Task Reminders", value: "15 minutes before", type: "select" },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        { label: "Theme", value: theme, type: "theme" },
        { label: "Default View", value: "Dashboard", type: "select" },
        { label: "Compact Mode", value: compactMode, type: "toggle", onChange: setCompactMode },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your preferences and account</p>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sectionIndex * 0.1, duration: 0.5 }}
              className="bg-card border border-border rounded-lg overflow-hidden"
            >
              <div className="flex items-center gap-2 sm:gap-3 p-4 sm:p-6 border-b border-border">
                <section.icon className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <h2 className="text-base sm:text-lg font-semibold">{section.title}</h2>
              </div>

              <div className="divide-y divide-border">
                {section.items.map((item, itemIndex) => {
                  const fk = (item as { fieldKey?: "name" | "email" }).fieldKey;
                  const isEditing = fk !== undefined && editingField === fk;
                  const draftValue = fk === "name" ? draftName : draftEmail;
                  const setDraft = fk === "name" ? setDraftName : setDraftEmail;

                  return (
                    <div key={itemIndex} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                      <div className="flex-1">
                        <div className="text-sm sm:text-base font-medium mb-1">{item.label}</div>
                        {item.type === "text" && !isEditing && (
                          <div className="text-xs sm:text-sm text-muted-foreground">{item.value as string}</div>
                        )}
                        {item.type === "text" && isEditing && (
                          <input
                            type={fk === "email" ? "email" : "text"}
                            value={draftValue}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={handleFieldKeyDown}
                            autoFocus
                            aria-label={`Edit ${item.label}`}
                            className="mt-1 w-full max-w-xs px-3 py-1.5 text-xs sm:text-sm bg-input-background border border-ring rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          />
                        )}
                      </div>

                      <div className="flex-shrink-0">
                        {item.type === "toggle" && (
                          <button
                            onClick={() => (item as { onChange?: (v: boolean) => void }).onChange?.(!item.value)}
                            aria-pressed={item.value as boolean}
                            aria-label={`Toggle ${item.label}`}
                            className={`relative w-12 h-6 rounded-full transition-colors ${
                              item.value ? "bg-primary" : "bg-switch-background"
                            }`}
                          >
                            <motion.div
                              layout
                              className="absolute top-0.5 w-5 h-5 bg-card rounded-full shadow-sm dark:shadow-none dark:border dark:border-border"
                              style={{ left: item.value ? "26px" : "2px" }}
                              transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                          </button>
                        )}

                        {item.type === "select" && (
                          <select
                            aria-label={item.label}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                          >
                            <option>{item.value as string}</option>
                          </select>
                        )}

                        {item.type === "text" && !isEditing && (
                          <button
                            onClick={() => fk && startEditing(fk)}
                            aria-label={`Edit ${item.label}`}
                            className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-primary hover:bg-accent rounded-lg transition-colors"
                          >
                            Edit
                          </button>
                        )}

                        {item.type === "text" && isEditing && (
                          <div className="flex gap-2">
                            <button
                              onClick={cancelEdits}
                              aria-label="Cancel edit"
                              className="px-3 py-1.5 text-xs sm:text-sm border border-border rounded-lg hover:bg-accent transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveEdits}
                              aria-label="Save edit"
                              className="px-3 py-1.5 text-xs sm:text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                            >
                              Save
                            </button>
                          </div>
                        )}

                        {item.type === "theme" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setTheme("light")}
                              aria-pressed={theme === "light"}
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
                                theme === "light"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              Light
                            </button>
                            <button
                              onClick={() => setTheme("dark")}
                              aria-pressed={theme === "dark"}
                              className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-lg transition-colors ${
                                theme === "dark"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground hover:bg-accent"
                              }`}
                            >
                              Dark
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}

          {/* Additional Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-card border border-border rounded-lg p-4 sm:p-6"
          >
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              Advanced
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <button className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-accent rounded-lg transition-colors text-left gap-1 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <span className="text-sm sm:text-base">Export Data</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground ml-7 sm:ml-0">Download all your tasks</span>
              </button>

              <button className="w-full flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 hover:bg-accent rounded-lg transition-colors text-left gap-1 sm:gap-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                  <span className="text-sm sm:text-base">Privacy & Security</span>
                </div>
                <span className="text-xs sm:text-sm text-muted-foreground ml-7 sm:ml-0">Manage your data</span>
              </button>
            </div>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3"
          >
            <button
              onClick={cancelEdits}
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveEdits}
              className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
