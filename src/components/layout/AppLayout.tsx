import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Lightbulb,
  ChevronDown,
  LayoutDashboard,
  Settings2,
  Calendar,
  Send,
  FlaskConical,
  Megaphone,
  Mail,
  Zap,
  Users,
  FileText,
  LayoutTemplate,
  Activity,
  BarChart3,
  ArrowDownToLine,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  X,
  Code,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  onOpenCodeModal?: () => void;
  viewMode?: 'revamped' | 'original';
  onToggleViewMode?: (mode: 'revamped' | 'original') => void;
}

export default function AppLayout({
  children,
  onOpenCodeModal,
  viewMode = 'revamped',
  onToggleViewMode,
}: AppLayoutProps) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(true);
  const [marketingExpanded, setMarketingExpanded] = useState(true);

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900 flex font-sans antialiased">
      {/* Mailyte Left Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } border-r border-gray-200/90 bg-white flex flex-col justify-between shrink-0 transition-all duration-200 select-none hidden md:flex`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo & Brand Header */}
          <div className="h-16 px-5 border-b border-gray-100 flex items-center justify-between">
            <Link to="/dashboard/automations" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                M
              </div>
              {!collapsed && (
                <div className="flex items-baseline gap-1">
                  <span className="font-bold text-lg text-gray-900 tracking-tight">Mailyte</span>
                </div>
              )}
            </Link>
          </div>

          {/* Org Profile Selector */}
          {!collapsed && (
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <button
                type="button"
                className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-gray-100/80 transition-colors text-left"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    BR
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">Bunky Rabbit</p>
                    <p className="text-[11px] text-gray-400">owner</p>
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-sm font-medium">
            <NavItem icon={LayoutDashboard} label="Dashboard" href="/dashboard" collapsed={collapsed} />
            <NavItem icon={Settings2} label="Mail Setup" href="/dashboard/mail-setup" collapsed={collapsed} hasSub />
            <NavItem icon={Calendar} label="Calendar" href="/dashboard/calendar" collapsed={collapsed} />
            <NavItem icon={Send} label="Sending" href="/dashboard/sending" collapsed={collapsed} />
            <NavItem icon={FlaskConical} label="Sandbox" href="/dashboard/sandbox" collapsed={collapsed} />

            {/* Marketing Section (Expanded) */}
            <div className="pt-2">
              {!collapsed && (
                <button
                  type="button"
                  onClick={() => setMarketingExpanded(!marketingExpanded)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 rounded-lg"
                >
                  <span className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-indigo-600" />
                    Marketing
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transform transition-transform ${
                      marketingExpanded ? '' : '-rotate-90'
                    }`}
                  />
                </button>
              )}
              {(marketingExpanded || collapsed) && (
                <div className={`space-y-0.5 ${!collapsed ? 'pl-6 mt-1' : ''}`}>
                  <NavItem icon={Layers} label="Overview" href="/dashboard/marketing" collapsed={collapsed} subItem />
                  <NavItem icon={Mail} label="Campaigns" href="/dashboard/campaigns" collapsed={collapsed} subItem />
                  <NavItem
                    icon={Zap}
                    label="Automations"
                    href="/dashboard/automations"
                    active
                    collapsed={collapsed}
                    subItem
                  />
                  <NavItem icon={Users} label="Contacts" href="/dashboard/contacts" collapsed={collapsed} subItem />
                  <NavItem icon={FileText} label="Forms" href="/dashboard/forms" collapsed={collapsed} subItem />
                  <NavItem icon={LayoutTemplate} label="Templates" href="/dashboard/templates" collapsed={collapsed} subItem />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-gray-100 my-2">
              <NavItem icon={Activity} label="Email Activity" href="/dashboard/activity" collapsed={collapsed} hasSub />
              <NavItem icon={BarChart3} label="Usage Reports" href="/dashboard/usage" collapsed={collapsed} />
              <NavItem icon={ArrowDownToLine} label="Import & export" href="/dashboard/import-export" collapsed={collapsed} />
            </div>
          </nav>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="p-3 border-t border-gray-100 space-y-1">
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100/70 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Right Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar Header */}
        <header className="h-14 border-b border-gray-200/90 bg-white px-6 flex items-center justify-between sticky top-0 z-20 select-none">
          {/* Search Box */}
          <div className="flex items-center gap-3">
            <div className="relative w-64 md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-10 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-indigo-600 transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono border border-gray-200 bg-white px-1.5 py-0.5 rounded text-gray-400">
                ⌘K
              </span>
            </div>
          </div>

          {/* Header Action Icons & User Profile matching authentic Mailyte UI */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button
              type="button"
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 absolute top-1.5 right-1.5" />
            </button>

            {/* Feature tips / Lightbulb */}
            <button
              type="button"
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              title="Feature Guides & Tips"
            >
              <Lightbulb className="w-4 h-4" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
              title="Toggle theme"
            >
              <Moon className="w-4 h-4" />
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-1 cursor-pointer select-none">
              <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold text-xs">
                BR
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <span className="block text-xs font-semibold text-gray-900">Bunky Rabbit</span>
                <span className="block text-[10px] text-gray-400 capitalize">Owner</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Contextual Announcement Banner based on Page Route */}
        {bannerVisible && (() => {
          let bannerText = '';
          let actionLabel = 'Read it here';
          let actionHref = '#guide';

          if (location.pathname === '/dashboard/automations/new') {
            bannerText = 'Not sure which to pick? The guide says what each ready-made journey does and what it needs from you.';
            actionLabel = 'Compare them';
          } else if (
            location.pathname.startsWith('/dashboard/automations/') &&
            location.pathname !== '/dashboard/automations'
          ) {
            bannerText = 'Changing a live journey never moves the people already in it. The guide explains why, and how to read the report.';
            actionLabel = 'Read it here';
          } else if (location.pathname === '/dashboard/automations') {
            bannerText = 'A journey runs by itself for each person who starts it. The guide explains every step and the rules they all follow.';
            actionLabel = 'Read it here';
          }

          if (!bannerText) return null;

          return (
            <div className="bg-indigo-50/60 border-b border-indigo-100/80 px-6 py-2.5 text-xs text-indigo-950 flex items-center justify-between select-none">
              <div className="flex items-center gap-2">
                <span className="text-indigo-600">📖</span>
                <span>{bannerText}</span>
                <a
                  href={actionHref}
                  className="font-semibold text-indigo-700 hover:text-indigo-900 underline inline-flex items-center gap-0.5 ml-1"
                >
                  {actionLabel} <ArrowRight className="w-3 h-3" />
                </a>
              </div>
              <button
                type="button"
                onClick={() => setBannerVisible(false)}
                className="text-gray-400 hover:text-gray-700 p-0.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })()}

        {/* Page Content Body */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  href,
  active = false,
  collapsed = false,
  subItem = false,
  hasSub = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  active?: boolean;
  collapsed?: boolean;
  subItem?: boolean;
  hasSub?: boolean;
}) {
  return (
    <Link
      to={href}
      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
        active
          ? 'bg-indigo-50/80 text-indigo-700 font-semibold'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/70 font-medium'
      }`}
      title={label}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-600' : 'text-gray-400'}`} />
        {!collapsed && <span className="truncate">{label}</span>}
      </div>
      {!collapsed && hasSub && <ChevronDown className="w-3 h-3 text-gray-400" />}
    </Link>
  );
}
