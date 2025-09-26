import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "../client/store/store";
import { AuthProvider } from "../client/contexts/AuthContext";
import { DepartmentProvider } from "../client/contexts/DepartmentContext";
import { NotificationProvider } from "../client/contexts/NotificationContext";
import AppLayout from "../client/components/layout/AppLayout";
import { NextDepartmentRouter } from "../client/components/routing/NextDepartmentRouter";
import "../client/global.css";
import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const router = useRouter();

  // Routes that should not use AppLayout
  const noLayoutRoutes = ['/', '/signin', '/register', '/role-selection'];
  const useLayout = !noLayoutRoutes.includes(router.pathname);
  
  console.log('🎯 App Layout Check:', {
    pathname: router.pathname,
    noLayoutRoutes,
    useLayout,
    timestamp: new Date().toISOString()
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DepartmentProvider>
            <NotificationProvider>
              <TooltipProvider>
                <NextDepartmentRouter>
                  {useLayout ? (
                    <AppLayout>
                      <Component {...pageProps} />
                    </AppLayout>
                  ) : (
                    <Component {...pageProps} />
                  )}
                </NextDepartmentRouter>
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </NotificationProvider>
          </DepartmentProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Provider>
  );
}