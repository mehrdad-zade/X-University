"use client";

import React from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Add any context providers here (e.g., Auth0, Theme, etc.)
  return <>{children}</>;
}
