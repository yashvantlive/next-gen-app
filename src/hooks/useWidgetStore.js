"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../lib/firebaseClient";
import { WIDGETS_CONFIG } from "../lib/widgetsConfig";

export function useWidgetStore(authUser) {
  const [userWidgets, setUserWidgets] = useState({});
  const [selectedWidgetIds, setSelectedWidgetIds] = useState(["trajectory_lock", "runway_tracker", "network_health", "mental_bandwidth"]);
  const [editConfig, setEditConfig] = useState(null);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  useEffect(() => {
    if (!authUser) return;

    let widgetUnsub = null;
    const widgetRef = doc(db, "user_widgets", authUser.uid);
    
    widgetUnsub = onSnapshot(widgetRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.selectedIds && data.selectedIds.length > 0) setSelectedWidgetIds(data.selectedIds);
        setUserWidgets(data.widgetData || {});
      }
    }, (error) => {
      console.log("Widget sync paused:", error.code);
    });

    return () => {
      if (widgetUnsub) widgetUnsub();
    };
  }, [authUser]);

  const handleSaveWidget = async (e) => {
    e.preventDefault();
    if (!authUser || !editConfig) return;

    const formData = new FormData(e.target);
    let newData = { ...editConfig.data };

    if (editConfig.widgetId === 'network_health') {
        newData.relationships = {
            family: {
                current: Number(formData.get("family.current")),
                goal: Number(formData.get("family.goal"))
            },
            mentor: {
                current: Number(formData.get("mentor.current")),
                goal: Number(formData.get("mentor.goal"))
            },
            friends: {
                current: Number(formData.get("friends.current")),
                goal: Number(formData.get("friends.goal"))
            }
        };
    } 
    else if (editConfig.schema) {
      editConfig.schema.forEach(field => {
        const val = formData.get(field.key);
        if (field.type === 'number' || field.type === 'slider') {
          newData[field.key] = Number(val);
        } else {
          newData[field.key] = val;
        }
      });
    }
    newData.notes = formData.get("notes");

    try {
      const widgetRef = doc(db, "user_widgets", authUser.uid);
      const updatedWidgets = { ...userWidgets, [editConfig.widgetId]: newData };
      
      await setDoc(widgetRef, { 
        selectedIds: selectedWidgetIds, 
        widgetData: updatedWidgets 
      }, { merge: true });
      
      setEditConfig(null); 
    } catch(err) {
      console.error("Save failed", err);
      alert("Failed to save changes.");
    }
  };

  const toggleWidgetSelection = async (widgetId) => {
    if (!authUser) return;
    const newIds = selectedWidgetIds.includes(widgetId)
      ? selectedWidgetIds.filter(id => id !== widgetId)
      : [...selectedWidgetIds, widgetId];
    
    let newWidgetData = { ...userWidgets };
    if (!userWidgets[widgetId]) {
       const def = WIDGETS_CONFIG.find(w => w.id === widgetId);
       newWidgetData[widgetId] = def.defaultData;
    }

    setSelectedWidgetIds(newIds);
    await setDoc(doc(db, "user_widgets", authUser.uid), { 
       selectedIds: newIds, widgetData: newWidgetData
    }, { merge: true });
  };

  return { 
    userWidgets, 
    selectedWidgetIds, 
    editConfig, 
    setEditConfig, 
    isStoreOpen, 
    setIsStoreOpen, 
    handleSaveWidget, 
    toggleWidgetSelection 
  };
}