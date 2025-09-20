import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/notifications/NotificationComponents";
import useTheme from "@/hooks/use-theme";
import { useAuth, RoleGate, PermissionGate } from "@/contexts/AuthContext";
import { DepartmentSwitcher, DepartmentBreadcrumb } from "@/components/routing/DepartmentRouter";
import { Crown, Shield, GraduationCap, LogOut, User, Settings, Moon, Sun, Bot } from 'lucide-react';

function LogoImage() {
  const [ok, setOk] = useState(true);
  const src = "https://cdn.builder.io/api/v1/image/assets%2F2eee8cdc1a0849ce9573cd1f6b8b1470%2F532b6195227a44ac868676fe6e2f1685?format=webp&width=800";
  if (ok) {
    return (
      <img
        src={src}
        alt="Py-Gram logo"
        className="h-8 w-8 rounded-xl object-cover shadow-sm"
        onError={() => setOk(false)}
      />
    );
  }
  return <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-sm" />;
}

export default function Header() {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
      isActive 
        ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md" 
        : "text-foreground/70 hover:bg-card hover:text-foreground hover:shadow-sm"
    }`;

  const { theme, toggle } = useTheme();
  const { user, logout, isAuthenticated, isCreatorMentor, isPublisherMentor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'mentor': return Shield;
      case 'student': return GraduationCap;
      default: return User;
    }
  };

  const getRoleColor = (role: string, mentorType?: string) => {
    if (role === 'mentor' && mentorType) {
      return mentorType === 'creator' 
        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
    }
    switch (role) {
      case 'admin': return 'bg-gradient-to-r from-purple-500 to-pink-600 text-white';
      case 'mentor': return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white';
      case 'student': return 'bg-gradient-to-r from-orange-500 to-red-600 text-white';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
    }
  };

  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/signin" className="flex items-center gap-3 hover:scale-105 transition-transform">
            <LogoImage />
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Py-Gram 2k25
              </span>
              <span className="text-xs text-muted-foreground font-medium">AI-Powered Timetables</span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggle}
              className="rounded-xl h-10 w-10 hover:bg-accent/60"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button asChild className="rounded-xl font-medium gradient-primary hover:scale-105 transition-transform">
              <Link to="/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
          <LogoImage />
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Py-Gram 2k25
            </span>
            <span className="text-xs text-muted-foreground font-medium">AI-Powered Timetables</span>
          </div>
        </Link>

        {/* Department Breadcrumb - shows active department context */}
        <div className="hidden lg:flex items-center">
          <DepartmentBreadcrumb />
        </div>

        <nav className="hidden md:flex items-center gap-2">
          <NavLink to="/" className={navLinkClass} end>
            Dashboard
          </NavLink>
          
          <PermissionGate permission="view_department_data">
            <NavLink to="/faculty" className={navLinkClass}>Faculty</NavLink>
            <NavLink to="/subjects" className={navLinkClass}>Subjects</NavLink>
            <NavLink to="/classrooms" className={navLinkClass}>Classrooms</NavLink>
            <NavLink to="/batches" className={navLinkClass}>Batches</NavLink>
          </PermissionGate>
          
          <RoleGate allowedRoles={['admin']}>
            <NavLink to="/departments" className={navLinkClass}>Departments</NavLink>
            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
          </RoleGate>
        </nav>
        
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            className="rounded-xl h-10 w-10 hover:bg-accent/60"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <RoleGate allowedRoles={['admin']}>
            <Button variant="outline" asChild className="rounded-xl hover:scale-105 transition-transform">
              <Link to="/admin">
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Link>
            </Button>
          </RoleGate>

          {/* Publisher Mentor: Principle Ask */}
          {user && isPublisherMentor() && (
            <Button 
              variant="outline" 
              size="sm"
              className="hidden sm:flex border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-blue-700 hover:text-blue-800"
              onClick={() => window.open('/principle-chat-gpt.html', '_blank')}
            >
              <Crown className="h-4 w-4 mr-2" />
              Chat with Principal
            </Button>
          )}

          {/* Department Switcher - for non-admin users with multiple departments */}
          <DepartmentSwitcher />

          {/* Notification Bell */}
          <NotificationBell />

          {/* Talk to Principal Button - for publishers and mentors */}
          {(isPublisherMentor || isCreatorMentor || user?.role === 'mentor') && (
            <Button 
              variant="outline" 
              size="sm"
              className="hidden sm:flex"
              onClick={() => window.open('/principle-chat-gpt.html', '_blank')}
            >
              <Crown className="h-4 w-4 mr-2" />
              Principle Ask
            </Button>
          )}

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-xl hover:scale-105 transition-transform">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-semibold">
                      {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72 rounded-xl" align="end" forceMount>
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-blue-600 text-white font-semibold text-lg">
                          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-semibold leading-none">
                          {user.first_name} {user.last_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge className={`${getRoleColor(user.role, user.mentor_type)} rounded-lg px-3 py-1`}>
                        {(() => {
                          const Icon = getRoleIcon(user.role);
                          return <Icon className="h-3 w-3 mr-1" />;
                        })()}
                        {user.role}
                      </Badge>
                      {user.mentor_type && (
                        <Badge className="rounded-lg px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          {user.mentor_type === 'creator' ? 'Creator' : 'Publisher'}
                        </Badge>
                      )}
                    </div>
                    
                    {user.departments.length > 0 && (
                      <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-2">
                        <span className="font-medium">Departments: </span>
                        {user.departments.map(dept => dept.code).join(', ')}
                      </div>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-lg mx-2 my-1 hover:bg-accent/60">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                
                {/* Mobile Talk to Principal Option */}
                {(isPublisherMentor || isCreatorMentor || user?.role === 'mentor') && (
                  <div className="sm:hidden">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full mx-2 my-1 justify-start rounded-lg"
                      onClick={() => window.open('/principle-chat-gpt.html', '_blank')}
                    >
                      <Bot className="mr-2 h-4 w-4" />
                      Talk to Principal
                    </Button>
                  </div>
                )}

                {/* Mobile Principle Ask Option for Publishers */}
                {isPublisherMentor && (
                  <div className="sm:hidden">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full mx-2 my-1 justify-start rounded-lg border-blue-200 hover:bg-blue-50 text-blue-700"
                      onClick={() => window.open('/principle-chat-gpt.html', '_blank')}
                    >
                      <Crown className="mr-2 h-4 w-4" />
                      Chat with Principal
                    </Button>
                  </div>
                )}
                <DropdownMenuItem className="rounded-lg mx-2 my-1 hover:bg-accent/60">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-lg mx-2 my-1 hover:bg-red-50 text-red-600 hover:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
