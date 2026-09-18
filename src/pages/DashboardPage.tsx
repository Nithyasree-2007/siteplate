import React, { useState } from 'react';
import {
  Truck,
  ShieldCheck,
  ShieldAlert,
  Clock,
  ScanLine,
  AlertTriangle,
  Radio,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Layers,
} from 'lucide-react';
import { AnalyticsData, EntryExitLog, Alert } from '../types';

interface DashboardPageProps {
  analytics: AnalyticsData;
  recentHistory: EntryExitLog[];
  recentAlerts: Alert[];
  onNavigateToMonitoring: () => void;
  onNavigateToAlerts: () => void;
  onNavigateToHistory: () => void;
  onSelectPlate: (plate: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  analytics,
  recentHistory,
  recentAlerts,
  onNavigateToMonitoring,
  onNavigateToAlerts,
  onNavigateToHistory,
  onSelectPlate,
}) => {
  const [activeHourlyFilter, setActiveHourlyFilter] = useState<'all' | 'authorized' | 'unauthorized'>('all');

  // SVG Chart Dimensions & Helpers with defensive fallbacks
  const hourlyData = analytics?.vehicles_per_hour || [];
  const dailyData = analytics?.daily_traffic || [];
  const maxHourly = Math.max(...(hourlyData.length > 0 ? hourlyData.map(h => h.count) : [35]), 35);
  const maxDaily = Math.max(...(dailyData.length > 0 ? dailyData.map(d => d.count) : [150]), 150);

  return (
    <div id="dashboard-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner with Operational Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg font-bold text-slate-900 font-mono">
              CONSTRUCTION SITE GATE OVERVIEW
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded">
              GATE 01 - 03 ACTIVE
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time automated number plate recognition (ANPR) & vehicle security telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="dash-launch-cctv-btn"
            onClick={onNavigateToMonitoring}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider rounded-lg transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Radio className="w-4 h-4" />
            Launch Live CCTV Feed
          </button>
        </div>
      </div>

      {/* 8 Primary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Total Vehicles Today */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Total Vehicles Today</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{analytics.total_vehicles_today}</span>
            <span className="text-[11px] text-emerald-600 font-mono font-bold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across all site ingress gates</p>
        </div>

        {/* 2. Unique Vehicles */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Unique Vehicles</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{analytics.unique_vehicles}</span>
            <span className="text-[11px] text-slate-500 font-mono">distinct plates</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Registered & visitor fleets</p>
        </div>

        {/* 3. Authorized Vehicles */}
        <div className="bg-white border border-emerald-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-mono uppercase text-emerald-700 font-bold">Authorized Vehicles</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-700 font-mono">{analytics.authorized_vehicles}</span>
            <span className="text-[11px] text-emerald-600 font-mono font-medium">
              ({Math.round((analytics.authorized_vehicles / analytics.total_vehicles_today) * 100)}%)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Valid security site permit</p>
        </div>

        {/* 4. Unauthorized Vehicles */}
        <div className="bg-white border border-red-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-mono uppercase text-red-700 font-bold">Unauthorized Vehicles</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600 border border-red-200 animate-pulse">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-red-600 font-mono">{analytics.unauthorized_vehicles}</span>
            <span className="text-[11px] text-red-600 font-mono font-medium">flagged</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Triggered security gate alerts</p>
        </div>

        {/* 5. Vehicles Currently Inside */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Currently Inside Site</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-mono">{analytics.currently_inside}</span>
            <span className="text-[11px] text-slate-500 font-mono">active on-site</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Crossed entry, awaiting exit</p>
        </div>

        {/* 6. Average Stay Duration */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Average Stay Duration</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{analytics.average_stay_duration_minutes}</span>
            <span className="text-sm font-bold text-slate-500 font-mono">min</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Turnaround from gate entry to exit</p>
        </div>

        {/* 7. Total Plate Detections */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-mono uppercase text-slate-500 font-bold">Total Plate Detections</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
              <ScanLine className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{analytics.total_plate_detections.toLocaleString()}</span>
            <span className="text-[11px] text-slate-500 font-mono">frames</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">YOLO LP candidate extractions</p>
        </div>

        {/* 8. Low-Confidence OCR Detections */}
        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[11px] font-mono uppercase text-amber-700 font-bold">Low-Confidence OCR</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-amber-600 font-mono">{analytics.low_confidence_ocr_detections}</span>
            <span className="text-[11px] text-amber-700 font-mono">inspection</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Dust, mud or glare degradation</p>
        </div>
      </div>

      {/* Chart Section 1: Hourly Vehicles + Vehicle Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vehicles per Hour Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                VEHICLE INGRESS PER HOUR
              </h3>
              <p className="text-xs text-slate-500">Distribution of hourly gate traffic volume</p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-lg p-1 text-[11px] font-mono">
              <button
                onClick={() => setActiveHourlyFilter('all')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  activeHourlyFilter === 'all' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveHourlyFilter('authorized')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  activeHourlyFilter === 'authorized' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Authorized
              </button>
              <button
                onClick={() => setActiveHourlyFilter('unauthorized')}
                className={`px-2 py-1 rounded transition cursor-pointer ${
                  activeHourlyFilter === 'unauthorized' ? 'bg-red-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Unauthorized
              </button>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-56 flex items-end gap-3 sm:gap-6 pt-6 border-b border-slate-200">
            {hourlyData.map((h, i) => {
              const displayVal =
                activeHourlyFilter === 'authorized'
                  ? h.authorized
                  : activeHourlyFilter === 'unauthorized'
                  ? h.unauthorized
                  : h.count;
              const barHeightPct = Math.round((displayVal / maxHourly) * 100);

              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="text-[11px] font-mono text-slate-500 group-hover:text-amber-600 font-semibold transition">
                    {displayVal}
                  </div>
                  <div className="w-full max-w-[48px] bg-slate-100 rounded-t-md overflow-hidden flex flex-col justify-end h-full">
                    {activeHourlyFilter === 'all' ? (
                      <>
                        <div
                          style={{ height: `${Math.round((h.unauthorized / maxHourly) * 100)}%` }}
                          className="w-full bg-red-500 transition-all duration-500"
                          title={`Unauthorized: ${h.unauthorized}`}
                        />
                        <div
                          style={{ height: `${Math.round((h.authorized / maxHourly) * 100)}%` }}
                          className="w-full bg-amber-500 group-hover:bg-amber-400 transition-all duration-500"
                          title={`Authorized: ${h.authorized}`}
                        />
                      </>
                    ) : (
                      <div
                        style={{ height: `${barHeightPct}%` }}
                        className={`w-full transition-all duration-500 rounded-t-md ${
                          activeHourlyFilter === 'authorized'
                            ? 'bg-emerald-600 group-hover:bg-emerald-500'
                            : 'bg-red-600 group-hover:bg-red-500'
                        }`}
                      />
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 group-hover:text-slate-900">{h.hour}</div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 font-mono mt-3 pt-1">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded-xs" /> Authorized
              <span className="w-3 h-3 bg-red-500 rounded-xs ml-2" /> Unauthorized
            </span>
            <span>Peak Ingress: 09:00 (31 vehicles)</span>
          </div>
        </div>

        {/* Vehicle Type Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2 mb-1">
              <Truck className="w-4 h-4 text-amber-600" />
              VEHICLE TYPE CLASSIFICATION
            </h3>
            <p className="text-xs text-slate-500 mb-4">Classified via YOLOv8 Object Detection</p>

            <div className="space-y-3">
              {(analytics?.vehicle_type_distribution || []).map((item) => (
                <div key={item.type} className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-700">
                    <span>{item.type}</span>
                    <span className="font-bold text-slate-900">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${item.percentage}%` }}
                      className={`h-full rounded-full ${
                        item.type === 'Truck'
                          ? 'bg-amber-500'
                          : item.type === 'Concrete Mixer'
                          ? 'bg-emerald-500'
                          : item.type === 'Dump Truck'
                          ? 'bg-sky-500'
                          : item.type === 'Van'
                          ? 'bg-purple-500'
                          : 'bg-slate-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Dominant: Heavy Haul Trucks</span>
            <span className="text-amber-600 font-bold">38%</span>
          </div>
        </div>
      </div>

      {/* Chart Section 2: Daily Traffic Trend + Average Stay Duration by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Traffic (7-Day) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">DAILY VEHICLE TRAFFIC (7-DAY TREND)</h3>
              <p className="text-xs text-slate-500">Total gate movements per calendar day</p>
            </div>
            <span className="text-xs font-mono text-slate-500">Sep 11 - Sep 17, 2026</span>
          </div>

          <div className="h-44 flex items-end gap-3 sm:gap-4 pt-4 border-b border-slate-200">
            {dailyData.map((d, i) => {
              const hPct = Math.round((d.count / maxDaily) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-500 group-hover:text-amber-600 transition">
                    {d.count}
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-md overflow-hidden flex flex-col justify-end h-full">
                    <div
                      style={{ height: `${hPct}%` }}
                      className="w-full bg-slate-300 group-hover:bg-amber-500 rounded-t-md transition-all duration-300"
                    />
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono mt-3">
            <span>Weekly Average: 112 vehicles/day</span>
            <span className="text-emerald-700 font-bold">Compliant site flow</span>
          </div>
        </div>

        {/* Average Stay Duration by Type */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">AVERAGE VEHICLE STAY DURATION</h3>
              <p className="text-xs text-slate-500">Calculated between virtual entry and exit triggers</p>
            </div>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>

          <div className="space-y-3">
            {(analytics?.average_stay_by_type || []).map((item) => (
              <div key={item.type} className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-700">
                  <span>{item.type}</span>
                  <span className="font-bold text-sky-700">{item.duration_minutes} minutes</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(100, (item.duration_minutes / 120) * 100)}%` }}
                    className="h-full bg-sky-500 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 font-mono mt-4 pt-3 border-t border-slate-200">
            <span>Shortest: Concrete Mixers (38m pour cycle)</span>
            <span>Longest: Flatbed Steel (115m)</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Ingress Events + Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Ingress Logs (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-mono">RECENT GATE INGRESS & OCR READINGS</h3>
              <p className="text-xs text-slate-500">Live ANPR captures with multi-frame fusion confidence</p>
            </div>
            <button
              onClick={onNavigateToHistory}
              className="text-xs text-amber-600 hover:text-amber-700 font-mono font-bold flex items-center gap-1 cursor-pointer"
            >
              View Full History <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Plate Number</th>
                  <th className="p-2.5">Vehicle Type</th>
                  <th className="p-2.5">Gate</th>
                  <th className="p-2.5">Entry Time</th>
                  <th className="p-2.5">OCR Conf</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {recentHistory.slice(0, 5).map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => onSelectPlate(log.plate_number)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="p-2.5 font-bold text-slate-900">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded text-slate-900">
                        {log.plate_number}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-700">{log.vehicle_type}</td>
                    <td className="p-2.5 text-slate-500">{log.camera_id}</td>
                    <td className="p-2.5 text-slate-700">{log.entry_time}</td>
                    <td className="p-2.5">
                      <span className="text-emerald-600 font-bold">{log.ocr_confidence}%</span>
                    </td>
                    <td className="p-2.5">
                      {log.authorization_status === 'authorized' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ AUTHORIZED
                        </span>
                      )}
                      {log.authorization_status === 'unauthorized' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          ⚠ UNAUTHORIZED
                        </span>
                      )}
                      {log.authorization_status === 'expired' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          ⚠ EXPIRED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Alerts Widget (1 col) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                ACTIVE SITE ALERTS
              </h3>
              <button
                onClick={onNavigateToAlerts}
                className="text-xs text-amber-600 hover:text-amber-700 font-mono font-bold flex items-center gap-1 cursor-pointer"
              >
                Triage ({recentAlerts.filter(a => a.status === 'new').length})
              </button>
            </div>

            <div className="space-y-2.5">
              {recentAlerts.slice(0, 4).map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border text-xs font-mono transition ${
                    alert.severity === 'high'
                      ? 'bg-red-50/80 border-red-200 text-red-800'
                      : alert.severity === 'medium'
                      ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold">{alert.title}</span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-slate-600">
                    Plate: <span className="font-bold text-slate-900">{alert.plate_number}</span> • Gate: {alert.camera_id}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onNavigateToAlerts}
            className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold rounded-lg transition border border-slate-200 cursor-pointer"
          >
            Manage Security Alerts & Dispatch
          </button>
        </div>
      </div>
    </div>
  );
};
