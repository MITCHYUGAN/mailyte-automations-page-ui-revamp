import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User, Mail, Calendar, Code2 } from 'lucide-react';
import { renderWithPills } from './TokenPill';

interface TokenInputProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  className?: string;
}

export { renderWithPills as renderTokenizedContent };

function tokenToHtml(tokenKey: string): string {
  const clean = tokenKey.replace(/\{\{\s*|\s*\}\}/g, '').trim();
  let label = 'Contact Name';
  let iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline text-gray-500"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

  if (clean === 'contact.email') {
    label = 'Contact Email';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline text-gray-500"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`;
  } else if (clean === 'event_title') {
    label = 'Event Title';
    iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="inline text-gray-500"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>`;
  }

  return `<span contenteditable="false" data-token="${clean}" class="inline-flex items-center gap-1 px-2 py-0.5 mx-0.5 rounded border border-gray-200 bg-gray-50 text-gray-700 text-xs font-medium select-none align-middle shadow-2xs">${iconSvg}<span>${label}</span></span>`;
}

function stringToHtml(str: string): string {
  if (!str) return '';
  const tokenRegex = /(\{\{[^{}]+\}\})/g;
  let html = str.replace(tokenRegex, (match) => tokenToHtml(match));
  html = html.replace(/\n/g, '<br>');
  return html;
}

function domToString(node: Node): string {
  let result = '';
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      result += child.textContent || '';
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const el = child as HTMLElement;
      if (el.hasAttribute('data-token')) {
        const token = el.getAttribute('data-token');
        result += `{{ ${token} }}`;
      } else if (el.tagName === 'BR') {
        result += '\n';
      } else if (el.tagName === 'DIV' || el.tagName === 'P') {
        const inner = domToString(el);
        if (result && !result.endsWith('\n')) {
          result += '\n';
        }
        result += inner;
      } else {
        result += domToString(el);
      }
    }
  });
  return result;
}

export default function TokenInput({
  value,
  onChange,
  label,
  required,
  placeholder,
  multiline = false,
}: TokenInputProps) {
  const [isRawMode, setIsRawMode] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const rawTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const lastSerializedValue = useRef<string>(value);

  // Synchronize incoming value into editor HTML only when external changes happen
  useEffect(() => {
    if (isRawMode) return;
    if (editorRef.current && value !== lastSerializedValue.current) {
      editorRef.current.innerHTML = stringToHtml(value);
      lastSerializedValue.current = value;
    }
  }, [value, isRawMode]);

  // Initial populate
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = stringToHtml(value);
      lastSerializedValue.current = value;
    }
  }, []);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const text = domToString(editorRef.current);
    lastSerializedValue.current = text;
    onChange(text);
  }, [onChange]);

  const insertToken = (tokenKey: string) => {
    if (isRawMode) {
      const el = rawTextareaRef.current;
      const tokenStr = `{{ ${tokenKey} }}`;
      if (!el) {
        onChange(value + ' ' + tokenStr + ' ');
        return;
      }
      const start = el.selectionStart ?? value.length;
      const end = el.selectionEnd ?? value.length;
      const updated = value.substring(0, start) + tokenStr + ' ' + value.substring(end);
      onChange(updated);
      setTimeout(() => {
        el.focus();
        el.setSelectionRange(start + tokenStr.length + 1, start + tokenStr.length + 1);
      }, 10);
      return;
    }

    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    const sel = window.getSelection();
    let range: Range | null = null;

    if (sel && sel.rangeCount > 0 && editor.contains(sel.anchorNode)) {
      range = sel.getRangeAt(0);
    } else {
      range = document.createRange();
      range.selectNodeContents(editor);
      range.collapse(false);
    }

    // Create pill node
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tokenToHtml(tokenKey) + '&nbsp;';
    const frag = document.createDocumentFragment();
    let node: Node | null = null;
    let lastNode: Node | null = null;
    while ((node = tempDiv.firstChild)) {
      lastNode = frag.appendChild(node);
    }

    range.deleteContents();
    range.insertNode(frag);

    // Place cursor after inserted tag
    if (lastNode && sel) {
      range = document.createRange();
      range.setStartAfter(lastNode);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-gray-800">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {multiline && (
            <button
              type="button"
              onClick={() => {
                setIsRawMode(!isRawMode);
              }}
              className="text-[11px] text-gray-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              {isRawMode ? 'Show formatted pills' : 'Edit the HTML'}
            </button>
          )}
        </div>
      )}

      {/* Editor Container */}
      <div
        className={`relative rounded-xl border transition-all bg-white shadow-2xs ${
          isFocused
            ? 'border-indigo-600 ring-2 ring-indigo-500/15'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        {isRawMode ? (
          <textarea
            ref={rawTextareaRef}
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 text-xs text-gray-900 bg-transparent rounded-xl focus:outline-none resize-y placeholder-gray-400 font-mono leading-relaxed"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            data-placeholder={placeholder}
            className={`w-full px-3.5 py-2.5 text-xs text-gray-900 bg-transparent rounded-xl focus:outline-none leading-relaxed transition-all cursor-text overflow-y-auto ${
              multiline ? 'min-h-[110px] max-h-64' : 'min-h-[38px] max-h-12 flex items-center'
            } empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400`}
          />
        )}
      </div>

      {/* Insert Token Shortcuts matching Screenshot image_d2c5a51a.png */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] text-gray-500 font-medium">Insert:</span>
        <button
          type="button"
          onClick={() => insertToken('contact.name')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium bg-white text-xs shadow-2xs transition-all cursor-pointer"
        >
          their name
        </button>
        <button
          type="button"
          onClick={() => insertToken('contact.email')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium bg-white text-xs shadow-2xs transition-all cursor-pointer"
        >
          their email
        </button>
        <button
          type="button"
          onClick={() => insertToken('event_title')}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium bg-white text-xs shadow-2xs transition-all cursor-pointer"
        >
          event title
        </button>
      </div>

      {multiline && (
        <p className="text-[11px] text-gray-400 leading-normal pt-0.5">
          Write it as you would in an email. Leave a blank line between paragraphs; we handle the formatting.
        </p>
      )}
    </div>
  );
}
