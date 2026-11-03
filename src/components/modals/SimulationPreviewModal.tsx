import React, { useState } from 'react';
import { X, AlertTriangle, Send, CheckCircle2, Mail, User } from 'lucide-react';
import { Automation } from '../../types/automation';

interface SimulationPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  automation: Automation;
}

export default function SimulationPreviewModal({
  isOpen,
  onClose,
  automation,
}: SimulationPreviewModalProps) {
  const [sendToSandbox, setSendToSandbox] = useState(false);
  const [sentNotice, setSentNotice] = useState(false);

  if (!isOpen) return null;

  // Collect incomplete items from automation steps
  const issues: string[] = [];

  // 1. Check list
  const triggerStep = automation.steps.find((s) => s.type === 'trigger');
  if (!triggerStep?.config?.listId && !triggerStep?.config?.listName) {
    issues.push('Choose a list.');
  }

  // 2. Check each email sender
  const emailSteps = automation.steps.filter((s) => s.type === 'action.email');
  emailSteps.forEach((s) => {
    if (!s.config.senderId) {
      issues.push('Choose who the email comes from.');
    }
  });

  // 3. Free plan step limit
  if (automation.steps.length > 3) {
    issues.push('Your Free plan allows 3 steps in one journey. Move to Starter to go further.');
  }

  const handleSendToSandbox = () => {
    setSentNotice(true);
    setTimeout(() => setSentNotice(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            Preview: what would happen
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body matching Screenshot image_516a525e.png */}
        <div className="p-6 space-y-5">
          {/* Checkbox: Also send these emails to my Sandbox */}
          <div className="flex items-start gap-3 p-3 rounded-xl border border-gray-200/80 bg-gray-50/50">
            <input
              type="checkbox"
              id="sandbox-checkbox"
              checked={sendToSandbox}
              onChange={(e) => setSendToSandbox(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="sandbox-checkbox" className="text-xs space-y-1 cursor-pointer">
              <span className="font-bold text-gray-900 block">
                Also send these emails to my Sandbox
              </span>
              <span className="text-gray-500 leading-relaxed block">
                Each email below is built exactly as a real run would build it and put in your Sandbox, so you can open it. Nobody receives it, nothing is recorded as a run and no credits are used.
              </span>
            </label>
          </div>

          {/* Warning / Issues Card (shown when steps have missing config) */}
          {issues.length > 0 ? (
            <div className="rounded-xl border border-red-200 bg-red-50/60 p-4 text-xs text-red-900 space-y-2.5">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <p className="font-semibold text-red-950 leading-relaxed">
                  {issues.join(' ')}
                </p>
              </div>

              <ul className="list-disc list-inside space-y-1 pl-6 text-red-800 font-medium">
                {issues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs text-emerald-900 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All steps configured! This journey is ready to dry-run.</span>
            </div>
          )}

          {sendToSandbox && (
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {sentNotice ? 'Sent to Sandbox!' : 'Sends mock copies to Sandbox'}
              </span>
              <button
                type="button"
                onClick={handleSendToSandbox}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-700 shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Dispatch to Sandbox
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
