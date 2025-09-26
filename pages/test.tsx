import { Button } from "@/components/ui/button";

export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-6">
          🎉 Next.js Migration Successful!
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Your Express + Vite app has been successfully migrated to Next.js
        </p>
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
          Get Started
        </Button>
      </div>
    </div>
  );
}