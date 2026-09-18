import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  ScanLine,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Award,
} from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsPageProps {
  analytics: AnalyticsData;
  onSelectPlate: (plate: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ analytics, onSelectPlate }) => {
  const hourlyData = analytics?.vehicles_per_hour || [];
  const maxHourly = Math.max(...(hourlyData.length > 0 ? hourlyData.map(h => h.count) : [35]), 35);
  const totalVehicles = analytics?.total_vehicles_today || 1;
  const authCount = analytics?.authorized_vehicles || 0;
  const authPct = Math.round((authCount / totalVehicles) * 100);
  const unauthPct = 100 - authPct;

  return (
    <div id="analytics-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-amber-600" />
          SITE VEHICLE TRAFFIC & ANPR ANALYTICS
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Quantitative telemetry for site security, fleet turnaround efficiency, and OCR character extraction accuracy.
        </p>
      </div>

      {/* Row 1: OCR Performance Benchmark + Authorization Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* OCR Performance (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ScanLine className="w-4 h-4 text-emerald-600" />
                OCR MODEL PERFORMANCE & ACCURACY METRICS
              </h3>
              <p className="text-xs text-slate-500">
                Evaluation of PaddleOCR across {analytics.total_plate_detections.toLocaleString()} video frames
              </p>
            </div>
            <span className="text-sm font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
              {analytics.ocr_performance.success_rate}% Success Rate
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-50 border border-emerald-200 rounded-lg p-3.5 text-center">
              <div className="flex items-center justify-center text-emerald-600 mb-1">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-slate-900">
                {analytics.ocr_performance.successful_ocr.toLocaleString()}
              </span>
              <p className="text-[11px] text-emerald-700 font-bold mt-0.5">Successful OCR</p>
              <p className="text-[10px] text-slate-500 mt-1">High confidence (&gt;85%)</p>
            </div>

            <div className="bg-slate-50 border border-amber-200 rounded-lg p-3.5 text-center">
              <div className="flex items-center justify-center text-amber-600 mb-1">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-amber-700">
                {analytics.ocr_performance.low_confidence_ocr}
              </span>
              <p className="text-[11px] text-amber-800 font-bold mt-0.5">Low-Confidence</p>
              <p className="text-[10px] text-slate-500 mt-1">Fused via multi-frame</p>
            </div>

            <div className="bg-slate-50 border border-purple-200 rounded-lg p-3.5 text-center">
              <div className="flex items-center justify-center text-purple-600 mb-1">
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black text-purple-700">
                {analytics.ocr_performance.unreadable_plates}
              </span>
              <p className="text-[11px] text-purple-800 font-bold mt-0.5">Unreadable Plates</p>
              <p className="text-[10px] text-slate-500 mt-1">Severe mud/obstruction</p>
            </div>
          </div>

          {/* Performance Distribution Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-xs text-slate-600">
              <span>Performance Distribution Breakdown:</span>
              <span className="text-slate-900 font-semibold">Total: {analytics.total_plate_detections.toLocaleString()} extractions</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden border border-slate-200">
              <div style={{ width: '95.1%' }} className="bg-emerald-500" title="Successful: 95.1%" />
              <div style={{ width: '3.9%' }} className="bg-amber-500" title="Low Confidence: 3.9%" />
              <div style={{ width: '1.0%' }} className="bg-purple-500" title="Unreadable: 1.0%" />
            </div>
            <div className="flex justify-between text-[11px] text-slate-600">
              <span className="text-emerald-700 font-medium">■ 95.1% Reliable Extraction</span>
              <span className="text-amber-700 font-medium">■ 3.9% Quality Preprocessed</span>
              <span className="text-purple-700 font-medium">■ 1.0% Human Triage</span>
            </div>
          </div>
        </div>

        {/* Authorization vs Unauthorized Ratio (1 col) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              SITE ACCESS AUTHORIZATION
            </h3>
            <p className="text-xs text-slate-500 mb-4">Ratio of permit verified vs unauthorized ingress</p>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-around">
              <div className="text-center">
                <span className="text-3xl font-black text-emerald-700">{analytics.authorized_vehicles}</span>
                <span className="block text-xs text-slate-600 mt-1">Authorized</span>
                <span className="text-[10px] text-emerald-700 font-bold">{authPct}%</span>
              </div>
              <div className="h-12 w-px bg-slate-200" />
              <div className="text-center">
                <span className="text-3xl font-black text-red-600">{analytics.unauthorized_vehicles}</span>
                <span className="block text-xs text-slate-600 mt-1">Unauthorized</span>
                <span className="text-[10px] text-red-700 font-bold">{unauthPct}%</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex justify-between">
              <span>Security Compliance:</span>
              <span className="text-emerald-700 font-bold">93.7% Target Met</span>
            </div>
            <div className="flex justify-between">
              <span>Security Interventions:</span>
              <span className="text-amber-700">8 vehicles turned away</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Frequently Seen Vehicles (Leaderboard) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              FREQUENTLY SEEN VEHICLES (SITE VISIT LEADERBOARD)
            </h3>
            <p className="text-xs text-slate-500">Vehicles with highest repetitive ingress movements this month</p>
          </div>
          <span className="text-xs text-slate-500">Top 5 Active Transporters</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">License Plate</th>
                <th className="p-3">Vehicle Type</th>
                <th className="p-3">Contractor / Company</th>
                <th className="p-3">Total Ingress Visits</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Sighted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {(analytics?.frequently_seen_vehicles || []).map((v, i) => (
                <tr
                  key={v.plate_number}
                  onClick={() => onSelectPlate(v.plate_number)}
                  className="hover:bg-slate-50/80 cursor-pointer transition"
                >
                  <td className="p-3 text-amber-600 font-bold">#{i + 1}</td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded font-black text-slate-900">
                      {v.plate_number}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700">{v.vehicle_type}</td>
                  <td className="p-3 font-semibold text-slate-900">{v.company}</td>
                  <td className="p-3">
                    <span className="text-sky-700 font-bold text-sm">{v.visit_count} visits</span>
                  </td>
                  <td className="p-3">
                    {v.authorization_status === 'authorized' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ✓ AUTHORIZED
                      </span>
                    )}
                    {v.authorization_status === 'unauthorized' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                        ⚠ UNAUTHORIZED
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-slate-500">{v.last_seen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Row 3: Hourly Traffic Bar Chart + Stay Duration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-amber-600" />
            HOURLY INGRESS DYNAMICS
          </h3>
          <p className="text-xs text-slate-500 mb-4">Peak gate congestion patterns</p>

          <div className="h-44 flex items-end gap-3 pt-4 border-b border-slate-200">
            {hourlyData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[10px] text-slate-500 group-hover:text-amber-600 transition">{h.count}</span>
                <div className="w-full bg-slate-100 rounded-t-md overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${Math.round((h.count / maxHourly) * 100)}%` }}
                    className="w-full bg-amber-500 group-hover:bg-amber-400 rounded-t-md transition-all"
                  />
                </div>
                <span className="text-[10px] text-slate-500">{h.hour}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-sky-600" />
            AVERAGE SITE TURNAROUND DURATION
          </h3>
          <p className="text-xs text-slate-500 mb-4">Minutes logged inside perimeter before gate egress</p>

          <div className="space-y-3">
            {(analytics?.average_stay_by_type || []).map((item) => (
              <div key={item.type} className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>{item.type}</span>
                  <span className="font-bold text-sky-700">{item.duration_minutes} mins</span>
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
        </div>
      </div>
    </div>
  );
};
