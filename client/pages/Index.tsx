import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/PageHeader";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useDepartment } from "@/contexts/DepartmentContext";
import DepartmentDashboard, { DepartmentIsolationDemo } from "@/components/dashboard/DepartmentDashboard";
import { 
  Sparkles, 
  Clock, 
  Users, 
  TrendingUp, 
  Zap,
  Bot,
  Shield,
  CheckCircle,
  ArrowRight,
  PlusCircle,
  Building2,
  Crown,
  Activity,
  BarChart3
} from "lucide-react";
import WorkflowStatus from "@/components/workflow/WorkflowStatus";

export default function Index() {
  const { user, isCreatorMentor, isPublisherMentor } = useAuth();
  const { activeDepartment, userDepartments } = useDepartment();

  // If user has department context, show department dashboard
  if (activeDepartment && (user?.role as any) !== 'admin') {
    return (
      <div className="space-y-6">
        <DepartmentDashboard />
        {(user?.role as any) === 'admin' && <DepartmentIsolationDemo />}
      </div>
    );
  }

  // Admin dashboard or fallback for users without departments

  // Mock data for demonstration
  const stats = [
    { icon: Shield, label: 'Active Departments', value: '8', color: 'text-blue-600' },
    { icon: CheckCircle, label: 'Classrooms Available', value: '45', color: 'text-green-600' },
    { icon: Bot, label: 'Faculty Members', value: '128', color: 'text-purple-600' },
    { icon: Crown, label: 'Total Students', value: '1,250', color: 'text-orange-600' }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-primary/5 via-blue-50/50 to-indigo-50/50 dark:from-primary/10 dark:via-blue-950/20 dark:to-indigo-950/20 p-8 md:p-12">
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <Badge className="gradient-primary text-white px-4 py-1 rounded-full">
              AI-Powered
            </Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Py-Gram 2k25
          </h1>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">
            Revolutionary AI-powered timetable generation with ChatGPT-style interface. 
            Create, review, and publish optimized schedules through intelligent workflows.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            {user && isPublisherMentor() && (
              <Button 
                size="lg" 
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:scale-105 transition-transform"
                onClick={() => window.open('/principle-chat-gpt.html', '_blank')}
              >
                <Crown className="h-4 w-4 mr-2" />
                Chat with Principal
              </Button>
            )}
            
            <Button asChild size="lg" variant="outline" className="rounded-2xl border-2 hover:scale-105 transition-transform">
              <Link to="/departments">
                <Shield className="h-5 w-5 mr-2" />
                Manage Departments
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary/20 to-blue-500/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-48 w-48 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />
      </section>

      {user && (
        <>
          {/* Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="modern-card text-center">
                <CardContent className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Quick Actions */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="modern-card group cursor-pointer">
                <Link to="/departments">
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Shield className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Manage Departments</h3>
                    <p className="text-sm text-muted-foreground">View and manage all departmental information, classrooms, and faculty</p>
                    <ArrowRight className="h-4 w-4 mt-4 mx-auto text-primary group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Link>
              </Card>

              {isPublisherMentor() && (
                <Card className="modern-card group cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Crown className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Principle Ask</h3>
                    <p className="text-sm text-muted-foreground mb-4">Direct communication channel to the Principal via Telegram</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full border-blue-200 hover:bg-blue-50 text-blue-700 hover:text-blue-800"
                      onClick={() => window.open('/principle-chat-gpt.html', '_blank')}
                    >
                      <Crown className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="modern-card group cursor-pointer">
                <Link to="/admin">
                  <CardContent className="p-6 text-center">
                    <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Bot className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Admin Panel</h3>
                    <p className="text-sm text-muted-foreground">Access administrative features and system settings</p>
                    <ArrowRight className="h-4 w-4 mt-4 mx-auto text-purple-600 group-hover:translate-x-1 transition-transform" />
                  </CardContent>
                </Link>
              </Card>
            </div>
          </section>



          {/* Workflow Status Example */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-primary" />
              Live Workflow Status
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WorkflowStatus
                stage="published"
                status="published"
                creatorName="Dr. Smith"
                publisherName="Prof. Johnson"
                lastUpdated="2024-01-15T10:30:00Z"
                qualityScore={0.94}
                isLive={true}
              />
              <WorkflowStatus
                stage="review"
                status="pending_review"
                creatorName="Dr. Wilson"
                publisherName="Prof. Johnson"
                lastUpdated="2024-01-14T15:45:00Z"
                qualityScore={0.89}
                isLive={true}
              />
            </div>
          </section>
        </>
      )}

      {/* Features Section */}
      <section id="features" className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-12">Powered by Advanced Technology</h2>
        <div className="grid gap-8 md:grid-cols-3">
          <FeatureCard 
            title="Department Management" 
            subtitle="Comprehensive Organization"
            icon={Shield}
            color="from-blue-500 to-indigo-600"
          >
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Complete departmental overview</li>
              <li>Classroom and faculty management</li>
              <li>Subject allocation tracking</li>
            </ul>
          </FeatureCard>
          
          <FeatureCard 
            title="Smart Communication" 
            subtitle="Direct Principal Access"
            icon={Crown}
            color="from-green-500 to-emerald-600"
          >
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Telegram-based messaging system</li>
              <li>Real-time notifications</li>
              <li>Secure communication channels</li>
            </ul>
          </FeatureCard>
          
          <FeatureCard 
            title="Role-Based Access" 
            subtitle="Secure & Organized"
            icon={Bot}
            color="from-purple-500 to-pink-600"
          >
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Multi-level user permissions</li>
              <li>Department-specific access</li>
              <li>Secure authentication system</li>
            </ul>
          </FeatureCard>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ 
  title, 
  subtitle, 
  children, 
  icon: Icon,
  color
}: { 
  title: string; 
  subtitle?: string; 
  children: React.ReactNode;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  return (
    <Card className="modern-card text-center">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center`}>
            <Icon className="h-8 w-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
