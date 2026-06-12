import React from "react";
import Toolbar from "./Toolbar";
import LeftPanel from "./LeftPanel";
import RightInspector from "./RightInspector";
import PlannerCanvas from "../planner/PlannerCanvas";

export default function AppShell() {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Toolbar />
      <div className="flex flex-1 min-h-0">
        <LeftPanel />
        <div className="flex-1 relative bg-slate-100 h-full min-w-0">
          <PlannerCanvas />
        </div>
        <RightInspector />
      </div>
    </div>
  );
}
