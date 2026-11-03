import React, { useState, useMemo } from 'react';
import { X, Search, Zap, Code2, Check } from 'lucide-react';
import { TRIGGER_CATALOG } from '../../data/mockData';
import { TriggerDefinition } from '../../types/automation';

interface ChangeTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTriggerId?: string;
  onSelectTrigger: (trigger: TriggerDefinition) => void;
}

export default function ChangeTriggerModal({
  isOpen,
  onClose,
  currentTriggerId,
  onSelectTrigger,
}: ChangeTriggerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return TRIGGER_CATALOG;
    const q = searchQuery.toLowerCase();
    return TRIGGER_CATALOG.filter(
      (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header matching Screenshot image_60def941.png */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            Start when…
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search input & Grid matching Screenshot image_60def941.png */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Search steps */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search steps"
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gray-300 bg-white text-sm shadow-2xs placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-gray-900"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              START WHEN...
            </span>
          </div>

          {/* 3-Column Trigger Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((trigger) => {
              const isSelected = currentTriggerId === trigger.id;

              return (
                <div
                  key={trigger.id}
                  onClick={() => {
                    onSelectTrigger(trigger);
                    onClose();
                  }}
                  className={`group relative flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/15 bg-indigo-50/15 shadow-xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-xs'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg border shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                        : 'bg-gray-50 border-gray-200 text-gray-500 group-hover:text-gray-700 group-hover:bg-gray-100/70'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current/10" />
                  </div>

                  <div className="space-y-1 min-w-0 pr-4">
                    <h3 className="font-semibold text-xs text-gray-900 leading-snug">
                      {trigger.title}
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {trigger.description}
                    </p>

                    {trigger.badge && (
                      <div className="pt-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                          <Code2 className="w-3 h-3 text-gray-400" />
                          {trigger.badge}
                        </span>
                      </div>
                    )}
                  </div>

                  {isSelected && (
                    <div className="absolute right-3 top-3 text-indigo-600">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length === 0 && (
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
      </div>
    </div>
  );
}
