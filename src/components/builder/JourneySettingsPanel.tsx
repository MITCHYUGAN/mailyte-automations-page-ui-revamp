import React, { useState } from 'react';
import { X, Plus, Info, ExternalLink } from 'lucide-react';
import { Automation } from '../../types/automation';

interface JourneySettingsPanelProps {
  automation: Automation;
  onUpdateAutomation: (updated: Automation) => void;
  onClose: () => void;
  onOpenSendingRules: () => void;
}

export default function JourneySettingsPanel({
  automation,
  onUpdateAutomation,
  onClose,
  onOpenSendingRules,
}: JourneySettingsPanelProps) {
  const [reentryFrequency, setReentryFrequency] = useState<'once' | 'every_time' | 'after_delay'>('once');
  const [emailKind, setEmailKind] = useState<'marketing' | 'service'>('marketing');
  const [trackClicks, setTrackClicks] = useState(true);
  const [trackOpens, setTrackOpens] = useState(true);
  const [leaveOnUnsubscribe, setLeaveOnUnsubscribe] = useState(true);
  const [leaveOnReply, setLeaveOnReply] = useState(false);
  const [customEvents, setCustomEvents] = useState<string[]>([]);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventName, setNewEventName] = useState('');

  const handleAddEvent = () => {
    if (newEventName.trim()) {
      setCustomEvents([...customEvents, newEventName.trim()]);
      setNewEventName('');
      setIsAddingEvent(false);
    }
  };

  return (
    <aside className="h-full bg-white border-l border-gray-200/90 flex flex-col overflow-hidden text-xs">
      {/* Top Header */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <h2 className="text-sm font-bold text-gray-900">Settings</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Scrollable Body matching screenshot image_f5c6013f.png */}
      <div className="p-6 overflow-y-auto space-y-6 flex-1 text-gray-800">
        {/* Section 1: How often can someone go through this? */}
        <div className="space-y-3">
          <label className="font-semibold text-gray-900 block">
            How often can someone go through this?
          </label>

          <div className="space-y-3">
            {/* Option 1: Once only */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="reentry"
                value="once"
                checked={reentryFrequency === 'once'}
                onChange={() => setReentryFrequency('once')}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-gray-900 block">Once only</span>
                <span className="text-gray-500 leading-relaxed block">
                  The usual choice. Someone who has been through it never enters again.
                </span>
              </div>
            </label>

            {/* Option 2: Every time */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="reentry"
                value="every_time"
                checked={reentryFrequency === 'every_time'}
                onChange={() => setReentryFrequency('every_time')}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-gray-900 block">Every time it starts for them</span>
                <span className="text-gray-500 leading-relaxed block">
                  For things like an abandoned cart, where each time is a new situation.
                </span>
              </div>
            </label>

            {/* Option 3: Again after a while */}
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="radio"
                name="reentry"
                value="after_delay"
                checked={reentryFrequency === 'after_delay'}
                onChange={() => setReentryFrequency('after_delay')}
                className="mt-0.5 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-gray-900 block">Again after a while</span>
                <span className="text-gray-500 leading-relaxed block">
                  They can go through again once this much time has passed.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Section 2: What kind of emails are these? */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <label className="font-semibold text-gray-900 block">
            What kind of emails are these?
          </label>

          <select
            value={emailKind}
            onChange={(e) => setEmailKind(e.target.value as 'marketing' | 'service')}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 cursor-pointer"
          >
            <option value="marketing">
              Marketing: offers, newsletters, nurturing (includes an unsubscribe link)
            </option>
            <option value="service">
              Service: receipts, appointment reminders, account notices (no unsubscribe)
            </option>
          </select>

          {/* Tracking Checkboxes */}
          <div className="space-y-2.5 pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
              <input
                type="checkbox"
                checked={trackClicks}
                onChange={(e) => setTrackClicks(e.target.checked)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              Track clicks
            </label>

            <div className="space-y-1">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
                <input
                  type="checkbox"
                  checked={trackOpens}
                  onChange={(e) => setTrackOpens(e.target.checked)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                Track opens
              </label>
              <p className="text-[11px] text-gray-500 pl-5 leading-normal">
                Cold emails land better without it.
              </p>
              <p className="text-[11px] text-gray-500 pl-5 leading-normal">
                Starts with the next email. Steps that wait for an open or a click need it tracked.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
            Choose Service only for emails a person needs, like a receipt or an appointment reminder. Marketing needs your marketing sender approval, carries an unsubscribe link, and counts towards how much marketing one person may receive. This is set once for the whole journey: if one email is genuinely different, it belongs in a journey of its own.
          </p>

          {/* Callout Info Box */}
          <div className="p-3 rounded-xl border border-gray-200/90 bg-gray-50/60 text-[11px] text-gray-600 leading-relaxed">
            How many marketing emails one person may get, quiet hours and sending days apply to every automation. Set them once under{' '}
            <button
              type="button"
              onClick={onOpenSendingRules}
              className="text-indigo-600 underline font-semibold hover:text-indigo-800 cursor-pointer inline-flex items-center gap-0.5"
            >
              Sending rules
            </button>{' '}
            on the automations list. Each email step can choose to send during quiet hours anyway, or to hold rather than skip when someone has had enough.
          </div>
        </div>

        {/* Section 3: People leave the journey early when… */}
        <div className="space-y-3 pt-2 border-t border-gray-100">
          <label className="font-semibold text-gray-900 block">
            People leave the journey early when…
          </label>

          <div className="space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={leaveOnUnsubscribe}
                onChange={(e) => setLeaveOnUnsubscribe(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-gray-900 block">they unsubscribe</span>
                <span className="text-gray-500 text-[11px] block">
                  (marketing emails always stop; this also stops the other steps)
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={leaveOnReply}
                onChange={(e) => setLeaveOnReply(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <div className="space-y-0.5">
                <span className="font-semibold text-gray-900 block">they reply to one of its emails</span>
                <span className="text-gray-500 text-[11px] block">
                  (a human wrote back; auto-replies are ignored)
                </span>
              </div>
            </label>

            {/* Custom App Events */}
            <div className="space-y-1.5 pt-1">
              <p className="text-gray-700">
                something happens in your app (an event your developer sends):
              </p>

              {customEvents.map((evt, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-200">
                  <span className="font-mono text-gray-800 text-[11px]">{evt}</span>
                  <button
                    type="button"
                    onClick={() => setCustomEvents(customEvents.filter((_, i) => i !== idx))}
                    className="text-gray-400 hover:text-red-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {isAddingEvent ? (
                <div className="flex items-center gap-1.5 pt-1">
                  <input
                    type="text"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    placeholder="e.g. checkout_completed"
                    className="flex-1 px-2.5 py-1.5 border border-indigo-500 rounded text-xs bg-white text-gray-900 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddEvent}
                    className="px-2.5 py-1.5 bg-indigo-600 text-white rounded font-semibold text-xs hover:bg-indigo-700 cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingEvent(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer px-1"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingEvent(true)}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer pt-0.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add one
                </button>
              )}

              <p className="text-[11px] text-gray-500 leading-normal">
                Checked the moment it happens and again before every step. A “Goal reached” step does the same and counts it as a success.
              </p>
            </div>

            {/* Segment match exit */}
            <div className="space-y-1 pt-2">
              <p className="text-gray-700">they match a segment:</p>
              <div className="p-2.5 rounded-lg border border-gray-200 bg-gray-50/70 flex items-center justify-between text-[11px]">
                <span className="font-medium text-gray-800">
                  Launch waitlist: Send me other marketing emails too
                </span>
                <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold uppercase text-[9px] border border-indigo-100">
                  Yes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
