import React, { useState } from 'react';
import { X, Copy, Check, FileCode, Terminal, Download, Layers } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FILES = [
  {
    id: 'nextjs-new-page',
    title: 'app/dashboard/automations/new/page.tsx',
    description: 'Next.js 14/15 App Router page replacing the cramped layout with the spacious Mailchimp-inspired flow',
    content: `'use client';

import { useState } from 'react';
import RecipeGalleryRevamped from '@/components/dashboard/automations/RecipeGalleryRevamped';
import RecipeDetailPreview from '@/components/dashboard/automations/RecipeDetailPreview';
import CreateFromScratch from '@/components/dashboard/automations/CreateFromScratch';
import { useRouter } from 'next/navigation';
import { Recipe } from '@/types/automation';

export default function NewAutomationPage() {
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [mode, setMode] = useState<'gallery' | 'preview' | 'scratch'>('gallery');

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setMode('preview');
  };

  const handleUseRecipe = (recipe: Recipe, customName?: string) => {
    // Call existing automationsApi.create(...) here
    router.push(\`/dashboard/automations/draft\`);
  };

  const handleCreateScratch = (name: string, triggerId: string) => {
    // Call existing automationsApi.create({ name, graph: blankGraph(triggerId) })
    router.push(\`/dashboard/automations/draft\`);
  };

  if (mode === 'scratch') {
    return <CreateFromScratch onCreateScratch={handleCreateScratch} onBack={() => setMode('gallery')} />;
  }

  if (mode === 'preview' && selectedRecipe) {
    return (
      <RecipeDetailPreview
        recipe={selectedRecipe}
        onUseRecipe={handleUseRecipe}
        onBack={() => setMode('gallery')}
      />
    );
  }

  return (
    <RecipeGalleryRevamped
      onSelectRecipe={handleSelectRecipe}
      onStartScratch={() => setMode('scratch')}
    />
  );
}`,
  },
  {
    id: 'token-input',
    title: 'src/components/common/TokenInput.tsx',
    description: 'The visual dynamic token field with {{ contact.name }} pills and quick-insert buttons',
    content: `import React, { useState, useRef } from 'react';
import { Calendar, User, Mail, Code2 } from 'lucide-react';

export const tokenConfig = {
  'event_title': { label: 'Event Title', icon: Calendar },
  'contact.name': { label: 'Contact Name', icon: User },
  'contact.email': { label: 'Contact Email', icon: Mail }
};

export const renderTokenizedContent = (text: string) => {
  if (!text) return null;
  const regex = /(\{\{[^{}]+\}\})/g;
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      const tokenKey = part.replace(/\{\{\\s*|\\s*\}\}/g, '').trim();
      const config = (tokenConfig as any)[tokenKey];

      if (config) {
        const IconComponent = config.icon;
        return (
          <span
            key={index}
            className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 rounded border border-gray-200 bg-gray-50 text-gray-700 text-xs font-medium shadow-xs select-none align-middle"
          >
            <IconComponent className="w-3 h-3 text-indigo-500" />
            <span>{config.label}</span>
          </span>
        );
      }
      return (
        <span key={index} className="inline-flex items-center px-1.5 py-0.2 mx-1 rounded border border-gray-200 bg-gray-50 text-gray-600 text-xs font-mono">
          {tokenKey}
        </span>
      );
    }
    return <span key={index} className="text-gray-900 text-sm whitespace-pre-wrap">{part}</span>;
  });
};

export default function TokenInput({ value, onChange, label, required, multiline = false, rows = 4 }: any) {
  const inputRef = useRef<any>(null);

  const insertToken = (token: string) => {
    const el = inputRef.current;
    if (!el) {
      onChange((value || '') + ' ' + token + ' ');
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const updated = value.substring(0, start) + token + ' ' + value.substring(end);
    onChange(updated);
  };

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="border border-gray-300 rounded-lg bg-white focus-within:border-indigo-600 focus-within:ring-2 focus-within:ring-indigo-500/15">
        {multiline ? (
          <div>
            <textarea
              ref={inputRef}
              rows={rows}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-900 bg-transparent rounded-lg focus:outline-none resize-y"
            />
            {value?.includes('{{') && (
              <div className="px-3 py-2 bg-gray-50/80 border-t border-gray-100 rounded-b-lg text-xs">
                {renderTokenizedContent(value)}
              </div>
            )}
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm text-gray-900 bg-transparent rounded-lg focus:outline-none"
          />
        )}
      </div>
      <div className="flex items-center gap-1.5 pt-0.5 text-xs text-gray-500">
        <span>Insert:</span>
        <button type="button" onClick={() => insertToken('{{ contact.name }}')} className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-medium text-gray-700">
          their name
        </button>
        <button type="button" onClick={() => insertToken('{{ contact.email }}')} className="px-2 py-0.5 rounded border border-gray-200 bg-white hover:bg-gray-50 text-[11px] font-medium text-gray-700">
          their email
        </button>
      </div>
    </div>
  );
}`,
  },
  {
    id: 'flow-animation',
    title: 'AutomationFlowAnimation.tsx',
    description: 'The authentic Mailyte journey flow animation with contact traveler and illuminated nodes',
    content: `import React from 'react';
import { Zap, Clock, Mail, GitBranch, Target, User } from 'lucide-react';

export default function AutomationFlowAnimation() {
  return (
    <div className="rounded-xl bg-gray-50/70 border border-gray-200/60 px-5 py-6 sm:px-8 w-full max-w-xl shadow-xs">
      <div
        className="automation-flow relative"
        aria-hidden="true"
        style={{ '--flow-duration': '9s', '--flow-offset': '0s' } as any}
      >
        <div className="absolute left-0 right-0 bg-gray-200/80 top-5 h-0.5" />
        <div className="automation-traveller absolute -translate-x-1/2 rounded-full bg-indigo-600 text-white top-5 flex h-5 w-5 -translate-y-1/2 items-center justify-center shadow-md z-10">
          <User className="w-2.5 h-2.5 stroke-[2.5]" />
        </div>

        <ol className="relative flex items-start justify-between">
          <li className="flex flex-col items-center" style={{ '--node-at': '0s' } as any}>
            <span className="automation-node flex items-center justify-center bg-gray-100 text-gray-600 h-10 w-10 rounded-lg border border-transparent">
              <Zap className="w-4 h-4 stroke-[2]" />
            </span>
          </li>
          <li className="flex flex-col items-center" style={{ '--node-at': '1.44s' } as any}>
            <span className="automation-node flex items-center justify-center bg-gray-100 text-gray-600 h-10 w-10 rounded-lg border border-transparent">
              <Clock className="w-4 h-4 stroke-[2]" />
            </span>
          </li>
          <li className="flex flex-col items-center" style={{ '--node-at': '2.88s' } as any}>
            <span data-email="true" className="automation-node flex items-center justify-center bg-gray-100 text-gray-600 h-10 w-10 rounded-lg border border-transparent">
              <Mail className="w-4 h-4 stroke-[2]" />
            </span>
          </li>
          <li className="flex flex-col items-center" style={{ '--node-at': '4.32s' } as any}>
            <span className="automation-node flex items-center justify-center bg-gray-100 text-gray-600 h-10 w-10 rounded-lg border border-transparent">
              <Clock className="w-4 h-4 stroke-[2]" />
            </span>
          </li>
          <li className="flex flex-col items-center" style={{ '--node-at': '5.76s' } as any}>
            <span className="automation-node flex items-center justify-center bg-gray-100 text-gray-600 h-10 w-10 rounded-lg border border-transparent">
              <GitBranch className="w-4 h-4 stroke-[2]" />
            </span>
          </li>
          <li className="flex flex-col items-center" style={{ '--node-at': '7.2s' } as any}>
            <span data-email="true" className="automation-node flex items-center justify-center bg-gray-100 text-gray-600 h-10 w-10 rounded-lg border border-transparent">
              <Mail className="w-4 h-4 stroke-[2]" />
            </span>
          </li>
          <li className="flex flex-col items-center" style={{ '--node-at': '8.64s' } as any}>
            <span className="automation-node flex items-center justify-center bg-gray-100 text-gray-600 h-10 w-10 rounded-lg border border-transparent">
              <Target className="w-4 h-4 stroke-[2]" />
            </span>
          </li>
        </ol>
      </div>

      <div className="mt-3.5 flex justify-between text-[10px] font-semibold uppercase tracking-wider text-gray-400 select-none">
        <span>Starts a checkout</span>
        <span>Reminded</span>
        <span>Converted</span>
      </div>
    </div>
  );
}`,
  },
  {
    id: 'local-setup-instructions',
    title: 'How to run locally (Vite or Next.js)',
    description: 'Step-by-step instructions to integrate this improved flow into your local codebase',
    content: `# How to run this Mailyte Automations Flow locally

## Option A: In a fresh Vite React project
1. Run in terminal:
   npm create vite@latest mailyte-automations -- --template react-ts
   cd mailyte-automations

2. Install dependencies:
   npm install lucide-react react-router-dom
   npm install -D tailwindcss @tailwindcss/vite

3. Copy the files from /src into your project:
   - /src/components/new-automation/RecipeGalleryRevamped.tsx
   - /src/components/new-automation/RecipeDetailPreview.tsx
   - /src/components/new-automation/CreateFromScratch.tsx
   - /src/components/builder/AutomationCanvas.tsx
   - /src/components/common/TokenInput.tsx

4. Run:
   npm run dev
   Visit http://localhost:5173/dashboard/automations

## Option B: In the Mailyte Next.js webapp repo
1. Place RecipeGalleryRevamped.tsx into:
   components/dashboard/automations/RecipeGalleryRevamped.tsx

2. Place RecipeDetailPreview.tsx into:
   components/dashboard/automations/RecipeDetailPreview.tsx

3. Place CreateFromScratch.tsx into:
   components/dashboard/automations/CreateFromScratch.tsx

4. Update app/dashboard/automations/new/page.tsx with the modular flow shown in the 'nextjs-new-page' tab above.
`,
  },
];

export default function CodeExportModal({ isOpen, onClose }: CodeExportModalProps) {
  const [selectedFileId, setSelectedFileId] = useState(FILES[0].id);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = FILES.find((f) => f.id === selectedFileId) || FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Export Components for Local Project</h2>
              <p className="text-xs text-gray-500">
                Copy individual components or page files directly into your local Mailyte codebase
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="px-6 py-2 bg-gray-100/70 border-b border-gray-200 flex items-center gap-2 overflow-x-auto">
          {FILES.map((file) => (
            <button
              key={file.id}
              type="button"
              onClick={() => setSelectedFileId(file.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFileId === file.id
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {file.title}
            </button>
          ))}
        </div>

        {/* Code View Area */}
        <div className="flex-1 overflow-hidden flex flex-col p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs text-gray-900">{currentFile.title}</h4>
              <p className="text-[11px] text-gray-500">{currentFile.description}</p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy File Content
                </>
              )}
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-gray-950 text-gray-100 rounded-xl p-4 font-mono text-xs leading-relaxed border border-gray-800">
            <pre>{currentFile.content}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>All components are written in clean TypeScript + Tailwind CSS without external lock-in.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
