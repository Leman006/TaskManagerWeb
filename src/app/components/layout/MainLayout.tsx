import { Outlet, NavLink, Link, useLocation } from "react-router";
import { LayoutDashboard, CalendarDays, CheckSquare, Calendar, FolderKanban, BarChart3, Settings, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/today", label: "Today", icon: CalendarDays },
    { to: "/tasks", label: "All Tasks", icon: CheckSquare },
    { to: "/calendar", label: "Calendar", icon: Calendar },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/statistics", label: "Statistics", icon: BarChart3 },
    { to: "/settings", label: "Settings", icon: Settings },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-background overflow-x-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">TaskFlow</h1>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isMobileMenuOpen}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed top-0 left-0 bottom-0 w-64 border-r border-border bg-card flex flex-col shadow-xl dark:shadow-none z-50"
            >
              <div className="p-6 border-b border-border dark:border-border/80 bg-gradient-to-br from-primary/5 to-transparent dark:bg-card dark:from-transparent dark:via-transparent dark:to-transparent flex items-center justify-between">
                <Link to="/" onClick={closeMobileMenu}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 dark:from-primary/30 dark:to-primary/20 dark:ring-1 dark:ring-primary/45 flex items-center justify-center">
                      <CheckSquare className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/70 dark:bg-none bg-clip-text text-transparent dark:text-foreground">TaskFlow</h1>
                  </div>
                  <p className="text-sm text-muted-foreground dark:text-primary/80">Plan your perfect day</p>
                </Link>
                <button
                  onClick={closeMobileMenu}
                  aria-label="Close navigation menu"
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeMobileNav"
                            className="absolute inset-0 bg-primary rounded-lg -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-border dark:border-border/80 bg-gradient-to-br from-primary/5 to-transparent dark:bg-card dark:from-transparent dark:via-transparent dark:to-transparent">
          <Link to="/">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 dark:from-primary/30 dark:to-primary/20 dark:ring-1 dark:ring-primary/45 flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/70 dark:bg-none bg-clip-text text-transparent dark:text-foreground">TaskFlow</h1>
            </div>
            <p className="text-sm text-muted-foreground dark:text-primary/80">Plan your perfect day</p>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-primary rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main ref={mainRef} className="flex-1 overflow-auto pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
