import React from 'react';
import { Zap, Clock, Mail, GitBranch, Target, User } from 'lucide-react';

export default function AutomationFlowAnimation() {
  return (
    <div className="rounded-lg bg-gray-50/70 dark:bg-gray-800/40 border border-gray-200/60 dark:border-gray-700/50 px-5 py-6 sm:px-8 w-full shadow-2xs">
      <div
        className="automation-flow relative"
        aria-hidden="true"
        style={{
          ['--flow-duration' as string]: '9s',
          ['--flow-offset' as string]: '0s',
        }}
      >
        {/* Track Line connecting the nodes */}
        <div className="absolute left-0 right-0 bg-gray-200/80 dark:bg-gray-700/60 top-5 h-0.5" />

        {/* The Travelling Contact Avatar - Layered behind the nodes (z-0) and center-aligned at top-5 */}
        <div className="automation-traveller absolute -translate-x-1/2 rounded-full bg-indigo-600 text-white top-5 flex h-5 w-5 -translate-y-1/2 items-center justify-center shadow-md z-0 pointer-events-none">
          <User className="w-2.5 h-2.5 stroke-[2.5]" />
        </div>

        {/* 7 Flow Nodes - Layered in front of the traveler (z-10) with opaque backgrounds */}
        <ol className="relative flex items-start justify-between z-10">
          {/* Node 1: Zap (Starts a checkout) */}
          <li
            className="flex flex-col items-center"
            style={{ ['--node-at' as string]: '0s' }}
          >
            <span className="automation-node flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 h-10 w-10 rounded-lg border border-transparent shadow-2xs">
              <Zap className="w-4.5 h-4.5 stroke-[2]" />
            </span>
          </li>

          {/* Node 2: Clock (Delay) */}
          <li
            className="flex flex-col items-center"
            style={{ ['--node-at' as string]: '1.44s' }}
          >
            <span className="automation-node flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 h-10 w-10 rounded-lg border border-transparent shadow-2xs">
              <Clock className="w-4.5 h-4.5 stroke-[2]" />
            </span>
          </li>

          {/* Node 3: Mail (Send Email) */}
          <li
            className="flex flex-col items-center"
            style={{ ['--node-at' as string]: '2.88s' }}
          >
            <span
              data-email="true"
              className="automation-node flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 h-10 w-10 rounded-lg border border-transparent shadow-2xs"
            >
              <Mail className="w-4.5 h-4.5 stroke-[2]" />
            </span>
          </li>

          {/* Node 4: Clock (Reminded Delay) */}
          <li
            className="flex flex-col items-center"
            style={{ ['--node-at' as string]: '4.32s' }}
          >
            <span className="automation-node flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 h-10 w-10 rounded-lg border border-transparent shadow-2xs">
              <Clock className="w-4.5 h-4.5 stroke-[2]" />
            </span>
          </li>

          {/* Node 5: GitBranch (Decide / Split) */}
          <li
            className="flex flex-col items-center"
            style={{ ['--node-at' as string]: '5.76s' }}
          >
            <span className="automation-node flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 h-10 w-10 rounded-lg border border-transparent shadow-2xs">
              <GitBranch className="w-4.5 h-4.5 stroke-[2]" />
            </span>
          </li>

          {/* Node 6: Mail (Follow-up Email) */}
          <li
            className="flex flex-col items-center"
            style={{ ['--node-at' as string]: '7.2s' }}
          >
            <span
              data-email="true"
              className="automation-node flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 h-10 w-10 rounded-lg border border-transparent shadow-2xs"
            >
              <Mail className="w-4.5 h-4.5 stroke-[2]" />
            </span>
          </li>

          {/* Node 7: Target (Converted) */}
          <li
            className="flex flex-col items-center"
            style={{ ['--node-at' as string]: '8.64s' }}
          >
            <span className="automation-node flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 h-10 w-10 rounded-lg border border-transparent shadow-2xs">
              <Target className="w-4.5 h-4.5 stroke-[2]" />
            </span>
          </li>
        </ol>
      </div>

      {/* Subtitle Milestones */}
      <div className="mt-3 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 select-none">
        <span>Starts a checkout</span>
        <span>Reminded</span>
        <span>Converted</span>
      </div>
    </div>
  );
}
