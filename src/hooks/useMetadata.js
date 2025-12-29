"use client";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebaseClient";

export function useMetadata(authUser) {
  const [metadata, setMetadata] = useState({ universities: {}, branches: {} });

  useEffect(() => {
    if (!authUser) return;

    async function fetchMetadata() {
      try {
        const uniSnap = await getDoc(doc(db, "metadata", "universities"));
        const branchSnap = await getDoc(doc(db, "metadata", "branches"));
        setMetadata({
          universities: uniSnap.exists() ? uniSnap.data() : {},
          branches: branchSnap.exists() ? branchSnap.data() : {},
        });
      } catch (err) {
        console.error(err);
      }
    }
    fetchMetadata();
  }, [authUser]);

  const getUniName = (id) => metadata.universities[id]?.name || id || "Not set";
  const getBranchName = (id) => metadata.branches[id] || id || "Not set";

  return { metadata, getUniName, getBranchName };
}