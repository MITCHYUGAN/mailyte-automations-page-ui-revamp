import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Zap,
  Search,
  Check,
  X,
  Code2
} from 'lucide-react';
import { TRIGGER_CATALOG } from '../../data/mockData';

interface CreateFromScratchProps {
  onCreateScratch: (name: string, triggerId: string) => void;
}

export default function CreateFromScratch({ onCreateScratch }: CreateFromScratchProps) {
  const navigate = useNavigate();
  const [automationName, setAutomationName] = useState('');
  const [selectedTrigger, setSelectedTrigger] = useState<string>('trigger.list_joined');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTriggers = useMemo(() => {
    if (!searchQuery.trim()) return TRIGGER_CATALOG;
    const q = searchQuery.toLowerCase();
    return TRIGGER_CATALOG.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleProceed = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!automationName.trim() || !selectedTrigger) return;
    onCreateScratch(automationName.trim(), selectedTrigger);
  };

  const selectedTriggerObj = TRIGGER_CATALOG.find((t) => t.id === selectedTrigger);

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8 font-sans antialiased text-gray-800">
      {/* Top Breadcrumb */}
      <div>
        <Link
          to="/dashboard/automations"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Automations
        </Link>
      </div>

      {/* Main Header Flexed with Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/80 pb-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Create an automation from scratch
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Define your base workflow parameters to begin constructing your visual execution sequence map.
          </p>
        </div>

        {/* Action Buttons flexed at the top */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/dashboard/automations"
            className="inline-flex items-center justify-center px-4 h-9 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-all cursor-pointer shadow-xs"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => handleProceed()}
            disabled={!automationName.trim() || !selectedTrigger}
            className={`inline-flex items-center justify-center gap-1.5 px-5 h-9 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer select-none ${
              automationName.trim() && selectedTrigger
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
                : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Open in Workflow Canvas
          </button>
        </div>
      </div>

      <form onSubmit={handleProceed} className="space-y-8">
        {/* Section 1: Workflow Name */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <label htmlFor="scratch-name" className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
              What would you like to name this automation? <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-gray-400 font-mono">
              {automationName.length}/64
            </span>
          </div>
          <input
            id="scratch-name"
            type="text"
            maxLength={64}
            value={automationName}
            onChange={(e) => setAutomationName(e.target.value)}
            placeholder="e.g., Welcome series, Re-engagement, Order follow-up"
            className="w-full px-4 py-2.5 rounded-xl border border-gray-300 bg-white text-sm shadow-2xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-normal text-gray-900"
            autoFocus
          />
        </div>

        {/* Section 2: Start when... (Mailyte Trigger Catalog) */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Start when…</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Choose what starts it; every step after that is yours.
            </p>
          </div>

          {/* Search Steps Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search steps"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-300 bg-white text-sm shadow-2xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer rounded-full"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Subheader */}
          <div className="pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              START WHEN... {filteredTriggers.length < TRIGGER_CATALOG.length && `(${filteredTriggers.length} found)`}
            </span>
          </div>

          {/* 3-Column Trigger Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredTriggers.map((trigger) => {
              const isSelected = selectedTrigger === trigger.id;

              return (
                <div
                  key={trigger.id}
                  onClick={() => setSelectedTrigger(trigger.id)}
                  className={`group relative flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/15 bg-indigo-50/15 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg border shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        : 'bg-gray-50 border-gray-200 text-gray-500 group-hover:text-gray-700 group-hover:bg-gray-100/70'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current/10" />
                  </div>

                  {/* Content */}
                  <div className="space-y-1 min-w-0 pr-5">
                    <h3 className="font-semibold text-xs md:text-sm text-gray-900 leading-snug">
                      {trigger.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {trigger.description}
                    </p>

                    {/* Developer Badge */}
                    {trigger.badge && (
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <Code2 className="w-3 h-3 text-gray-400" />
                          {trigger.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Radio Indicator */}
                  <div className="absolute right-3.5 top-4 flex items-center justify-center">
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-gray-300 group-hover:border-gray-400 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTriggers.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-xs text-gray-500">No triggers match "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
