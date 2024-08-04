"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import {  QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"


export function Providers({ children, ...props }) {
  const queryClient = new QueryClient();
  return(

    <QueryClientProvider client={queryClient}>
      <NextThemesProvider 
        attribute="class"
        defaultTheme="system"
        enableSystem
        {...props}>
          <SessionProvider>
            {children}
          </SessionProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  ) 
  }
