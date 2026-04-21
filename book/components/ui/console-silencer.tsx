"use client";

import { useEffect } from "react";

export const ConsoleSilencer = () => {
  useEffect(() => {
    const silentStrings = ["Clerk: Clerk has been loaded with development keys"];
    const methods = ["log", "warn", "info"] as const;
    
    methods.forEach(method => {
      const original = console[method];
      console[method] = function(...args: any[]) {
        if (args[0] && typeof args[0] === "string" && silentStrings.some(s => args[0].includes(s))) return;
        original.apply(console, args);
      };
    });
  }, []);

  return null;
};
