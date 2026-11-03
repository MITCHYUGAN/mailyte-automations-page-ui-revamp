import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

interface OrgSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RuleItem {
  id: string;
  label: string;
  value: string;
  options?: string[];
}

export default function OrgSettingsModal({ isOpen, onClose }: OrgSettingsModalProps) {
  const [rules, setRules] = useState<RuleItem[]>([
    {
      id: 'domains',
      label: 'Domains',
      value: 'Mailyte paces every domain',
      options: ['Mailyte paces every domain', 'Custom domain rate limits', 'No domain pacing'],
    },
    {
      id: 'per_person',
      label: 'Per person',
      value: 'Up to 2 emails a day, 6 a week',
      options: ['Up to 2 emails a day, 6 a week', 'Up to 1 email a day, 3 a week', 'Up to 3 emails a day, 10 a week', 'Unlimited'],
    },
    {
      id: 'speed',
      label: 'Speed',
      value: 'As fast as your account allows',
      options: ['As fast as your account allows', 'Paced: max 500 emails/hour', 'Paced: max 1,000 emails/hour'],
    },
    {
      id: 'quiet_hours',
      label: 'Quiet hours',
      value: 'Held 21:00–08:00',
      options: ['Held 21:00–08:00', 'Held 22:00–07:00', 'Held 20:00–09:00', 'No quiet hours'],
    },
    {
      id: 'days',
      label: 'Days',
      value: 'Every day',
      options: ['Every day', 'Weekdays only (Mon–Fri)', 'Exclude Sundays'],
    },
    {
      id: 'timezone',
      label: 'Timezone',
      value: 'Africa/Lagos',
      options: ['Africa/Lagos', 'Europe/London', 'America/New_York', 'America/Los_Angeles', 'Asia/Dubai'],
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  if (!isOpen) return null;

  const startEdit = (rule: RuleItem) => {
    setEditingId(rule.id);
    setTempValue(rule.value);
  };

  const saveEdit = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, value: tempValue } : r))
    );
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 pt-6 pb-2 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">Sending rules</h2>
            <p className="text-xs text-gray-500 mt-1">
              We warm up your sending for you. Nothing to set.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rules Table matching Screenshot image_b0e82b1a.png */}
        <div className="p-6 pt-3">
          <div className="divide-y divide-gray-100 border-t border-b border-gray-100">
            {rules.map((rule) => {
              const isEditing = editingId === rule.id;

              return (
                <div
                  key={rule.id}
                  className="py-3.5 flex items-center justify-between text-xs sm:text-sm gap-4"
                >
                  <span className="font-semibold text-gray-900 w-28 shrink-0">
                    {rule.label}
                  </span>

                  <div className="flex-1 text-gray-600 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        {rule.options ? (
                          <select
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-full px-2 py-1 border border-indigo-500 rounded text-xs bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            autoFocus
                          >
                            {rule.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={tempValue}
                            onChange={(e) => setTempValue(e.target.value)}
                            className="w-full px-2 py-1 border border-indigo-500 rounded text-xs bg-white text-gray-900 focus:outline-none"
                            autoFocus
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => saveEdit(rule.id)}
                          className="px-2 py-1 bg-indigo-600 text-white rounded text-xs font-semibold hover:bg-indigo-700 cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-700">{rule.value}</span>
                    )}
                  </div>

                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => startEdit(rule)}
                      className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer shrink-0"
                    >
                      Change
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
