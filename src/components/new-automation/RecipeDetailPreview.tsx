import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Mail,
  UserPlus,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2
} from 'lucide-react';
import { Recipe } from '../../types/automation';
import { RECIPES } from '../../data/mockData';

interface RecipeDetailPreviewProps {
  onUseRecipe: (recipe: Recipe, customName?: string) => void;
}

export default function RecipeDetailPreview({ onUseRecipe }: RecipeDetailPreviewProps) {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Look up recipe by id or fallback to first
  const recipe = RECIPES.find((r) => r.id === id) || RECIPES[0];

  const [automationName, setAutomationName] = useState(recipe.name);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleUseThisFlow = () => {
    onUseRecipe(recipe, automationName.trim() || recipe.name);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* Breadcrumb Navigation & Top Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link to="/dashboard/automations" className="hover:text-gray-900 transition-colors">
              Automations
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <Link to="/dashboard/automations/new" className="hover:text-gray-900 transition-colors">
              Flow templates
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="font-semibold text-gray-900 truncate max-w-[200px]">
              {recipe.name}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Flow template</h1>
        </div>

        {/* CTA Top Action Button */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/automations/new"
            className="px-3.5 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ← Other recipes
          </Link>
          <button
            type="button"
            onClick={handleUseThisFlow}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Use this flow
          </button>
        </div>
      </div>

      {/* Main Recipe Info Card (Inspired by Mailchimp Screenshot 4) */}
      <div className="bg-white border border-gray-200/90 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Summary */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
                  {recipe.category}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {recipe.durationText} sequence
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight leading-snug">
                {recipe.name}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                {recipe.description}
              </p>
            </div>

            {/* This Flow Will Bullet List */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">This flow will:</h4>
              <ul className="space-y-2 text-xs text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <span>Execute immediately upon trigger entry without delaying recipient first touch.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <span>Deliver personalized dynamic emails with customer tokens (name, email, order details).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <span>Respect all quiet hour windows and organization delivery caps automatically.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <span>Stop automatically if the recipient un-subscribes or achieves conversion goal.</span>
                </li>
              </ul>
            </div>

            {/* Name Input Field for Immediate Customization */}
            <div className="pt-2">
              <label htmlFor="flow-name" className="block text-xs font-semibold text-gray-700 mb-1">
                Name your automation draft:
              </label>
              <input
                id="flow-name"
                type="text"
                value={automationName}
                onChange={(e) => setAutomationName(e.target.value)}
                className="w-full max-w-md px-3.5 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Right Summary Specification Box (Mailchimp style) */}
          <div className="lg:col-span-5 bg-gray-50/80 border border-gray-200/80 rounded-xl p-5 space-y-4 text-xs">
            <div>
              <span className="text-gray-400 font-medium block mb-1">Contacts are added when</span>
              <p className="font-semibold text-gray-900 leading-relaxed">
                {recipe.triggerDescription}
              </p>
            </div>

            <div className="h-px bg-gray-200/70" />

            <div>
              <span className="text-gray-400 font-medium block mb-1">You'll need</span>
              <ul className="space-y-1">
                {recipe.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-gray-700 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-px bg-gray-200/70" />

            <div>
              <span className="text-gray-400 font-medium block mb-1">Flow objective</span>
              <p className="font-semibold text-indigo-700">
                {recipe.objective}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleUseThisFlow}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors text-center"
              >
                Customize this recipe →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Visual Flow Diagram Preview (Centerpiece from Mailchimp Screenshot 4) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Sequence Map Preview</h3>
            <p className="text-xs text-gray-500">
              Interactive preview of the {recipe.steps.length} steps configured in this workflow.
            </p>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={() => setZoomLevel(Math.max(70, zoomLevel - 15))}
              className="p-1 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-100"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-gray-600">{zoomLevel}%</span>
            <button
              type="button"
              onClick={() => setZoomLevel(Math.min(130, zoomLevel + 15))}
              className="p-1 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-100"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="p-1 text-gray-500 hover:text-gray-800 rounded hover:bg-gray-100"
              title="Reset zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Diagram Canvas Container */}
        <div className="bg-gray-50/70 border border-gray-200 rounded-2xl p-8 min-h-[360px] flex flex-col items-center justify-center overflow-x-auto shadow-inner">
          <div
            className="w-full max-w-md space-y-0 transition-transform origin-top"
            style={{ transform: `scale(${zoomLevel / 100})` }}
          >
            {recipe.steps.map((step, index) => {
              const isLast = index === recipe.steps.length - 1;

              return (
                <div key={step.id} className="flex flex-col items-center">
                  {/* Step Card Node */}
                  <div
                    className={`w-full p-4 rounded-xl border bg-white shadow-xs flex items-start gap-3 transition-all ${
                      step.type === 'trigger'
                        ? 'border-amber-200/90 ring-2 ring-amber-500/10'
                        : step.type === 'action.email'
                        ? 'border-indigo-200/90'
                        : step.type === 'rule.delay'
                        ? 'border-gray-200'
                        : 'border-gray-200'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg shrink-0 ${
                        step.type === 'trigger'
                          ? 'bg-amber-50 text-amber-600'
                          : step.type === 'action.email'
                          ? 'bg-indigo-50 text-indigo-600'
                          : step.type === 'rule.delay'
                          ? 'bg-gray-100 text-gray-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {step.type === 'trigger' && <UserPlus className="w-4 h-4" />}
                      {step.type === 'action.email' && <Mail className="w-4 h-4" />}
                      {step.type === 'rule.delay' && <Clock className="w-4 h-4" />}
                      {step.type === 'action.end' && <CheckCircle2 className="w-4 h-4" />}
                      {step.type === 'action.tag' && <Zap className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Step {index + 1} · {step.type.replace('.', ' ')}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-gray-900 mt-0.5">{step.title}</h4>
                      {step.subtitle && (
                        <p className="text-[11px] text-gray-500 mt-0.5 truncate">{step.subtitle}</p>
                      )}
                    </div>
                  </div>

                  {/* Vertical Connector Line */}
                  {!isLast && (
                    <div className="flex flex-col items-center my-1.5">
                      <div className="w-0.5 h-6 bg-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Bar Action */}
        <div className="pt-4 flex items-center justify-between">
          <Link
            to="/dashboard/automations/new"
            className="text-xs font-semibold text-gray-500 hover:text-gray-900"
          >
            ← Back to all templates
          </Link>
          <button
            type="button"
            onClick={handleUseThisFlow}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Open in Workflow Canvas →
          </button>
        </div>
      </div>
    </div>
  );
}
