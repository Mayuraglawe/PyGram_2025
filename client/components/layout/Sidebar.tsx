import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth, RoleGate } from "@/contexts/AuthContext";
import useTheme from "@/hooks/use-theme";
import { useState } from "react";
import {
  Home,
  Building2,
  Shield,
  Settings,
  LogOut,
  Moon,
  Sun,
  Bell,
  ChevronLeft,
  ChevronRight,
  BarChart3
} from "lucide-react";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/signin');
  };

  return (
    <aside className={`bg-background border-r border-border/40 transition-all duration-300 flex flex-col ${
      isCollapsed ? "w-16" : "w-64"
    }`}>
      {/* Header */}
      <div className="p-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">PG</span>
              </div>
              <span className="font-semibold text-lg">Py-Gram</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-9 w-9 rounded-lg hover:bg-accent/60 transition-all duration-200 hover:scale-105"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {/* Core Navigation */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive ? "bg-primary text-white" : "text-foreground/70 hover:bg-accent hover:text-foreground"
            } ${isCollapsed ? "justify-center" : ""}`
          }
        >
          <Home className="h-5 w-5" />
          {!isCollapsed && <span>Dashboard</span>}
        </NavLink>


        {/* Admin Section */}
        <RoleGate allowedRoles={["admin"]}>
          <div className="pt-4">
            {!isCollapsed && <div className="text-xs font-semibold text-muted-foreground px-3 mb-2">ADMINISTRATION</div>}
            <NavLink
              to="/departments"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "bg-primary text-white" : "text-foreground/70 hover:bg-accent hover:text-foreground"
                } ${isCollapsed ? "justify-center" : ""}`
              }
            >
              <Building2 className="h-5 w-5" />
              {!isCollapsed && <span>Departments</span>}
            </NavLink>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "bg-primary text-white" : "text-foreground/70 hover:bg-accent hover:text-foreground"
                } ${isCollapsed ? "justify-center" : ""}`
              }
            >
              <Shield className="h-5 w-5" />
              {!isCollapsed && <span>System Admin</span>}
            </NavLink>
            <NavLink
              to="/telegram-setup"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "bg-primary text-white" : "text-foreground/70 hover:bg-accent hover:text-foreground"
                } ${isCollapsed ? "justify-center" : ""}`
              }
            >
              <BarChart3 className="h-5 w-5" />
              {!isCollapsed && <span>Analytics</span>}
            </NavLink>
          </div>
        </RoleGate>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border/40 bg-muted/10">
        {/* All Symbols in One Horizontal Line */}
        <div className="flex gap-2 justify-center items-center">
          {/* User Profile */}
          {user && (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20 cursor-pointer hover:ring-primary/40 transition-all duration-200">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-semibold text-sm">
                      {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="top" className="font-medium">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-semibold">
                      {user.first_name} {user.last_name}
                    </p>
                    <div className="flex items-center gap-1">
                      <Badge className="text-xs px-2 py-0.5 bg-gradient-to-r from-primary to-blue-600 text-white">
                        {user.role}
                      </Badge>
                      {user.mentor_type && (
                        <Badge className="text-xs px-2 py-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                          {user.mentor_type}
                        </Badge>
                      )}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Notifications */}
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/notifications")}
                  className="h-8 w-8 p-0 hover:bg-accent/60 rounded-lg"
                >
                  <div className="relative">
                    <Bell className="h-4 w-4" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                      2
                    </span>
                  </div>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Notifications
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Theme Toggle */}
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggle}
                  className="h-8 w-8 p-0 hover:bg-accent/60 rounded-lg"
                >
                  {theme === "dark" ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Settings */}
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/settings")}
                  className="h-8 w-8 p-0 hover:bg-accent/60 rounded-lg"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Settings
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Logout */}
          <TooltipProvider>
            <Tooltip delayDuration={100}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-medium">
                Log out
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </aside>
  );
}