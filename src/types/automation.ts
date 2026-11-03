/**
 * Core Automation & Journey Types for Mailyte
 */

export type AutomationState = 'draft' | 'live' | 'paused' | 'archived';
export type AutomationSort = 'recent' | 'name' | 'busiest';

export interface AutomationStep {
  id: string;
  type: 'trigger' | 'action.email' | 'rule.delay' | 'rule.condition' | 'action.tag' | 'action.end';
  title: string;
  subtitle?: string;
  config: {
    // Email config
    senderId?: string;
    senderName?: string;
    mode?: 'quick' | 'template';
    subject?: string;
    message?: string;
    includeUnsubscribe?: boolean;
    // Delay config
    delayDays?: number;
    delayHours?: number;
    // Trigger config
    listId?: string;
    listName?: string;
    triggerType?: string;
    // Tag config
    tag?: string;
    // Condition config
    conditionType?: 'opened_email' | 'clicked_link' | 'has_tag';
  };
  hasError?: boolean;
  errorMessage?: string;
}

export interface Automation {
  id: string;
  name: string;
  state: AutomationState;
  triggerType: string;
  stepsCount: number;
  contactsCount: number;
  updatedAt: string;
  steps: AutomationStep[];
  recipeId?: string;
}

export interface Recipe {
  id: string;
  name: string;
  tagline: string;
  category: 'Welcome' | 'Recover a sale' | 'After a purchase' | 'Win back' | 'Dates and milestones' | 'Nurture';
  durationText: string;
  description: string;
  objective: string;
  requirements: string[];
  triggerDescription: string;
  badge?: string;
  steps: AutomationStep[];
}

export interface TriggerDefinition {
  id: string;
  title: string;
  description: string;
  badge?: string;
  needsDeveloper?: boolean;
  iconName?: string;
  category?: string;
}

export interface TokenConfig {
  key: string;
  label: string;
  iconName: string;
}
