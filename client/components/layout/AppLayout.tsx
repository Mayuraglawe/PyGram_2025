import Header from "./Header";
import Footer from "./Footer";
import FloatingTalkButton from "@/components/communication/FloatingTalkButton";
import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col gradient-bg">
      <Header />
<<<<<<< Updated upstream
      <main className="flex-1 container mx-auto py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {children}
=======
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
>>>>>>> Stashed changes
        </div>
      </main>
      <Footer />
      <FloatingTalkButton />
    </div>
  );
}
