import React from "react";
import Toolbar from "./Toolbar";
import LeftPanel from "./LeftPanel";
import RightInspector from "./RightInspector";
import PlannerCanvas from "../planner/PlannerCanvas";
import ArSyncWatcher from "../ar/ArSyncWatcher";
import HistoryShortcuts from "../planner/HistoryShortcuts";

export default function AppShell() {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-surface text-ink overflow-hidden font-sans">
      <ArSyncWatcher />
      <HistoryShortcuts />
      <Toolbar />
      <div className="flex flex-1 min-h-0">
        <LeftPanel />
        <div className="flex-1 relative bg-canvas h-full min-w-0">
          <PlannerCanvas />
        </div>
        <RightInspector />
      </div>
    </div>
  );
}
