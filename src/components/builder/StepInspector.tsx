import React, { useState } from 'react';
import {
  X,
  Mail,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Plus,
  Tag,
  RefreshCw,
  FileText
} from 'lucide-react';
import { AutomationStep, TriggerDefinition } from '../../types/automation';
import TokenInput from '../common/TokenInput';
import { renderWithPills } from '../common/TokenPill';
import { VERIFIED_SENDERS } from '../../data/mockData';
import ChangeTriggerModal from '../modals/ChangeTriggerModal';

export const EMAIL_TEMPLATES = [
  {
    id: 'tpl-event',
    name: 'Event invitation',
    subject: "You're invited: {{ event_title }}",
    previewSnippet: 'Thanks for joining. Here is what to expect.',
    message: "We love to invite you {{ contact.name }} to our upcoming event. Can't wait to see you there!\n\nThanks for joining. Here is what to expect.",
  },
  {
    id: 'tpl-untitled',
    name: 'Untitled email (28 Oct, 23:28)',
    subject: 'A quick note for {{ contact.name }}',
    previewSnippet: 'Thanks for joining. Here is what to expect.',
    message: "Hi {{ contact.name }},\n\nWe wanted to share a few curated updates with you today.\n\nThanks for joining. Here is what to expect.",
  },
  {
    id: 'tpl-newsletter',
    name: 'Newsletter',
    subject: 'The Weekly Dispatch · {{ contact.name }}',
    previewSnippet: 'Our curated roundup of product workflows and tips.',
    message: "Hello {{ contact.name }},\n\nHere are this week's top tips to get the most out of your setup.\n\nThanks for joining. Here is what to expect.",
  },
];

interface StepInspectorProps {
  step: AutomationStep;
  stepIndex: number;
  onUpdateStep: (updated: AutomationStep) => void;
  onDeleteStep: (stepId: string) => void;
  onClose: () => void;
  onOpenChangeTrigger?: () => void;
}

export default function StepInspector({
  step,
  stepIndex,
  onUpdateStep,
  onDeleteStep,
  onClose,
  onOpenChangeTrigger,
}: StepInspectorProps) {
  const isEmail = step.type === 'action.email';
  const isDelay = step.type === 'rule.delay';
  const isTrigger = step.type === 'trigger';
  const isTag = step.type === 'action.tag';
  const isEnd = step.type === 'action.end';

  const [hasCustomRule, setHasCustomRule] = useState(false);
  const [isChangeTriggerOpen, setIsChangeTriggerOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    step.config.mode === 'template' ? 'tpl-event' : ''
  );

  const updateConfig = (patch: Partial<AutomationStep['config']>) => {
    const newConfig = { ...step.config, ...patch };
    let hasError = false;
    let errorMessage: string | undefined;

    if (isEmail && !newConfig.senderId) {
      hasError = true;
      errorMessage = 'Choose who the email comes from.';
    } else if (isTrigger && !newConfig.listName && !newConfig.listId) {
      hasError = true;
      errorMessage = 'Choose a list.';
    }

    onUpdateStep({
      ...step,
      config: newConfig,
      hasError,
      errorMessage,
    });
  };

  const handleSelectNewTrigger = (newTrigger: TriggerDefinition) => {
    onUpdateStep({
      ...step,
      title: newTrigger.title,
      subtitle: newTrigger.description,
      config: {
        ...step.config,
        triggerType: newTrigger.id,
      },
    });
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === templateId);
    if (tpl) {
      updateConfig({
        mode: 'template',
        subject: tpl.subject,
        message: tpl.message,
      });
      onUpdateStep({
        ...step,
        subtitle: `"${tpl.subject}"`,
        config: {
          ...step.config,
          mode: 'template',
          subject: tpl.subject,
          message: tpl.message,
        },
      });
    }
  };

  const currentTemplate = EMAIL_TEMPLATES.find((t) => t.id === selectedTemplateId);

  return (
    <aside className="w-full h-full bg-white border-l border-gray-200/90 flex flex-col shadow-lg z-20 shrink-0 text-xs">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">
            {stepIndex + 1}
          </div>
          <div>
            <h3 className="font-bold text-xs text-gray-900 capitalize">
              {step.title || step.type.replace('.', ' ')}
            </h3>
            <p className="text-[10px] text-gray-400">Step details & properties</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Trigger Step Inspector (Matching Screenshot image_fdcf5461.png) */}
        {isTrigger && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm text-gray-900">{step.title}</h4>
              <p className="text-gray-500 text-[11px] mt-0.5 leading-relaxed">
                Someone is added to a list: from a sign-up form, an import, or by you.
              </p>
            </div>

            {/* Error Callout if no list selected */}
            {(!step.config.listName || step.config.listName === 'choose a list') && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-semibold">Choose a list.</span>
              </div>
            )}

            {/* Change what starts this button */}
            <button
              type="button"
              onClick={onOpenChangeTrigger || (() => setIsChangeTriggerOpen(true))}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-300 text-gray-700 font-semibold text-xs hover:bg-gray-50 cursor-pointer shadow-2xs transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-gray-500" />
              Change what starts this
            </button>

            <div className="space-y-1.5 pt-1">
              <label className="block text-xs font-semibold text-gray-800">
                Which list <span className="text-red-500">*</span>
              </label>
              <select
                value={step.config.listName || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  updateConfig({ listName: val, listId: val ? `list-${val.toLowerCase().replace(/\s+/g, '-')}` : '' });
                  onUpdateStep({
                    ...step,
                    subtitle: val ? `Joins ${val} (Leaves early if they unsubscribe)` : 'Joins (choose a list)',
                    hasError: !val,
                    errorMessage: !val ? 'Choose a list.' : undefined,
                    config: { ...step.config, listName: val },
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="">Choose a list...</option>
                <option value="Newsletter Subscribers">Newsletter Subscribers</option>
                <option value="Beta Waitlist">Beta Waitlist</option>
                <option value="Customers - All Orders">Customers - All Orders</option>
                <option value="VIP High Spenders">VIP High Spenders</option>
              </select>
              <button
                type="button"
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                + New list
              </button>
            </div>

            <div className="pt-3 border-t border-gray-200 space-y-2">
              <h5 className="font-semibold text-gray-900">Only for people who...</h5>
              <p className="text-gray-500 text-[11px]">
                Leave empty to include everyone.
              </p>
              {hasCustomRule ? (
                <div className="p-2.5 rounded-lg border border-indigo-200 bg-indigo-50/50 flex items-center justify-between">
                  <span className="text-gray-700">Country is Nigeria (NG)</span>
                  <button
                    type="button"
                    onClick={() => setHasCustomRule(false)}
                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-[11px] italic">
                  No rules yet, so this matches all contacts.
                </p>
              )}
              <button
                type="button"
                onClick={() => setHasCustomRule(true)}
                className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer pt-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add a rule
              </button>
            </div>
          </div>
        )}

        {/* Email Step Inspector (Matching Screenshot image_bd87f3de.png) */}
        {isEmail && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm text-gray-900">Send an email</h4>
              <p className="text-gray-500 text-[11px] mt-0.5 leading-relaxed">
                Send one email from a verified sender, using a template you designed or a quick message written here.
              </p>
            </div>

            {/* Error Warning Box if sender missing */}
            {!step.config.senderId && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                <span className="font-semibold">Choose who the email comes from.</span>
              </div>
            )}

            {/* Sender Selection */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-800">
                Send from <span className="text-red-500">*</span>
              </label>
              <select
                value={step.config.senderId || ''}
                onChange={(e) => {
                  const sender = VERIFIED_SENDERS.find((s) => s.id === e.target.value);
                  updateConfig({
                    senderId: e.target.value,
                    senderName: sender?.name,
                  });
                }}
                className={`w-full px-3 py-2 border rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 cursor-pointer ${
                  !step.config.senderId
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              >
                <option value="">Choose who it comes from...</option>
                {VERIFIED_SENDERS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium cursor-pointer"
              >
                + New sender
              </button>
            </div>

            {/* Mode Switcher: Use a template vs Write a quick message (Screenshot image_bd87f3de.png) */}
            <div className="flex bg-gray-100 p-0.5 rounded-lg text-xs">
              <button
                type="button"
                onClick={() => {
                  updateConfig({ mode: 'template' });
                  if (!selectedTemplateId) {
                    handleSelectTemplate('tpl-event');
                  }
                }}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  step.config.mode === 'template'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Use a template
              </button>
              <button
                type="button"
                onClick={() => updateConfig({ mode: 'quick' })}
                className={`flex-1 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${
                  step.config.mode !== 'template'
                    ? 'bg-white text-gray-900 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Write a quick message
              </button>
            </div>

            {/* TEMPLATE PICKER VIEW (Screenshot image_bd87f3de.png) */}
            {step.config.mode === 'template' ? (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-gray-800">
                    Template <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedTemplateId}
                    onChange={(e) => handleSelectTemplate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="">Choose a template...</option>
                    {EMAIL_TEMPLATES.map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Template Content Preview Card (Screenshot image_bd87f3de.png) */}
                {currentTemplate && (
                  <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/60 space-y-2">
                    <div className="text-[11px] font-semibold text-gray-500">
                      Subject:{' '}
                      <span className="text-gray-800 font-medium">
                        {renderWithPills(currentTemplate.subject, 'xs')}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200/80 text-[11px] text-gray-700 leading-relaxed">
                      {currentTemplate.previewSnippet}
                    </div>
                    <div className="text-[11px] text-gray-400 underline">
                      Unsubscribe
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* QUICK MESSAGE VIEW WITH TOKEN INPUT (Screenshot image_d2c5a51a.png) */
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <TokenInput
                    label="Subject line"
                    required
                    value={step.config.subject || ''}
                    onChange={(val) => {
                      updateConfig({ subject: val });
                      onUpdateStep({
                        ...step,
                        subtitle: `"${val}"`,
                        config: { ...step.config, subject: val },
                      });
                    }}
                    placeholder="e.g. Welcome aboard, {{ contact.name }}!"
                  />
                </div>

                <div className="space-y-1.5">
                  <TokenInput
                    label="Message"
                    required
                    multiline
                    rows={5}
                    value={step.config.message || ''}
                    onChange={(val) => updateConfig({ message: val })}
                    placeholder="Write your email body here. Insert dynamic tokens from below..."
                  />
                </div>
              </div>
            )}

            {/* Unsubscribe checkbox */}
            <div className="pt-2 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={step.config.includeUnsubscribe !== false}
                  onChange={(e) => updateConfig({ includeUnsubscribe: e.target.checked })}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-gray-800 block">End with an unsubscribe link</span>
                  <span className="text-[11px] text-gray-400">Added at the bottom of the email for you.</span>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Delay Step Inspector */}
        {isDelay && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm text-gray-900">Wait Delay</h4>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Pause the contact for a specified duration before executing the next action.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-gray-700">
                Duration (Days)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={step.config.delayDays || 1}
                  onChange={(e) => {
                    const days = parseInt(e.target.value) || 1;
                    updateConfig({ delayDays: days });
                    onUpdateStep({
                      ...step,
                      subtitle: `Waits ${days} day${days > 1 ? 's' : ''}`,
                      config: { ...step.config, delayDays: days },
                    });
                  }}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
                <span className="text-gray-500 text-xs">days</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-400 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-200">
              Delay counts from the moment the contact finished the previous step, calibrated to their local timezone.
            </p>
          </div>
        )}

        {/* Tag Action Inspector */}
        {isTag && (
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm text-gray-900">Tag Contact</h4>
              <p className="text-gray-500 text-[11px] mt-0.5">
                Apply a segment or behavior tag to this contact record.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Tag Name
              </label>
              <input
                type="text"
                value={step.config.tag || 'Nurtured'}
                onChange={(e) => updateConfig({ tag: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
              />
            </div>
          </div>
        )}

        {/* End Journey Inspector */}
        {isEnd && (
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-gray-900">Journey Exit</h4>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              When a contact completes the prior steps, they exit this workflow. Their history and stats remain archived.
            </p>
          </div>
        )}
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
        {!isTrigger && !isEnd ? (
          <button
            type="button"
            onClick={() => onDeleteStep(step.id)}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors py-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Remove this step
          </button>
        ) : (
          <span className="text-[11px] text-gray-400">Fixed milestone step</span>
        )}
        <button
          type="button"
          onClick={onClose}
          className="px-3.5 py-1.5 bg-gray-900 hover:bg-black text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </aside>
  );
}
