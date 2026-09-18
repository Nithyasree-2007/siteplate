import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Filter,
  X,
  HelpCircle,
  FileWarning,
} from 'lucide-react';
import { Alert, AlertStatus, AlertType } from '../types';

interface AlertsPageProps {
  alerts: Alert[];
  onUpdateAlertStatus: (id: string, status: AlertStatus, resolution_notes?: string) => Promise<void>;
  onSelectPlate: (plate: string) => void;
}

export const AlertsPage: React.FC<AlertsPageProps> = ({
  alerts,
  onUpdateAlertStatus,
  onSelectPlate,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredAlerts = alerts.filter((a) => {
    const matchesType = filterType === 'all' || a.type === filterType;
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const handleStatusChange = async (alertId: string, status: AlertStatus, notes?: string) => {
    setIsUpdating(true);
    try {
      await onUpdateAlertStatus(alertId, status, notes);
      if (selectedAlert && selectedAlert.id === alertId) {
        setSelectedAlert({ ...selectedAlert, status, resolution_notes: notes });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getAlertBadge = (type: AlertType) => {
    switch (type) {
      case 'unauthorized_vehicle':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1 w-fit">
            <ShieldAlert className="w-3 h-3" /> UNAUTHORIZED
          </span>
        );
      case 'expired_permit':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 w-fit">
            <AlertTriangle className="w-3 h-3" /> EXPIRED PERMIT
          </span>
        );
      case 'low_confidence_ocr':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-yellow-50 text-yellow-800 border border-yellow-200 flex items-center gap-1 w-fit">
            <FileWarning className="w-3 h-3" /> LOW CONFIDENCE OCR
          </span>
        );
      case 'unreadable_plate':
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1 w-fit">
            <HelpCircle className="w-3 h-3" /> UNREADABLE PLATE
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            SECURITY ALERT
          </span>
        );
    }
  };

  return (
    <div id="alerts-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            CONSTRUCTION SITE GATE SECURITY ALERTS
          </h2>
          <p className="text-xs text-slate-500">
            Automated notifications for unauthorized entries, permit expirations, and OCR anomalies.
          </p>
        </div>

        {/* Quick summary metrics */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 bg-red-50 border border-red-200 text-red-700 rounded-lg font-bold">
            {alerts.filter(a => a.status === 'new').length} New
          </span>
          <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg font-bold">
            {alerts.filter(a => a.status === 'reviewed').length} Under Review
          </span>
          <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-bold">
            {alerts.filter(a => a.status === 'resolved').length} Resolved
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Alert Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Alert Types</option>
              <option value="unauthorized_vehicle">Unauthorized Vehicle</option>
              <option value="expired_permit">Expired Permit</option>
              <option value="low_confidence_ocr">Low-Confidence OCR</option>
              <option value="unreadable_plate">Unreadable Plate</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700">
            <span>Triage Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="new">New (Unresolved)</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <span className="text-slate-500 text-[11px]">
          Showing {filteredAlerts.length} of {alerts.length} security alerts
        </span>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            onClick={() => {
              setSelectedAlert(alert);
              setResolutionNotes(alert.resolution_notes || '');
            }}
            className={`p-5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-4 shadow-xs ${
              alert.status === 'new'
                ? 'bg-white border-red-200 hover:border-red-400'
                : alert.status === 'reviewed'
                ? 'bg-white border-amber-200 hover:border-amber-400'
                : 'bg-white border-slate-200 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                {getAlertBadge(alert.type)}
                <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                  alert.status === 'new'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : alert.status === 'reviewed'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  {alert.status}
                </span>
              </div>

              <div>
                <h4 className="font-mono font-bold text-slate-900 text-sm">{alert.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{alert.description}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">License Plate:</span>
                  <span className="text-slate-900 font-bold">{alert.plate_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">CCTV Location:</span>
                  <span className="text-slate-700">{alert.camera_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Detected Time:</span>
                  <span className="text-slate-700">{alert.timestamp}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 text-xs font-mono">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPlate(alert.plate_number);
                }}
                className="text-amber-600 hover:text-amber-700 font-semibold underline cursor-pointer"
              >
                Inspect Plate
              </button>

              <div className="flex items-center gap-1">
                {alert.status !== 'reviewed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(alert.id, 'reviewed');
                    }}
                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded transition cursor-pointer text-[11px] font-medium"
                  >
                    Review
                  </button>
                )}
                {alert.status !== 'resolved' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(alert.id, 'resolved', 'Resolved by security operator on duty.');
                    }}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded transition cursor-pointer text-[11px] font-bold"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Detail & Dispatch Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <h3 className="text-sm font-bold text-slate-900">ALERT INVESTIGATION & TRIAGE</h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                {getAlertBadge(selectedAlert.type)}
                <span className="text-slate-500">{selectedAlert.timestamp}</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-900">{selectedAlert.title}</h4>
                <p className="text-slate-600 mt-1">{selectedAlert.description}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Plate Number:</span>
                  <span className="font-bold text-slate-900">{selectedAlert.plate_number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Camera Gate:</span>
                  <span className="text-slate-700">{selectedAlert.camera_name} ({selectedAlert.camera_id})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-bold uppercase text-amber-700">{selectedAlert.status}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 mb-1 font-bold">Security Resolution Notes:</label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Record dispatch notes, manual plate verification, or security gate action taken..."
                  className="w-full h-20 bg-slate-50 border border-slate-200 focus:border-amber-500 rounded p-2.5 text-slate-900 text-xs focus:outline-none focus:bg-white transition"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedAlert.id, 'new', resolutionNotes)}
                    className={`px-3 py-1.5 rounded cursor-pointer ${
                      selectedAlert.status === 'new' ? 'bg-red-600 text-white font-bold' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Mark New
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedAlert.id, 'reviewed', resolutionNotes)}
                    className={`px-3 py-1.5 rounded cursor-pointer ${
                      selectedAlert.status === 'reviewed' ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Mark Reviewed
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedAlert.id, 'resolved', resolutionNotes)}
                    className={`px-3 py-1.5 rounded cursor-pointer ${
                      selectedAlert.status === 'resolved' ? 'bg-emerald-600 text-white font-bold' : 'bg-slate-100 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Mark Resolved
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSelectedAlert(null);
                    onSelectPlate(selectedAlert.plate_number);
                  }}
                  className="text-amber-600 underline hover:text-amber-700 font-semibold cursor-pointer"
                >
                  Vehicle Dossier →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
