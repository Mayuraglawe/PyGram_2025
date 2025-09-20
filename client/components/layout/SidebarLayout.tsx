import Sidebar from "./Sidebar";
import FloatingTalkButton from "@/components/communication/FloatingTalkButton";
import { PropsWithChildren } from "react";

export default function SidebarLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen">
          <div className="h-full">
            <div className="container mx-auto py-8 px-6 lg:px-8 max-w-7xl">
              {children}
            </div>
          </div>
        </main>
      </div>
      <FloatingTalkButton />
    </div>
  );
}