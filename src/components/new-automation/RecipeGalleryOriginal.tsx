import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Zap,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Recipe } from '../../types/automation';
import { RECIPES } from '../../data/mockData';

interface RecipeGalleryOriginalProps {
  onUseRecipe: (recipe: Recipe, name?: string) => void;
  onCreateScratch: (name: string, triggerId: string) => void;
}

export default function RecipeGalleryOriginal({
  onUseRecipe,
  onCreateScratch,
}: RecipeGalleryOriginalProps) {
  const navigate = useNavigate();
  const [selectedCardId, setSelectedCardId] = useState<string>('scratch');
  const [scratchName, setScratchName] = useState('Welcome new subscribers');
  const [scratchTrigger, setScratchTrigger] = useState('Joined a list');
  const [recipeCustomName, setRecipeCustomName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Welcome',
    'Recover a sale',
    'After a purchase',
    'Win back',
    'Dates and milestones',
    'Nurture',
  ];

  const filteredRecipes = RECIPES.filter((r) => {
    if (activeCategory !== 'All' && r.category !== activeCategory) return false;
    if (searchQuery) {
      return (
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return true;
  });

  const selectedRecipe = RECIPES.find((r) => r.id === selectedCardId);

  const handleCreate = () => {
    if (selectedCardId === 'scratch') {
      onCreateScratch(scratchName || 'Untitled Journey', 'trigger.list_joined');
    } else if (selectedRecipe) {
      onUseRecipe(selectedRecipe, recipeCustomName || selectedRecipe.name);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Warning Comparison */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Original Mailyte Layout:</strong> Notice how the 3-column recipe grid and the sticky side panel compete for horizontal space, creating a cramped experience on standard laptop screens.
          </span>
        </div>
      </div>

      {/* Header */}
      <div>
        <Link
          to="/dashboard/automations"
          className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All automations
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">New automation</h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Start from a recipe and fill in the blanks, or pick a trigger and build the steps yourself.
        </p>
      </div>

      {/* 2-Column Cramped Layout from Mailyte Screenshots 9 & 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 11+ Recipe Cards squeezed into 8 cols */}
        <div className="lg:col-span-8 space-y-4">
          {/* Search & Categories Bar */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:items-center">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search recipes"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs bg-white text-gray-800 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div className="flex items-center gap-1 overflow-x-auto text-[11px] py-0.5">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveCategory(c)}
                  className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                    activeCategory === c
                      ? 'bg-gray-900 text-white font-medium'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {/* Scratch Card */}
            {activeCategory === 'All' && !searchQuery && (
              <div
                onClick={() => setSelectedCardId('scratch')}
                className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                  selectedCardId === 'scratch'
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> FROM SCRATCH
                </div>
                <h4 className="font-bold text-xs text-gray-900 mt-1 leading-snug">
                  Build the journey yourself, step by step
                </h4>
                <p className="text-[11px] text-gray-500 mt-1">
                  An empty canvas — you choose what starts it
                </p>
              </div>
            )}

            {/* Recipe Cards */}
            {filteredRecipes.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedCardId(r.id);
                  setRecipeCustomName(r.name);
                }}
                className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  selectedCardId === r.id
                    ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/10'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wide text-gray-400">
                    <span>{r.category}</span>
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 mt-1 leading-snug line-clamp-2">
                    {r.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">
                    {r.description}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-gray-400 font-mono">
                  {r.durationText}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sticky Column: Squeezed into 4 cols */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-xl p-5 shadow-xs sticky top-20 space-y-4 text-xs">
          {selectedCardId === 'scratch' ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  FROM SCRATCH
                </span>
                <h3 className="font-bold text-sm text-gray-900 mt-0.5">
                  Choose what starts it; every step after that is yours
                </h3>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Start when...</label>
                <select
                  value={scratchTrigger}
                  onChange={(e) => setScratchTrigger(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-800"
                >
                  <option value="Joined a list">Joined a list</option>
                  <option value="Cart abandoned">Cart abandoned</option>
                  <option value="Birthday milestone">On a specific date or anniversary</option>
                  <option value="API Webhook">Custom API event</option>
                </select>
                <p className="text-[11px] text-gray-400 mt-1">
                  Someone is added to a list: from a sign-up form, an import, or by you.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={scratchName}
                  onChange={(e) => setScratchName(e.target.value)}
                  placeholder="e.g. Welcome new subscribers"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-800"
                />
              </div>

              <button
                type="button"
                onClick={handleCreate}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                Create draft
              </button>
              <p className="text-[10px] text-gray-400 text-center">
                Nothing runs until you set it live. A draft can be edited and deleted freely.
              </p>
            </div>
          ) : selectedRecipe ? (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                  {selectedRecipe.category}
                </span>
                <h3 className="font-bold text-sm text-gray-900 mt-0.5 leading-snug">
                  {selectedRecipe.name}
                </h3>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  THE STEPS
                </span>
                <div className="space-y-2 border-l-2 border-gray-200 pl-3">
                  {selectedRecipe.steps.map((st, i) => (
                    <div key={st.id} className="text-xs">
                      <div className="font-semibold text-gray-800">
                        {i + 1}. {st.title}
                      </div>
                      <div className="text-[11px] text-gray-400 truncate">
                        {st.subtitle || st.config.subject || 'Configured step'}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200">
                  Steps need something from you before it can go live. Each contact enters once only.
                </p>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={recipeCustomName}
                  onChange={(e) => setRecipeCustomName(e.target.value)}
                  placeholder={selectedRecipe.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs text-gray-800"
                />
              </div>

              <button
                type="button"
                onClick={handleCreate}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors"
              >
                Use this recipe
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
