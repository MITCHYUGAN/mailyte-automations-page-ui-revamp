import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Play,
  Pause,
  Trash2,
  Archive,
  ArrowRight,
  Sparkles,
  Zap,
  MoreVertical,
  Layers,
  Clock,
  ExternalLink,
  Edit3,
  GitBranch,
  ShieldCheck
} from 'lucide-react';
import { Automation, AutomationSort, AutomationState } from '../../types/automation';
import OrgSettingsModal from '../modals/OrgSettingsModal';
import AutomationFlowAnimation from './AutomationFlowAnimation';

interface AutomationsListProps {
  automations: Automation[];
  onDeleteAutomation: (id: string) => void;
  onArchiveAutomation: (id: string) => void;
  onTogglePauseAutomation: (id: string) => void;
}

const STATE_FILTERS: Array<{ value: AutomationState | 'active'; label: string }> = [
  { value: 'active', label: 'Active' },
  { value: 'draft', label: 'Drafts' },
  { value: 'live', label: 'Live' },
  { value: 'paused', label: 'Paused' },
  { value: 'archived', label: 'Archived' },
];

const SORTS: Array<{ value: AutomationSort; label: string }> = [
  { value: 'recent', label: 'Recently edited' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'busiest', label: 'Most contacts inside' },
];

export default function AutomationsList({
  automations,
  onDeleteAutomation,
  onArchiveAutomation,
  onTogglePauseAutomation,
}: AutomationsListProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<AutomationState | 'active'>('active');
  const [sort, setSort] = useState<AutomationSort>('recent');
  const [query, setQuery] = useState('');
  const [rulesOpen, setRulesOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter & sort logic
  const filtered = automations.filter((a) => {
    if (filter === 'active') {
      if (a.state === 'archived') return false;
    } else {
      if (a.state !== filter) return false;
    }
    if (query.trim()) {
      return a.name.toLowerCase().includes(query.toLowerCase());
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name);
    if (sort === 'busiest') return b.contactsCount - a.contactsCount;
    return 0; // recent by default
  });

  const activeCount = automations.filter((a) => a.state === 'live').length;

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Automations</h1>
          <p className="mt-1 text-xs md:text-sm text-gray-500 flex flex-wrap items-center gap-1.5">
            <span>Journeys that run for each contact when something happens.</span>
            <span>· 0 of 1 active journeys on your plan</span>
          </p>
        </div>

        {/* Dual Actions: Sending Rules & New Automation (or Scratch) */}
        <div className="flex items-center gap-2.5 shrink-0 flex-nowrap overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setRulesOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3.5 h-9 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            title="How we pace your sending, and the limits every send follows"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            Sending rules
          </button>

          <button
            type="button"
            onClick={() => navigate('/dashboard/automations/from-scratch')}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 h-9 text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            Start from scratch
          </button>

          <Link
            to="/dashboard/automations/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-4 h-9 text-xs font-semibold text-white hover:bg-indigo-700 shadow-xs transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            New automation
          </Link>
        </div>
      </div>

      {/* Sub-Filters and Search Toolbars */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-gray-200/80 pb-4">
        {/* State Tabs */}
        <div className="flex flex-wrap gap-1 rounded-lg bg-gray-100/90 p-1 sm:w-fit">
          {STATE_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                filter === f.value
                  ? 'bg-white text-gray-900 shadow-xs font-semibold'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-3.5 h-3.5" />
            <input
              type="text"
              className="w-full pl-8 pr-7 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-colors"
              placeholder="Search by name"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query !== '' && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <select
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-700 focus:outline-none focus:border-indigo-600 font-medium cursor-pointer"
            value={sort}
            onChange={(e) => setSort(e.target.value as AutomationSort)}
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Intro Feature Workspace Card matching Mailyte authentic layout */}
      {filter === 'active' && !query && (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-xl border border-gray-200/90 bg-white shadow-xs">
            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">Automations</p>
                <h2 className="mt-2 font-bold text-gray-900 text-2xl" style={{ textWrap: 'balance' }}>
                  Set it up once. It runs for every contact, on their own clock.
                </h2>
                <p className="mt-2 max-w-prose text-sm text-gray-600 leading-relaxed">
                  A campaign is one send to everyone. An automation is a journey each person walks alone: it starts when they do something, waits, decides, emails, and stops the moment they convert.
                </p>
                <ul className="mt-4 grid gap-2 text-sm text-gray-700 sm:grid-cols-3">
                  <li className="flex items-start gap-2">
                    <Clock size={15} className="mt-0.5 shrink-0 text-indigo-600" />
                    <span>Waits days or weeks, in each contact's timezone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <GitBranch size={15} className="mt-0.5 shrink-0 text-indigo-600" />
                    <span>Branches on what they did, stops on a goal</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0 text-indigo-600" />
                    <span>Never more than your caps, never in quiet hours</span>
                  </li>
                </ul>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    to="/dashboard/automations/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 h-10 text-sm font-semibold text-white transition hover:opacity-90 shadow-xs cursor-pointer"
                  >
                    Start with a recipe <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Mailyte Animated Journey Flow */}
              <AutomationFlowAnimation />
            </div>
          </section>

          {/* How It Works Steps Bar */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-3 font-medium">
              <span className="font-semibold text-gray-700">How it works</span>
              <span>A few minutes, then it runs on its own</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StepPillar
                number="1"
                title="Pick a ready-made journey, or start from a moment"
                desc="Eleven are ready to adapt. Or begin with the moment that should start it: joining a list, buying, going quiet."
              />
              <StepPillar
                number="2"
                title="Fill in the blanks"
                desc="A list, who it comes from, the email itself. The steps still waiting on you are marked in amber."
              />
              <StepPillar
                number="3"
                title="Dry-run it"
                desc="See who would enter today and what three real contacts would receive."
              />
              <StepPillar
                number="4"
                title="Publish"
                desc="Nothing sends until you set it live. Anyone who enters finishes the journey as it was when they entered, even if you change it later."
              />
            </div>
          </div>
        </div>
      )}

      {/* Automation Records Table / List - Only shown when filtering or searching, keeping the Active tab clean with the hero empty state */}
      {(filter !== 'active' || query.trim() !== '') && (
        <div className="bg-white border border-gray-200/90 rounded-xl overflow-hidden shadow-xs">
          <div className="px-6 py-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              {query ? `Search results for "${query}"` : `${filter} Automations`} ({sorted.length})
            </span>
            <span className="text-xs text-gray-400">Click any row to open the visual builder</span>
          </div>

        {sorted.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-xl text-gray-400">
              🔍
            </div>
            <h3 className="text-sm font-bold text-gray-900">
              {query ? `Nothing matches "${query}"` : `No ${filter} automations`}
            </h3>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {query
                ? 'Try searching by a different name, or clear the search query to see all automations.'
                : 'Create your first workflow using a pre-built recipe or build one from scratch.'}
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard/automations/new')}
                className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-xs cursor-pointer"
              >
                Browse Recipes
              </button>
            </div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {sorted.map((automation) => (
              <li
                key={automation.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-gray-50/80 transition-colors gap-3 cursor-pointer"
                onClick={() => navigate(`/dashboard/automations/${automation.id}`)}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    className={`p-2.5 rounded-lg border transition-colors shrink-0 ${
                      automation.state === 'live'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        : automation.state === 'paused'
                        ? 'bg-amber-50 border-amber-200 text-amber-600'
                        : 'bg-indigo-50 border-indigo-200 text-indigo-600'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
                        {automation.name}
                      </span>
                      <StateBadge state={automation.state} />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{automation.stepsCount} steps</span>
                      <span>·</span>
                      <span>{automation.contactsCount} contacts inside</span>
                      <span>·</span>
                      <span>Updated {automation.updatedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div
                  className="flex items-center gap-2 shrink-0 self-end sm:self-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/automations/${automation.id}`)}
                    className="px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:border-gray-300 rounded-lg shadow-2xs hover:bg-gray-50 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3 text-gray-500" />
                    Open Canvas
                  </button>

                  {automation.state === 'live' ? (
                    <button
                      type="button"
                      onClick={() => onTogglePauseAutomation(automation.id)}
                      className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                      title="Pause automation"
                    >
                      <Pause className="w-4 h-4" />
                    </button>
                  ) : automation.state === 'paused' ? (
                    <button
                      type="button"
                      onClick={() => onTogglePauseAutomation(automation.id)}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                      title="Resume automation"
                    >
                      <Play className="w-4 h-4" />
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => onArchiveAutomation(automation.id)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Archive"
                  >
                    <Archive className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteAutomation(automation.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    )}

      <OrgSettingsModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />
    </div>
  );
}

function StateBadge({ state }: { state: AutomationState }) {
  if (state === 'live') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        Live
      </span>
    );
  }
  if (state === 'paused') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
        Paused
      </span>
    );
  }
  if (state === 'archived') {
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
        Archived
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
      Draft
    </span>
  );
}

function StepPillar({ number, title, desc }: { number: string; title: string; desc: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[11px] flex items-center justify-center">
          {number}
        </span>
        <h4 className="font-bold text-xs text-gray-900 leading-snug">{title}</h4>
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed pl-7">{desc}</p>
    </div>
  );
}
