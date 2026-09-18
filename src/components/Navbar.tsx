import React from 'react';
import { Search, Bell, Cpu, HardHat, LogOut, Radio } from 'lucide-react';
import { UserSession } from '../types';

interface NavbarProps {
  user: UserSession;
  onLogout: () => void;
  onOpenSearch: () => void;
  onNavigateToAlerts: () => void;
  unreadAlertsCount: number;
  activeCamera: string;
  onChangeCamera: (camId: string) => void;
  isBackendConnected: boolean;
  onToggleMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout,
  onOpenSearch,
  onNavigateToAlerts,
  unreadAlertsCount,
  activeCamera,
  onChangeCamera,
  isBackendConnected,
  onToggleMode,
}) => {
  return (
    <header id="site-header" className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between z-30 sticky top-0 shadow-xs">
      {/* Brand & Construction Badge */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-md shadow-amber-500/20">
          <HardHat className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-wider text-slate-900 font-mono">
              SITE<span className="text-amber-600">PLATE</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-amber-100/70 text-amber-800 border border-amber-200 rounded uppercase tracking-wider font-mono">
              ANPR-CV v2.4
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium hidden md:block">
            Construction Vehicle & License Plate Security System
          </p>
        </div>
      </div>

      {/* Center Camera & Search Controls */}
      <div className="flex items-center gap-3 max-w-md w-full mx-4">
        {/* Camera Selector Dropdown */}
        <div className="hidden lg:flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          <span className="text-slate-400 font-mono">FEED:</span>
          <select
            id="camera-select"
            value={activeCamera}
            onChange={(e) => onChangeCamera(e.target.value)}
            className="bg-transparent border-none text-slate-800 text-xs font-semibold focus:outline-none cursor-pointer"
          >
            <option value="Gate-01">Gate 01 - North Heavy Haul</option>
            <option value="Gate-02">Gate 02 - South Materials Gate</option>
            <option value="Gate-03">Gate 03 - Contractor & Logistics</option>
          </select>
        </div>

        {/* Global Search Button */}
        <button
          id="global-search-btn"
          onClick={onOpenSearch}
          className="flex-1 flex items-center justify-between bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg text-xs transition group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition" />
            <span className="truncate">Search plate (e.g. TN38AB1234)...</span>
          </div>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] text-slate-500 font-mono shadow-2xs">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right User & System Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo Mode / Live API Mode Switcher */}
        <button
          id="mode-toggle-btn"
          onClick={onToggleMode}
          title="Click to toggle between Demo Simulator and Live API Mode"
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border transition cursor-pointer ${
            isBackendConnected
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isBackendConnected ? 'LIVE API' : 'DEMO MODE'}</span>
        </button>

        {/* Alerts Bell */}
        <button
          id="nav-alerts-btn"
          onClick={onNavigateToAlerts}
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
          title="View Site Alerts"
        >
          <Bell className="w-5 h-5" />
          {unreadAlertsCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-600 text-[10px] font-bold text-white flex items-center justify-center animate-pulse font-mono">
              {unreadAlertsCount}
            </span>
          )}
        </button>

        {/* User Card */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="h-8 w-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-xs font-bold text-amber-700">
            {user.name.charAt(0)}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-800 leading-none">{user.name}</p>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{user.role} • {user.shift}</p>
          </div>
          <button
            id="logout-btn"
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded transition cursor-pointer ml-1"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
