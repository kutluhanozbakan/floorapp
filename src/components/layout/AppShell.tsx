import React from "react";
import Toolbar from "./Toolbar";
import LeftPanel from "./LeftPanel";
import RightInspector from "./RightInspector";
import PlannerCanvas from "../planner/PlannerCanvas";

export default function AppShell() {
  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-900 overflow-hidden font-sans">
      <Toolbar />
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        <LeftPanel />
        <div className="flex-1 relative bg-slate-100 h-full">
          <PlannerCanvas />
        </div>
        <RightInspector />
      </div>
    </div>
  );
}
