import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AutomationsList from './components/dashboard/AutomationsList';
import RecipeGalleryRevamped from './components/new-automation/RecipeGalleryRevamped';
import RecipeGalleryOriginal from './components/new-automation/RecipeGalleryOriginal';
import RecipeDetailPreview from './components/new-automation/RecipeDetailPreview';
import CreateFromScratch from './components/new-automation/CreateFromScratch';
import AutomationCanvas from './components/builder/AutomationCanvas';
import CodeExportModal from './components/modals/CodeExportModal';
import { Automation, Recipe } from './types/automation';
import { INITIAL_AUTOMATIONS, RECIPES, TRIGGER_CATALOG } from './data/mockData';

export default function App() {
  const [automations, setAutomations] = useState<Automation[]>(INITIAL_AUTOMATIONS);
  const [viewMode, setViewMode] = useState<'revamped' | 'original'>('revamped');
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  const handleCreateFromRecipe = (recipe: Recipe, customName?: string): string => {
    const newId = `auto-${Date.now()}`;
    const newAutomation: Automation = {
      id: newId,
      name: customName || recipe.name,
      state: 'draft',
      triggerType: recipe.steps[0]?.config.triggerType || 'trigger.list_joined',
      stepsCount: recipe.steps.length,
      contactsCount: 0,
      updatedAt: 'Just now',
      recipeId: recipe.id,
      steps: JSON.parse(JSON.stringify(recipe.steps)),
    };

    setAutomations((prev) => [newAutomation, ...prev]);
    return newId;
  };

  const handleCreateFromScratch = (name: string, triggerId: string): string => {
    const newId = `auto-${Date.now()}`;
    const matchedTrigger = TRIGGER_CATALOG.find((t) => t.id === triggerId);
    const triggerStep = {
      id: `step-trigger-${Date.now()}`,
      type: 'trigger' as const,
      title: matchedTrigger ? matchedTrigger.title : 'Joined a list',
      subtitle: matchedTrigger ? matchedTrigger.description : 'Configured trigger entry point',
      config: { triggerType: triggerId, listName: 'Newsletter Subscribers' },
    };
    const welcomeEmail = {
      id: `step-email-${Date.now()}`,
      type: 'action.email' as const,
      title: 'Send an email',
      subtitle: '"Welcome aboard, {{ contact.name }}"',
      config: {
        senderId: 'sender-1',
        mode: 'quick' as const,
        subject: 'Welcome aboard, {{ contact.name }}',
        message: 'Hello {{ contact.name }},\n\nThank you for connecting with us! Let us know if you need any assistance.',
        includeUnsubscribe: true,
      },
    };
    const endStep = {
      id: `step-end-${Date.now()}`,
      type: 'action.end' as const,
      title: 'End the journey',
      subtitle: 'The journey ends here',
      config: {},
    };

    const newAutomation: Automation = {
      id: newId,
      name: name || 'Untitled Journey',
      state: 'draft',
      triggerType: triggerId,
      stepsCount: 3,
      contactsCount: 0,
      updatedAt: 'Just now',
      steps: [triggerStep, welcomeEmail, endStep],
    };

    setAutomations((prev) => [newAutomation, ...prev]);
    return newId;
  };

  const handleUpdateAutomation = (updated: Automation) => {
    setAutomations((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations((prev) => prev.filter((a) => a.id !== id));
  };

  const handleArchiveAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, state: 'archived' as const } : a))
    );
  };

  const handleTogglePause = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return {
            ...a,
            state: a.state === 'live' ? ('paused' as const) : ('live' as const),
          };
        }
        return a;
      })
    );
  };

  return (
    <BrowserRouter>
      <AppLayout
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/automations" replace />} />

          <Route
            path="/dashboard/automations"
            element={
              <AutomationsList
                automations={automations}
                onDeleteAutomation={handleDeleteAutomation}
                onArchiveAutomation={handleArchiveAutomation}
                onTogglePauseAutomation={handleTogglePause}
              />
            }
          />

          <Route
            path="/dashboard/automations/new"
            element={
              viewMode === 'revamped' ? (
                <NewAutomationRevampedRoute onCreateFromRecipe={handleCreateFromRecipe} />
              ) : (
                <NewAutomationOriginalRoute
                  onCreateFromRecipe={handleCreateFromRecipe}
                  onCreateFromScratch={handleCreateFromScratch}
                />
              )
            }
          />

          <Route
            path="/dashboard/automations/templates/:id"
            element={
              <RecipeDetailRoute onCreateFromRecipe={handleCreateFromRecipe} />
            }
          />

          <Route
            path="/dashboard/automations/from-scratch"
            element={
              <CreateFromScratchRoute onCreateFromScratch={handleCreateFromScratch} />
            }
          />

          <Route
            path="/dashboard/automations/:id"
            element={
              <AutomationCanvasRoute
                automations={automations}
                onUpdateAutomation={handleUpdateAutomation}
                onToggleStatus={handleTogglePause}
                onDeleteAutomation={handleDeleteAutomation}
              />
            }
          />

          {/* Catch-all redirect to automations */}
          <Route path="*" element={<Navigate to="/dashboard/automations" replace />} />
        </Routes>
      </AppLayout>

      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </BrowserRouter>
  );
}

// Sub-route wrappers with navigation hooks
function NewAutomationRevampedRoute({
  onCreateFromRecipe,
}: {
  onCreateFromRecipe: (recipe: Recipe) => string;
}) {
  const navigate = useNavigate();
  return (
    <RecipeGalleryRevamped
      onSelectRecipe={(recipe) => {
        navigate(`/dashboard/automations/templates/${recipe.id}`);
      }}
    />
  );
}

function NewAutomationOriginalRoute({
  onCreateFromRecipe,
  onCreateFromScratch,
}: {
  onCreateFromRecipe: (recipe: Recipe, name?: string) => string;
  onCreateFromScratch: (name: string, triggerId: string) => string;
}) {
  const navigate = useNavigate();
  return (
    <RecipeGalleryOriginal
      onUseRecipe={(recipe, name) => {
        const id = onCreateFromRecipe(recipe, name);
        navigate(`/dashboard/automations/${id}`);
      }}
      onCreateScratch={(name, triggerId) => {
        const id = onCreateFromScratch(name, triggerId);
        navigate(`/dashboard/automations/${id}`);
      }}
    />
  );
}

function RecipeDetailRoute({
  onCreateFromRecipe,
}: {
  onCreateFromRecipe: (recipe: Recipe, name?: string) => string;
}) {
  const navigate = useNavigate();
  return (
    <RecipeDetailPreview
      onUseRecipe={(recipe, customName) => {
        const id = onCreateFromRecipe(recipe, customName);
        navigate(`/dashboard/automations/${id}`);
      }}
    />
  );
}

function CreateFromScratchRoute({
  onCreateFromScratch,
}: {
  onCreateFromScratch: (name: string, triggerId: string) => string;
}) {
  const navigate = useNavigate();
  return (
    <CreateFromScratch
      onCreateScratch={(name, triggerId) => {
        const id = onCreateFromScratch(name, triggerId);
        navigate(`/dashboard/automations/${id}`);
      }}
    />
  );
}

function AutomationCanvasRoute({
  automations,
  onUpdateAutomation,
  onToggleStatus,
  onDeleteAutomation,
}: {
  automations: Automation[];
  onUpdateAutomation: (updated: Automation) => void;
  onToggleStatus: (id: string) => void;
  onDeleteAutomation: (id: string) => void;
}) {
  const { id } = useParams<{ id: string }>();
  const automation = automations.find((a) => a.id === id) || automations[0];

  if (!automation) {
    return <Navigate to="/dashboard/automations" replace />;
  }

  return (
    <AutomationCanvas
      automation={automation}
      onUpdateAutomation={onUpdateAutomation}
      onToggleStatus={onToggleStatus}
      onDeleteAutomation={onDeleteAutomation}
    />
  );
}
