"use client";

import { Agentation } from "agentation";

export function AgentationProvider() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  if (process.env.NEXT_PUBLIC_DISABLE_AGENTATION === "true") {
    return null;
  }

  return <Agentation />;
}
