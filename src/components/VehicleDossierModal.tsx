import React from 'react';
import {
  X,
  Truck,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  User,
  History,
} from 'lucide-react';
import { Vehicle, EntryExitLog } from '../types';

interface VehicleDossierModalProps {
  plateNumber: string;
  vehicle?: Vehicle;
  historyLogs: EntryExitLog[];
  onClose: () => void;
  onNavigateToHistory: () => void;
}

export const VehicleDossierModal: React.FC<VehicleDossierModalProps> = ({
  plateNumber,
  vehicle,
  historyLogs,
  onClose,
  onNavigateToHistory,
}) => {
  const plateHistory = historyLogs.filter(
    (h) => h.plate_number.toUpperCase() === plateNumber.toUpperCase()
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 font-mono text-xs max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              VEHICLE DOSSIER & SECURITY PROFILE
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* License Plate Banner */}
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="px-4 py-2 bg-white border-2 border-slate-300 rounded-lg text-2xl font-black text-slate-900 tracking-wider shadow-xs">
              {plateNumber}
            </div>
            <div>
              <span className="text-slate-500 text-[11px] block">
                {vehicle ? `${vehicle.vehicle_type} • ID: ${vehicle.vehicle_id}` : 'Unregistered CCTV Detection'}
              </span>
              <span className="text-slate-900 font-bold text-sm">
                {vehicle?.company || 'Unknown Contractor'}
              </span>
            </div>
          </div>

          <div>
            {vehicle?.authorization_status === 'authorized' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 w-fit">
                <ShieldCheck className="w-4 h-4" /> AUTHORIZED
              </span>
            )}
            {vehicle?.authorization_status === 'unauthorized' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5 w-fit">
                <ShieldAlert className="w-4 h-4" /> UNAUTHORIZED
              </span>
            )}
            {vehicle?.authorization_status === 'expired' && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5 w-fit">
                <AlertTriangle className="w-4 h-4" /> PERMIT EXPIRED
              </span>
            )}
            {!vehicle && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5 w-fit">
                <ShieldAlert className="w-4 h-4" /> NOT IN REGISTRY
              </span>
            )}
          </div>
        </div>

        {/* Vehicle Metadata Details */}
        {vehicle ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                <User className="w-3 h-3 text-amber-600" /> Driver Information
              </span>
              <div className="text-slate-900 font-medium">{vehicle.driver_name}</div>
              <div className="text-slate-500 text-[11px]">{vehicle.contact_number}</div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-sky-600" /> Permit Validity
              </span>
              <div className="text-slate-900 font-medium">
                {vehicle.permit_start_date} → {vehicle.permit_expiry_date}
              </div>
              <div className="text-emerald-700 text-[11px] font-semibold">Valid Construction Site Access</div>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            ⚠ This vehicle license plate has been detected at site CCTV cameras but has no active permit on file in the security database.
          </div>
        )}

        {/* CCTV Visit History Table */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <History className="w-4 h-4 text-amber-600" />
              SIGHTINGS & GATE CROSSINGS ({plateHistory.length})
            </span>
            <button
              onClick={() => {
                onClose();
                onNavigateToHistory();
              }}
              className="text-amber-600 hover:text-amber-700 text-[11px] underline cursor-pointer font-semibold"
            >
              Open Complete Audit Trail →
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="p-2.5">Date</th>
                  <th className="p-2.5">Camera Gate</th>
                  <th className="p-2.5">Entry Time</th>
                  <th className="p-2.5">Exit Time</th>
                  <th className="p-2.5">Stay (Mins)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {plateHistory.length > 0 ? (
                  plateHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-2.5 text-slate-500">{item.date}</td>
                      <td className="p-2.5 font-medium">{item.camera_id}</td>
                      <td className="p-2.5 text-emerald-700 font-bold">{item.entry_time}</td>
                      <td className="p-2.5 text-amber-700">{item.exit_time || 'Inside'}</td>
                      <td className="p-2.5">{item.duration_minutes ? `${item.duration_minutes}m` : 'Active'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">
                      No gate crossing events recorded today.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded font-medium cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
