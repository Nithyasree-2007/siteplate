import React from 'react';
import {
  LayoutDashboard,
  Video,
  Truck,
  History,
  AlertTriangle,
  BarChart3,
  Settings,
  Radio,
} from 'lucide-react';

export type NavigationPage =
  | 'dashboard'
  | 'monitoring'
  | 'vehicles'
  | 'history'
  | 'alerts'
  | 'analytics'
  | 'settings';

interface SidebarProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  unreadAlertsCount: number;
  vehiclesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  unreadAlertsCount,
  vehiclesCount,
}) => {
  const menuItems = [
    {
      id: 'dashboard' as NavigationPage,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'monitoring' as NavigationPage,
      label: 'Live Monitoring',
      icon: Video,
      badge: 'CCTV',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      id: 'vehicles' as NavigationPage,
      label: 'Vehicle Management',
      icon: Truck,
      badge: vehiclesCount > 0 ? `${vehiclesCount}` : null,
      badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    },
    {
      id: 'history' as NavigationPage,
      label: 'Vehicle History',
      icon: History,
      badge: null,
    },
    {
      id: 'alerts' as NavigationPage,
      label: 'Alerts',
      icon: AlertTriangle,
      badge: unreadAlertsCount > 0 ? `${unreadAlertsCount}` : null,
      badgeColor: 'bg-red-50 text-red-700 border-red-200',
    },
    {
      id: 'analytics' as NavigationPage,
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'settings' as NavigationPage,
      label: 'Settings & Backend',
      icon: Settings,
      badge: 'FastAPI',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
  ];

  return (
    <aside id="main-sidebar" className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 select-none">
      {/* Navigation List */}
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          Security Operations
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                      isActive
                        ? 'bg-slate-950/15 text-slate-950 border-slate-950/25'
                        : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Industrial Hardware Status Card */}
      <div className="p-4 border-t border-slate-200 space-y-3">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-mono text-slate-500 font-semibold flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-emerald-600 animate-pulse" />
              EDGE CV PIPELINE
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              READY
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">YOLO Model:</span>
              <span className="text-slate-800 font-medium">v8x-Veh + v8n-LP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tracking:</span>
              <span className="text-slate-800 font-medium">ByteTrack v1.2</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">OCR Engine:</span>
              <span className="text-slate-800 font-medium">PaddleOCR 5-Frame</span>
            </div>
          </div>
        </div>

        <div className="text-center text-[10px] text-slate-400 font-mono">
          SITEPLATE-OS • BUILD 2026.09
        </div>
      </div>
    </aside>
  );
};
