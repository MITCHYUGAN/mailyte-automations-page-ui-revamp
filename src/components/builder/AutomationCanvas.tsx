import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Home,
  Copy,
  Settings,
  Zap,
  Play,
  Pause,
  Plus,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Mail,
  UserPlus,
  Clock,
  CheckCircle2,
  Tag,
  Check,
  X,
  Edit3,
  FileText,
  Rocket,
  MoreVertical,
  Trash2,
  GitBranch,
  Target
} from 'lucide-react';
import { Automation, AutomationStep, TriggerDefinition } from '../../types/automation';
import StepInspector from './StepInspector';
import JourneySettingsPanel from './JourneySettingsPanel';
import SimulationPreviewModal from '../modals/SimulationPreviewModal';
import OrgSettingsModal from '../modals/OrgSettingsModal';
import ChangeTriggerModal from '../modals/ChangeTriggerModal';
import { renderWithPills } from '../common/TokenPill';

interface AutomationCanvasProps {
  automation: Automation;
  onUpdateAutomation: (updated: Automation) => void;
  onToggleStatus: (id: string) => void;
  onDeleteAutomation?: (id: string) => void;
}

export default function AutomationCanvas({
  automation,
  onUpdateAutomation,
  onToggleStatus,
  onDeleteAutomation,
}: AutomationCanvasProps) {
  const navigate = useNavigate();

  // State
  const [selectedStepId, setSelectedStepId] = useState<string | null>(
    automation.steps[0]?.id || null
  );
  const [rightPanelTab, setRightPanelTab] = useState<'inspector' | 'settings'>('inspector');
  const [viewMode, setViewMode] = useState<'steps' | 'flow'>('steps');
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false); // Modal-style full-screen overlay
  const [copiedId, setCopiedId] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isChangeTriggerOpen, setIsChangeTriggerOpen] = useState(false);
  const [activeInsertIndex, setActiveInsertIndex] = useState<number | null>(null);
  const [planBannerVisible, setPlanBannerVisible] = useState(true);
  const [overflowMenuOpen, setOverflowMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Resizable panel state
  const [inspectorWidth, setInspectorWidth] = useState(460);
  const [isResizing, setIsResizing] = useState(false);

  const selectedStep = automation.steps.find((s) => s.id === selectedStepId);
  const selectedStepIndex = automation.steps.findIndex((s) => s.id === selectedStepId);

  // Drag resizer effect for edit inspector panel
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 340 && newWidth <= 760) {
        setInspectorWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing) setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  // Escape key exits fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCanvasFullscreen) {
        setIsCanvasFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCanvasFullscreen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyId = () => {
    navigator.clipboard.writeText(automation.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleUpdateStep = (updated: AutomationStep) => {
    const updatedSteps = automation.steps.map((s) => (s.id === updated.id ? updated : s));
    onUpdateAutomation({
      ...automation,
      steps: updatedSteps,
      stepsCount: updatedSteps.length,
      updatedAt: 'Just now',
    });
  };

  const handleSelectNewTrigger = (newTrigger: TriggerDefinition) => {
    const updatedSteps = automation.steps.map((s) => {
      if (s.type === 'trigger') {
        return {
          ...s,
          title: newTrigger.title,
          subtitle: newTrigger.description,
          config: {
            ...s.config,
            triggerType: newTrigger.id,
          },
        };
      }
      return s;
    });

    onUpdateAutomation({
      ...automation,
      steps: updatedSteps,
      triggerType: newTrigger.id,
      updatedAt: 'Just now',
    });
    setIsChangeTriggerOpen(false);
    showToast(`Trigger updated to: ${newTrigger.title}`);
  };

  const handleDeleteStep = (stepId: string) => {
    const updatedSteps = automation.steps.filter((s) => s.id !== stepId);
    onUpdateAutomation({
      ...automation,
      steps: updatedSteps,
      stepsCount: updatedSteps.length,
      updatedAt: 'Just now',
    });
    if (selectedStepId === stepId) {
      setSelectedStepId(updatedSteps[0]?.id || null);
    }
    showToast('Step removed');
  };

  const handleInsertStep = (index: number, type: 'email' | 'delay' | 'tag') => {
    const newId = `step-${Date.now()}`;
    let newStep: AutomationStep;

    if (type === 'email') {
      newStep = {
        id: newId,
        type: 'action.email',
        title: 'Send an email',
        subtitle: '"Welcome aboard, {{ contact.name }}"',
        config: {
          senderId: 'sender-1',
          mode: 'quick',
          subject: 'Welcome aboard, {{ contact.name }}',
          message: 'Hi {{ contact.name }},\n\nHope this finds you well. Checking in to see if you have any questions!',
          includeUnsubscribe: true,
        },
      };
    } else if (type === 'delay') {
      newStep = {
        id: newId,
        type: 'rule.delay',
        title: 'Wait',
        subtitle: 'Waits 2 days',
        config: { delayDays: 2 },
      };
    } else {
      newStep = {
        id: newId,
        type: 'action.tag',
        title: 'Tag contact',
        subtitle: 'Add tag [Interested]',
        config: { tag: 'Interested' },
      };
    }

    const updatedSteps = [
      ...automation.steps.slice(0, index + 1),
      newStep,
      ...automation.steps.slice(index + 1),
    ];

    onUpdateAutomation({
      ...automation,
      steps: updatedSteps,
      stepsCount: updatedSteps.length,
      updatedAt: 'Just now',
    });

    setActiveInsertIndex(null);
    setSelectedStepId(newId);
    setRightPanelTab('inspector');
    showToast('New step inserted');
  };

  const handleToggleLive = () => {
    if (automation.state === 'live') {
      onToggleStatus(automation.id);
      showToast(`${automation.name} paused.`);
    } else {
      onToggleStatus(automation.id);
      showToast(`${automation.name} is now live!`);
    }
  };

  const handleDeleteDraft = () => {
    if (window.confirm(`Are you sure you want to delete "${automation.name}"? This cannot be undone.`)) {
      if (onDeleteAutomation) {
        onDeleteAutomation(automation.id);
      }
      navigate('/dashboard/automations');
    }
  };

  /* Render Steps Content (Used in normal canvas and in fullscreen modal) */
  const renderStepsContent = () => (
    <div
      className="w-full max-w-lg pt-12 pb-24 space-y-0 transition-transform origin-top"
      style={{ transform: `scale(${zoomLevel / 100})` }}
    >
      {automation.steps.map((step, index) => {
        const isSelected = selectedStepId === step.id && rightPanelTab === 'inspector';
        const isLast = index === automation.steps.length - 1;
        const isTrigger = step.type === 'trigger';

        return (
          <div key={step.id} className="flex flex-col items-center">
            {/* Step Card Node (Screenshot image_fdcf5461.png layout) */}
            <div
              onClick={() => {
                setSelectedStepId(step.id);
                setRightPanelTab('inspector');
                if (isCanvasFullscreen) setIsCanvasFullscreen(false);
              }}
              className={`group relative w-full p-4 rounded-xl border bg-white cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : step.hasError
                  ? 'border-red-300 hover:border-red-400 bg-red-50/10 shadow-xs'
                  : 'border-gray-200/90 hover:border-gray-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                {/* Step index & icon container */}
                <div
                  className={`p-2.5 rounded-lg shrink-0 transition-colors ${
                    isTrigger
                      ? 'bg-amber-50 text-amber-600 border border-amber-200'
                      : step.type === 'action.email'
                      ? step.hasError
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                      : step.type === 'rule.delay'
                      ? 'bg-gray-100 text-gray-600 border border-gray-200'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}
                >
                  {isTrigger && <Zap className="w-4 h-4" />}
                  {step.type === 'action.email' && <Mail className="w-4 h-4" />}
                  {step.type === 'rule.delay' && <Clock className="w-4 h-4" />}
                  {step.type === 'action.tag' && <Tag className="w-4 h-4" />}
                  {step.type === 'action.end' && <CheckCircle2 className="w-4 h-4" />}
                </div>

                {/* Step Information with Dynamic Tag Pills */}
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500">
                      {index + 1}
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {renderWithPills(step.title, 'xs')}
                    </h4>
                  </div>

                  {step.subtitle && (
                    <p className="text-xs text-gray-500 truncate flex items-center gap-1 flex-wrap">
                      {renderWithPills(step.subtitle, 'xs')}
                    </p>
                  )}

                  {/* Leaves early badge for trigger */}
                  {isTrigger && (
                    <div className="pt-0.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200">
                        Leaves early if <strong className="text-gray-800">they unsubscribe</strong>
                      </span>
                    </div>
                  )}

                  {/* Red Error Callout matching Mailyte screenshot */}
                  {step.hasError && step.errorMessage && (
                    <div className="pt-1 text-[11px] font-semibold text-red-600 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{step.errorMessage}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Intermediate Vertical Connector & Add Button */}
            {!isLast && (
              <div className="relative flex flex-col items-center my-1 select-none">
                <div className="w-0.5 h-8 bg-gray-300" />
                <button
                  type="button"
                  onClick={() =>
                    setActiveInsertIndex(activeInsertIndex === index ? null : index)
                  }
                  className="w-5 h-5 rounded-full bg-white border border-gray-300 hover:border-indigo-600 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 flex items-center justify-center shadow-xs transition-all z-10 my-[-10px] cursor-pointer"
                  title="Add next step here"
                >
                  <Plus className="w-3 h-3" />
                </button>

                {/* Add Step Popup Menu */}
                {activeInsertIndex === index && (
                  <div className="absolute top-6 z-30 bg-white border border-gray-200 rounded-xl shadow-xl p-2 w-48 text-xs space-y-1 animate-in zoom-in-95 duration-100">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                      Insert Next Step
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInsertStep(index, 'email')}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg hover:bg-indigo-50 text-gray-800 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-500" />
                      Send an email
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertStep(index, 'delay')}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg hover:bg-indigo-50 text-gray-800 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      Wait delay
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertStep(index, 'tag')}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-left rounded-lg hover:bg-indigo-50 text-gray-800 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
                    >
                      <Tag className="w-3.5 h-3.5 text-emerald-500" />
                      Tag contact
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  /* Render Flow Diagram Content (Used in normal canvas and in fullscreen modal) */
  const renderFlowContent = () => (
    <div
      className="w-full max-w-2xl pt-12 pb-24 flex flex-col items-center space-y-6 transition-transform origin-top"
      style={{ transform: `scale(${zoomLevel / 100})` }}
    >
      {/* Trigger Node */}
      <div
        onClick={() => {
          setSelectedStepId(automation.steps[0]?.id || null);
          setRightPanelTab('inspector');
          if (isCanvasFullscreen) setIsCanvasFullscreen(false);
        }}
        className={`p-4 rounded-xl border bg-white shadow-xs w-72 text-center cursor-pointer transition-all ${
          selectedStepId === automation.steps[0]?.id
            ? 'border-indigo-600 ring-2 ring-indigo-500/20'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center mb-2">
          <Zap className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block">
          Entry Trigger
        </span>
        <h4 className="font-bold text-sm text-gray-900 mt-0.5">
          {renderWithPills(automation.steps[0]?.title || 'Joined a list', 'xs')}
        </h4>
        <p className="text-[11px] text-gray-500 mt-1 truncate">
          {automation.steps[0]?.config.listName || 'Newsletter Subscribers'}
        </p>
      </div>

      {/* Connecting Line */}
      <div className="w-0.5 h-6 bg-gray-300" />

      {/* Email Step 1 */}
      <div
        onClick={() => {
          const emailStep = automation.steps.find((s) => s.type === 'action.email');
          if (emailStep) {
            setSelectedStepId(emailStep.id);
            setRightPanelTab('inspector');
            if (isCanvasFullscreen) setIsCanvasFullscreen(false);
          }
        }}
        className="p-4 rounded-xl border border-gray-200 hover:border-gray-300 bg-white shadow-xs w-72 text-center cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 mx-auto flex items-center justify-center mb-2">
          <Mail className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
          Step 2 · Email Dispatch
        </span>
        <div className="font-bold text-xs text-gray-900 mt-0.5">
          {renderWithPills('Welcome aboard, {{ contact.name }}', 'xs')}
        </div>
        <p className="text-[10px] text-gray-400 mt-1">Automatic personal intro</p>
      </div>

      {/* Decision Branch Node */}
      <div className="w-0.5 h-6 bg-gray-300" />
      <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/40 w-80 text-center shadow-xs">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-indigo-900">
          <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
          <span>Rule: Opened or clicked within 48h?</span>
        </div>
        <p className="text-[10px] text-indigo-700/80 mt-0.5">
          Evaluates engagement in each contact's timezone
        </p>
      </div>

      {/* 2-Way Branch Split */}
      <div className="grid grid-cols-2 gap-8 w-full max-w-xl relative">
        {/* Branch Left: YES */}
        <div className="flex flex-col items-center space-y-4">
          <div className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
            Yes (Engaged)
          </div>
          <div className="w-0.5 h-4 bg-emerald-300" />
          <div className="p-3 rounded-xl border border-gray-200 bg-white shadow-xs w-56 text-center text-xs">
            <span className="font-bold text-gray-900 block">Send VIP Resources</span>
            <span className="text-[10px] text-gray-500">Advanced starter kit tips</span>
          </div>
        </div>

        {/* Branch Right: NO */}
        <div className="flex flex-col items-center space-y-4">
          <div className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200 text-[10px] font-bold uppercase">
            No (Unopened)
          </div>
          <div className="w-0.5 h-4 bg-gray-300" />
          <div className="p-3 rounded-xl border border-gray-200 bg-white shadow-xs w-56 text-center text-xs">
            <span className="font-bold text-gray-900 block">Wait 2 Days & Re-ping</span>
            <span className="text-[10px] text-gray-500">Gentle friendly reminder</span>
          </div>
        </div>
      </div>

      {/* Conversion Goal Target Node */}
      <div className="w-0.5 h-6 bg-gray-300" />
      <div className="p-3.5 rounded-xl border border-purple-200 bg-purple-50/50 w-72 text-center shadow-xs">
        <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 border border-purple-200 mx-auto flex items-center justify-center mb-1.5">
          <Target className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
          Conversion Goal
        </span>
        <h4 className="font-bold text-xs text-gray-900 mt-0.5">
          Contact activated / Converted
        </h4>
      </div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col bg-[#f8fafc] text-gray-900 overflow-hidden relative font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-150">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Subheader Navigation & Details (Matching Screenshot image_fdcf5461.png) */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 space-y-2 shrink-0 select-none z-10">
        {/* 1. Breadcrumbs bar: (homeIcon) Dashboard > Automations */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Home className="w-3.5 h-3.5 text-gray-400" />
          <Link to="/dashboard/automations" className="hover:text-gray-900 transition-colors cursor-pointer">
            Dashboard
          </Link>
          <span className="text-gray-400">&gt;</span>
          <span className="text-gray-700 font-medium">Automations</span>
        </div>

        {/* 2. <- All automations */}
        <div>
          <Link
            to="/dashboard/automations"
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All automations
          </Link>
        </div>

        {/* 3. Welcome series flexed with [pen icon] Draft, ID, and Right Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-0.5">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Editable Title input */}
              <input
                type="text"
                value={automation.name}
                onChange={(e) => onUpdateAutomation({ ...automation, name: e.target.value })}
                placeholder="Automation name"
                className="text-xl md:text-2xl font-bold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-indigo-600 focus:outline-none transition-colors bg-transparent py-0.5 max-w-md truncate"
                title="Click to rename automation"
              />

              {/* Draft Badge with Pen Icon */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 shrink-0">
                <Edit3 className="w-3 h-3 text-gray-500" />
                <span className="capitalize">{automation.state}</span>
              </span>
            </div>

            {/* ID copy line */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
              <span>ID {automation.id}</span>
              <button
                type="button"
                onClick={copyId}
                className="p-1 hover:text-gray-700 rounded transition-colors cursor-pointer"
                title="Copy ID"
              >
                {copiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

          {/* Right Action Controls: Preview, Settings, Set live, Overflow [...] */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Preview Button */}
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 shadow-2xs transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-gray-500" />
              Preview
            </button>

            {/* Settings Button */}
            <button
              type="button"
              onClick={() => {
                setRightPanelTab(rightPanelTab === 'settings' ? 'inspector' : 'settings');
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 h-9 rounded-lg border text-xs font-semibold shadow-2xs transition-all cursor-pointer ${
                rightPanelTab === 'settings'
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
              }`}
            >
              <Settings className="w-3.5 h-3.5 text-gray-500" />
              Settings
            </button>

            {/* Set Live / Pause */}
            <button
              type="button"
              onClick={handleToggleLive}
              className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer ${
                automation.state === 'live'
                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {automation.state === 'live' ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause journey
                </>
              ) : (
                <>
                  <Rocket className="w-3.5 h-3.5 fill-white" />
                  Set live
                </>
              )}
            </button>

            {/* Overflow Menu with Delete Draft */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setOverflowMenuOpen(!overflowMenuOpen)}
                className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer shadow-2xs"
                title="More options"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {overflowMenuOpen && (
                <div className="absolute right-0 top-10 w-44 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50 animate-in fade-in-50">
                  <button
                    type="button"
                    onClick={() => {
                      setOverflowMenuOpen(false);
                      handleDeleteDraft();
                    }}
                    className="w-full flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 text-left transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Draft
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Plan limit warning banner matching Screenshot image_fdcf5461.png */}
      {planBannerVisible && (
        <div className="bg-red-50/80 border-b border-red-200/80 px-6 py-2.5 text-xs text-red-900 flex items-center justify-between shrink-0 select-none">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span className="font-medium">
              Your Free plan allows 3 steps in one journey. Move to Starter to go further.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPlanBannerVisible(false)}
            className="text-red-400 hover:text-red-700 p-0.5 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Workspace: Canvas Area + Resizable Divider + Right Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Floating Top-Left Mode Switcher: [Steps] [Flow] */}
        <div className="absolute top-4 left-6 z-20 flex items-center gap-2 select-none">
          <div className="flex bg-white border border-gray-200/90 rounded-lg p-0.5 shadow-xs text-xs font-semibold">
            <button
              type="button"
              onClick={() => setViewMode('steps')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                viewMode === 'steps'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Steps
            </button>
            <button
              type="button"
              onClick={() => setViewMode('flow')}
              className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'flow'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <GitBranch className="w-3 h-3" />
              Flow
            </button>
          </div>
        </div>

        {/* Center Canvas Viewport */}
        <div className="flex-1 overflow-auto p-8 sm:p-12 flex flex-col items-center justify-start bg-[#fcfcfc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] relative">
          {/* Vertical Zoom & Fullscreen Toolbar on the right side of the canvas (Matching Screenshot image_24d9fbcd.png) */}
          <div className="absolute top-6 right-6 z-20 flex flex-col items-center bg-white border border-gray-200/90 rounded-lg shadow-sm text-xs select-none overflow-hidden">
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.min(140, prev + 10))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors"
              title="Zoom in"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel((prev) => Math.max(60, prev - 10))}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors"
              title="Zoom out"
            >
              <span className="text-sm font-bold leading-none block h-3.5 w-3.5 text-center">−</span>
            </button>
            <button
              type="button"
              onClick={() => setIsCanvasFullscreen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors"
              title="Open full-screen modal view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoomLevel(100)}
              className="px-2 py-1.5 text-[10px] font-mono font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer transition-colors"
              title="Reset zoom to 1:1"
            >
              1:1
            </button>
          </div>

          {/* Render Views */}
          {viewMode === 'steps' ? renderStepsContent() : renderFlowContent()}
        </div>

        {/* Draggable Divider Handle */}
        <div
          onMouseDown={() => setIsResizing(true)}
          className="w-1.5 hover:w-2 bg-gray-200/90 hover:bg-indigo-500 transition-all cursor-col-resize shrink-0 relative group z-20 flex items-center justify-center select-none"
          title="Drag to resize inspector width"
        >
          <div className="w-0.5 h-8 bg-gray-400 group-hover:bg-white rounded-full transition-colors" />
        </div>

        {/* Right Sidebar: Step Inspector OR Journey Settings */}
        <div
          style={{ width: `${inspectorWidth}px` }}
          className="h-full shrink-0 flex flex-col z-10 animate-in slide-in-from-right duration-150"
        >
          {rightPanelTab === 'settings' ? (
            <JourneySettingsPanel
              automation={automation}
              onUpdateAutomation={onUpdateAutomation}
              onClose={() => setRightPanelTab('inspector')}
              onOpenSendingRules={() => setIsRulesModalOpen(true)}
            />
          ) : selectedStep ? (
            <StepInspector
              step={selectedStep}
              stepIndex={selectedStepIndex}
              onUpdateStep={handleUpdateStep}
              onDeleteStep={handleDeleteStep}
              onClose={() => setSelectedStepId(null)}
              onOpenChangeTrigger={() => setIsChangeTriggerOpen(true)}
            />
          ) : (
            <div className="h-full bg-white border-l border-gray-200 p-8 flex flex-col items-center justify-center text-center space-y-3 text-gray-400">
              <Zap className="w-8 h-8 stroke-1" />
              <p className="text-xs">Select any step in the canvas to edit its properties.</p>
            </div>
          )}
        </div>
      </div>

      {/* FULLSCREEN MODAL OVERLAY (Feedback 3: covers the entire screen like a modal) */}
      {isCanvasFullscreen && (
        <div className="fixed inset-0 z-[90] bg-[#f8fafc] flex flex-col animate-in fade-in duration-150">
          {/* Top Bar for Fullscreen Modal */}
          <div className="h-14 px-6 border-b border-gray-200 bg-white flex items-center justify-between shrink-0 select-none">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-base text-gray-900">{automation.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                Fullscreen View
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Fullscreen Mode Switcher */}
              <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewMode('steps')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
                    viewMode === 'steps' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Steps
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('flow')}
                  className={`px-3 py-1 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                    viewMode === 'flow' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <GitBranch className="w-3 h-3" />
                  Flow
                </button>
              </div>

              {/* Exit Fullscreen Button */}
              <button
                type="button"
                onClick={() => setIsCanvasFullscreen(false)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors"
              >
                <Minimize2 className="w-3.5 h-3.5" />
                Exit Fullscreen (Esc)
              </button>
            </div>
          </div>

          {/* Fullscreen Canvas Center */}
          <div className="flex-1 overflow-auto p-12 flex flex-col items-center justify-start bg-[#fcfcfc] bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] relative">
            {/* Zoom Controls inside Fullscreen */}
            <div className="absolute top-6 right-6 z-20 flex flex-col items-center bg-white border border-gray-200/90 rounded-lg shadow-sm text-xs select-none overflow-hidden">
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(140, prev + 10))}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                title="Zoom in"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(60, prev - 10))}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                title="Zoom out"
              >
                <span className="text-sm font-bold leading-none block h-3.5 w-3.5 text-center">−</span>
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="px-2 py-1.5 text-[10px] font-mono font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 cursor-pointer"
                title="Reset zoom to 1:1"
              >
                1:1
              </button>
            </div>

            {viewMode === 'steps' ? renderStepsContent() : renderFlowContent()}
          </div>
        </div>
      )}

      {/* Change Trigger Modal (Rendered at Root with z-[100] so canvas controls never bleed through) */}
      <ChangeTriggerModal
        isOpen={isChangeTriggerOpen}
        onClose={() => setIsChangeTriggerOpen(false)}
        currentTriggerId={automation.steps.find((s) => s.type === 'trigger')?.config?.triggerType}
        onSelectTrigger={handleSelectNewTrigger}
      />

      {/* Simulation / Dry Run Preview Modal */}
      <SimulationPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        automation={automation}
      />

      {/* Sending Rules Modal */}
      <OrgSettingsModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
    </div>
  );
}
