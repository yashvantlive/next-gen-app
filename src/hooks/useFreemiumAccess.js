"use client";

import { useEffect, useState } from "react";

export function useFreemiumAccess(resourceId, profile) {
  const [allowAccess, setAllowAccess] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⛔ No resource → block
    if (!resourceId) {
      setAllowAccess(false);
      setLoading(false);
      return;
    }

    // ✅ GUEST USER → always allow first view
    if (!profile) {
      setAllowAccess(true);
      setLoading(false);
      return;
    }

    // ✅ LOGGED-IN USER → always allow
    setAllowAccess(true);
    setLoading(false);
  }, [resourceId, profile]);

  return { allowAccess, loading };
}
