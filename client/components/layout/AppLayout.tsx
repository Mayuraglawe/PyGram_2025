import Header from "./Header";
import Footer from "./Footer";
import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto py-8">{children}</main>
      <Footer />
    </div>
  );
}
