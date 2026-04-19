import { motion } from "motion/react";
import { TrendingUp, CheckCircle2, Target, Zap } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useEffect, useState } from "react";

export function Statistics() {
  const getCssVars = () => {
    const style = getComputedStyle(document.documentElement);
    return {
      primary: style.getPropertyValue("--primary").trim() || "var(--primary)",
      muted: style.getPropertyValue("--muted").trim() || "var(--muted)",
      mutedForeground: style.getPropertyValue("--muted-foreground").trim() || "var(--muted-foreground)",
      card: style.getPropertyValue("--card").trim() || "var(--card)",
      border: style.getPropertyValue("--border").trim() || "var(--border)",
    };
  };
  const [cssVars, setCssVars] = useState(getCssVars);

  useEffect(() => {
    const root = document.documentElement;
    const observer = new MutationObserver(() => setCssVars(getCssVars()));
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const weeklyData = [
    { day: "Mon", completed: 8, created: 10 },
    { day: "Tue", completed: 12, created: 14 },
    { day: "Wed", completed: 10, created: 11 },
    { day: "Thu", completed: 15, created: 16 },
    { day: "Fri", completed: 9, created: 12 },
    { day: "Sat", completed: 5, created: 6 },
    { day: "Sun", completed: 3, created: 4 },
  ];

  const productivityData = [
    { week: "Week 1", rate: 65 },
    { week: "Week 2", rate: 72 },
    { week: "Week 3", rate: 78 },
    { week: "Week 4", rate: 85 },
    { week: "Week 5", rate: 82 },
    { week: "Week 6", rate: 88 },
  ];

  const stats = [
    {
      label: "Completion Rate",
      value: "88%",
      change: "+12%",
      trend: "up",
      icon: Target,
    },
    {
      label: "Tasks Completed",
      value: "247",
      change: "+34",
      trend: "up",
      icon: CheckCircle2,
    },
    {
      label: "Current Streak",
      value: "12 days",
      change: "+2",
      trend: "up",
      icon: Zap,
    },
    {
      label: "Avg. Daily Tasks",
      value: "8.2",
      change: "+1.4",
      trend: "up",
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
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Statistics</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Track your productivity and progress</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="p-4 sm:p-6 bg-card border border-border rounded-lg hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2 sm:p-2.5 rounded-lg bg-gradient-to-br ${
                  index === 0 ? "from-green-500 to-green-600" :
                  index === 1 ? "from-blue-500 to-blue-600" :
                  index === 2 ? "from-purple-500 to-purple-600" :
                  "from-orange-500 to-orange-600"
                }`}>
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 bg-green-50 dark:bg-green-500/15 rounded">{stat.change}</span>
              </div>
              <div className="text-2xl sm:text-3xl font-semibold mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="p-4 sm:p-6 bg-card border border-border rounded-lg"
          >
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Weekly Activity</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={weeklyData}>
                <CartesianGrid key="bar-grid" strokeDasharray="3 3" stroke={cssVars.border} strokeOpacity={0.4} />
                <XAxis
                  key="bar-xaxis"
                  dataKey="day"
                  tick={{ fill: cssVars.mutedForeground, fontSize: 12 }}
                  axisLine={{ stroke: cssVars.border }}
                />
                <YAxis
                  key="bar-yaxis"
                  tick={{ fill: cssVars.mutedForeground, fontSize: 12 }}
                  axisLine={{ stroke: cssVars.border }}
                />
                <Tooltip
                  key="bar-tooltip"
                  contentStyle={{
                    backgroundColor: cssVars.card,
                    border: `1px solid ${cssVars.border}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar key="completed-bar" dataKey="completed" fill={cssVars.primary} radius={[4, 4, 0, 0]} />
                <Bar key="created-bar" dataKey="created" fill={cssVars.muted} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary" />
                <span className="text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-accent" />
                <span className="text-muted-foreground">Created</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="p-4 sm:p-6 bg-card border border-border rounded-lg"
          >
            <h3 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Productivity Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={productivityData}>
                <CartesianGrid key="line-grid" strokeDasharray="3 3" stroke={cssVars.border} strokeOpacity={0.4} />
                <XAxis
                  key="line-xaxis"
                  dataKey="week"
                  tick={{ fill: cssVars.mutedForeground, fontSize: 12 }}
                  axisLine={{ stroke: cssVars.border }}
                />
                <YAxis
                  key="line-yaxis"
                  tick={{ fill: cssVars.mutedForeground, fontSize: 12 }}
                  axisLine={{ stroke: cssVars.border }}
                  domain={[0, 100]}
                />
                <Tooltip
                  key="line-tooltip"
                  contentStyle={{
                    backgroundColor: cssVars.card,
                    border: `1px solid ${cssVars.border}`,
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value) => [`${value}%`, 'Completion Rate']}
                />
                <Line
                  key="rate-line"
                  type="monotone"
                  dataKey="rate"
                  stroke={cssVars.primary}
                  strokeWidth={2}
                  dot={{ fill: cssVars.primary, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Additional Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6"
        >
          <div className="p-4 sm:p-6 bg-card border border-border rounded-lg">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Most Productive Day</h4>
            <div className="text-xl sm:text-2xl font-semibold mb-1">Thursday</div>
            <p className="text-xs sm:text-sm text-muted-foreground">Average 15 tasks completed</p>
          </div>

          <div className="p-4 sm:p-6 bg-card border border-border rounded-lg">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Top Project</h4>
            <div className="text-xl sm:text-2xl font-semibold mb-1">Work</div>
            <p className="text-xs sm:text-sm text-muted-foreground">142 tasks completed</p>
          </div>

          <div className="p-4 sm:p-6 bg-card border border-border rounded-lg">
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">This Month</h4>
            <div className="text-xl sm:text-2xl font-semibold mb-1">247 tasks</div>
            <p className="text-xs sm:text-sm text-muted-foreground">+28% from last month</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
