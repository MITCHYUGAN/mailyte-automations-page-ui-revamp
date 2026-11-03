import React from 'react';
import { User, Mail, Calendar, Sparkles } from 'lucide-react';

export interface TokenMetadata {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const TOKEN_DICTIONARY: Record<string, TokenMetadata> = {
  'contact.name': { key: 'contact.name', label: 'Contact Name', icon: User },
  'contact.email': { key: 'contact.email', label: 'Contact Email', icon: Mail },
  'event_title': { key: 'event_title', label: 'Event Title', icon: Calendar },
};

export function TokenPill({
  tokenKey,
  size = 'sm',
}: {
  tokenKey: string;
  size?: 'sm' | 'xs';
}) {
  const cleanKey = tokenKey.replace(/\{\{\s*|\s*\}\}/g, '').trim();
  const meta = TOKEN_DICTIONARY[cleanKey];

  if (!meta) {
    return (
      <span className="inline-flex items-center px-1.5 py-0.5 rounded border border-gray-200 bg-gray-100 text-gray-700 font-mono text-[11px] select-none align-middle mx-0.5">
        {cleanKey}
      </span>
    );
  }

  const Icon = meta.icon;
  const isXs = size === 'xs';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 text-gray-700 font-medium select-none align-middle shadow-2xs mx-0.5 ${
        isXs ? 'px-1.5 py-0.2 text-[10px]' : 'px-2 py-0.5 text-xs'
      }`}
    >
      <Icon className={isXs ? 'w-2.5 h-2.5 text-gray-500' : 'w-3 h-3 text-gray-500'} />
      <span>{meta.label}</span>
    </span>
  );
}

/**
 * Replaces any {{ token }} occurrence in raw string with inline TokenPill components
 */
export function renderWithPills(text: string | undefined | null, size: 'sm' | 'xs' = 'sm'): React.ReactNode {
  if (!text) return null;
  const regex = /(\{\{[^{}]+\}\})/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      return <TokenPill key={index} tokenKey={part} size={size} />;
    }
    return <span key={index}>{part}</span>;
  });
}
