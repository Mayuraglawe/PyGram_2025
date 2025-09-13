import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <AppLayout>
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 p-8 md:p-12">
        <div className="max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Py-Gram 2025</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Modular Monolith with Django + DRF, Celery + Redis, PostgreSQL, and a React SPA powered by Redux Toolkit & RTK Query. A hybrid CSP + Genetic Algorithm schedules timetables efficiently.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/generate">Generate Timetable</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/timetables">View Timetables</Link>
            </Button>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
      </section>

      <section id="architecture" className="mt-12 grid gap-6 md:grid-cols-3">
        <Card title="Monolith-First Architecture" subtitle="Modular Django apps">
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>React SPA for UX and visualization</li>
            <li>DRF REST API for data and orchestration</li>
            <li>Celery workers with Redis broker for async scheduling</li>
          </ul>
        </Card>
        <Card title="Hybrid CSP + GA" subtitle="Optimal timetables">
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Phase 1: OR-Tools CP-SAT for constraint feasibility</li>
            <li>Phase 2: Genetic Algorithm for soft-constraint optimization</li>
            <li>Continuous validity checks after mutations & crossovers</li>
          </ul>
        </Card>
        <Card title="PostgreSQL 16" subtitle="Normalized ERD">
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>User, Faculty, Classroom, Subject</li>
            <li>StudentBatch, FacultySubjectAssignment</li>
            <li>TimeSlot, Timetable, ScheduledClass</li>
          </ul>
        </Card>
      </section>

      <section id="stack" className="mt-12 grid gap-6 md:grid-cols-2">
        <Card title="Frontend (React 18 + Vite)" subtitle="Redux Toolkit + RTK Query">
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Feature-based structure: timetable, faculty, etc.</li>
            <li>JWT auth via Authorization header</li>
            <li>Reusable components: TimetableGrid, ConflictHighlighter</li>
          </ul>
        </Card>
        <Card title="Backend (Django + DRF)" subtitle="Celery + Redis, Docker">
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            <li>Task queue for long-running scheduling</li>
            <li>Polling endpoints for generation status</li>
            <li>Deploy to AWS with RDS and ElastiCache</li>
          </ul>
        </Card>
      </section>

      <section id="schema" className="mt-12">
        <div className="rounded-xl border p-6">
          <h2 className="text-2xl font-bold">Entity Overview</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              "User",
              "Faculty",
              "Classroom",
              "Subject",
              "StudentBatch",
              "FacultySubjectAssignment",
              "TimeSlot",
              "Timetable",
              "ScheduledClass",
            ].map((name) => (
              <div key={name} className="rounded-lg border p-4 bg-card">
                <div className="font-semibold">{name}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Part of the normalized relational schema powering Py-Gram 2025.
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  );
}

function Card({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-6 bg-card">
      <h3 className="text-xl font-bold">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}
