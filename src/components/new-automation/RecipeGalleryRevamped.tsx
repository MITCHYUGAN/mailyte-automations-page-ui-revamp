import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Sparkles,
  Clock,
  ArrowRight,
  Mail,
  Zap,
  ShoppingBag,
  UserCheck,
  Calendar,
  Gift,
  HelpCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Recipe } from '../../types/automation';
import { RECIPES } from '../../data/mockData';

interface RecipeGalleryRevampedProps {
  onSelectRecipe: (recipe: Recipe) => void;
}

const CATEGORIES = [
  'All',
  'Welcome',
  'Recover a sale',
  'After a purchase',
  'Win back',
  'Dates and milestones',
  'Nurture',
] as const;

export default function RecipeGalleryRevamped({ onSelectRecipe }: RecipeGalleryRevampedProps) {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter recipes
  const filteredRecipes = RECIPES.filter((r) => {
    if (selectedCategory !== 'All' && r.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.tagline.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const recommendedRecipes = RECIPES.filter(
    (r) => r.id === 'recipe-welcome' || r.id === 'recipe-abandoned-cart' || r.id === 'recipe-birthday-milestone'
  );

  return (
    <div className="p-6 md:p-8 w-full max-w-7xl mx-auto space-y-8">
      {/* Top Header with Breadcrumbs & Scratch Action */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5">
        <div>
          <Link
            to="/dashboard/automations"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 font-medium transition-colors mb-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All automations
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">New automation</h1>
          <p className="mt-1 text-xs md:text-sm text-gray-500">
            Start from a battle-tested recipe and customize the copy, or build your own journey step by step.
          </p>
        </div>

        {/* Primary Scratch Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard/automations/from-scratch')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-200 bg-white hover:bg-indigo-50/50 px-4 py-2.5 text-xs font-bold text-indigo-700 shadow-xs transition-all hover:border-indigo-300"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            Build from scratch
          </button>
        </div>
      </div>

      {/* Recommended Spotlight Row (Inspired by Mailchimp Screenshot 1 & 2) */}
      {!searchQuery && selectedCategory === 'All' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-gray-900 tracking-tight">Recommended flows for your store</h2>
              <p className="text-xs text-gray-500">
                These customer journeys generate the highest open and conversion rates.
              </p>
            </div>
            <span className="text-[11px] font-semibold text-indigo-600">Top 3 templates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedRecipes.map((recipe) => (
              <div
                key={`rec-${recipe.id}`}
                onClick={() => {
                  onSelectRecipe(recipe);
                  navigate(`/dashboard/automations/templates/${recipe.id}`);
                }}
                className="group relative bg-white border border-indigo-100 hover:border-indigo-300 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md">
                      {recipe.category}
                    </span>
                    {recipe.badge && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        {recipe.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {recipe.name}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {recipe.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{recipe.durationText}</span>
                    <span>·</span>
                    <span>{recipe.steps.length} steps</span>
                  </div>
                  <span className="font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Preview <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Category Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          {/* Search Field */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates by goal, trigger, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-600 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Showing <span className="font-bold text-gray-900">{filteredRecipes.length}</span> recipes
          </div>
        </div>

        {/* Category Pill Filters (Clean, modern segmented tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Main Full-Width Recipe Cards Grid (Spacious, No Cramping!) */}
      {filteredRecipes.length === 0 ? (
        <div className="p-12 text-center bg-white border border-gray-200 rounded-2xl space-y-3">
          <p className="text-sm font-semibold text-gray-700">No recipes matched "{searchQuery}"</p>
          <p className="text-xs text-gray-500">Try adjusting your search keywords or category filters.</p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-semibold text-gray-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Build From Scratch Card (always visible when in 'All' category and no search) */}
          {selectedCategory === 'All' && !searchQuery && (
            <div
              onClick={() => navigate('/dashboard/automations/from-scratch')}
              className="group border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/20 hover:bg-indigo-50/40 rounded-xl p-6 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                    From Scratch
                  </span>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mt-0.5">
                    Build the journey yourself, step by step
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Start with a blank canvas. Pick the exact trigger event (list join, purchase, tag, API webhook) and add decisions, delays, and emails.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-700 group-hover:translate-x-1 transition-transform">
                Start from scratch <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          {/* Recipe Cards */}
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => {
                onSelectRecipe(recipe);
                navigate(`/dashboard/automations/templates/${recipe.id}`);
              }}
              className="group bg-white border border-gray-200/90 hover:border-indigo-400 rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {recipe.category}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">{recipe.durationText}</span>
                </div>

                <h3 className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {recipe.name}
                </h3>

                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {recipe.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs">
                <span className="text-gray-500 font-medium">
                  {recipe.steps.length} steps in sequence
                </span>
                <span className="font-semibold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Flow Details <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
