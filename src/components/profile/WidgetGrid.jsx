"use client";
import React from "react";
import { WIDGETS_CONFIG } from "../../lib/widgetsConfig";

import TrajectoryLock from "../../widgets/TrajectoryLock";
import RunwayTracker from "../../widgets/RunwayTracker";
import NetworkHealth from "../../widgets/NetworkHealth";
import MentalBandwidth from "../../widgets/MentalBandwidth";
import EmployabilityIndex from "../../widgets/EmployabilityIndex";
import BodyStressTest from "../../widgets/BodyStressTest";
import CommitmentStack from "../../widgets/CommitmentStack";
import KnowledgeDecay from "../../widgets/KnowledgeDecay";
import MoodSeismograph from "../../widgets/MoodSeismograph";
import LegacyBuilder from "../../widgets/LegacyBuilder";

const COMPONENT_MAP = {
  TrajectoryLock, RunwayTracker, NetworkHealth, MentalBandwidth,
  EmployabilityIndex, BodyStressTest, CommitmentStack, KnowledgeDecay, MoodSeismograph, LegacyBuilder
};

export default function WidgetGrid({ selectedWidgetIds, userWidgets, setEditConfig }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {selectedWidgetIds.map(id => {
         const def = WIDGETS_CONFIG.find(w => w.id === id);
         if (!def) return null;
         const Component = COMPONENT_MAP[def.componentName];
         const data = userWidgets[id] || def.defaultData;
         if (!Component) return null;
         
         return (
            <div key={id} className="animate-in fade-in-up duration-500 h-full">
               <Component 
                 data={data} 
                 onEdit={() => setEditConfig({ widgetId: id, data, schema: def.schema })} 
               />
            </div>
         );
      })}
   </div>
  );
}