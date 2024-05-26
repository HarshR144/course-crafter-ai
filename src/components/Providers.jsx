"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import {  QueryClient, QueryClientProvider } from "@tanstack/react-query"
export function Providers({ children, ...props }) {
  const queryClient = new QueryClient();
  return(

    <QueryClientProvider client={queryClient}>
      <NextThemesProvider {...props}>{children}</NextThemesProvider>
    </QueryClientProvider>
  ) 
  }
