import React, { useState, useEffect } from 'react';
import { Search, X, ShieldCheck, ShieldAlert, AlertTriangle, Clock, Calendar, Truck, User, Phone } from 'lucide-react';
import { Vehicle, EntryExitLog, Detection } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: Vehicle[];
  history: EntryExitLog[];
  detections: Detection[];
  onSelectPlate?: (plate: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  history,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm('TN38AB1234');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSelectedVehicle(null);
      return;
    }
    const clean = searchTerm.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const found = vehicles.find(
      v =>
        v.plate_number.replace(/[^A-Z0-9]/g, '').includes(clean) ||
        v.vehicle_id.toUpperCase().includes(clean) ||
        v.company.toUpperCase().includes(searchTerm.toUpperCase())
    );
    setSelectedVehicle(found || null);
  }, [searchTerm, vehicles]);

  if (!isOpen) return null;

  const vehicleVisits = selectedVehicle
    ? history.filter(h => h.plate_number === selectedVehicle.plate_number)
    : [];

  const quickSamples = ['TN38AB1234', 'KA04MH5678', 'TN40XX9999', 'KA51MD3344', 'MH12PQ9988'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden font-mono">
        {/* Search Header Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-amber-600 shrink-0" />
          <input
            type="text"
            id="global-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by license plate (e.g. TN38AB1234), vehicle ID, or company..."
            className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 text-sm font-mono focus:outline-none focus:ring-0"
            autoFocus
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded text-xs font-mono cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Quick Sample Tags */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 font-mono text-[11px] shrink-0">Quick inspect:</span>
          {quickSamples.map((sample) => (
            <button
              key={sample}
              onClick={() => setSearchTerm(sample)}
              className="px-2 py-0.5 rounded bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-mono text-[11px] transition cursor-pointer shrink-0 font-medium"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {selectedVehicle ? (
            <div className="space-y-5">
              {/* Top Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-2xl font-black tracking-wider text-slate-900 px-3 py-1 bg-white border border-slate-300 rounded-lg shadow-xs">
                      {selectedVehicle.plate_number}
                    </span>
                    {selectedVehicle.authorization_status === 'authorized' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <ShieldCheck className="w-4 h-4" />
                        AUTHORIZED
                      </span>
                    )}
                    {selectedVehicle.authorization_status === 'unauthorized' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                        <ShieldAlert className="w-4 h-4" />
                        UNAUTHORIZED
                      </span>
                    )}
                    {selectedVehicle.authorization_status === 'expired' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        <AlertTriangle className="w-4 h-4" />
                        PERMIT EXPIRED
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-mono">
                    System Tracking ID: <span className="text-slate-800 font-semibold">{selectedVehicle.vehicle_id}</span> • Type: <span className="text-slate-800 font-semibold">{selectedVehicle.vehicle_type}</span>
                  </p>
                </div>

                <div className="text-right border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 text-xs font-mono space-y-1">
                  <div className="text-slate-500">Total Site Visits: <span className="text-slate-900 font-bold">{vehicleVisits.length} logs</span></div>
                  <div className="text-slate-500">Permit Validity: <span className="text-slate-700">{selectedVehicle.permit_start_date} → {selectedVehicle.permit_expiry_date}</span></div>
                </div>
              </div>

              {/* Vehicle Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
                    <Truck className="w-3.5 h-3.5 text-amber-600" />
                    Contractor / Company
                  </div>
                  <p className="text-xs font-semibold text-slate-900 truncate">{selectedVehicle.company}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
                    <User className="w-3.5 h-3.5 text-amber-600" />
                    Designated Driver
                  </div>
                  <p className="text-xs font-semibold text-slate-900">{selectedVehicle.driver_name}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
                    <Phone className="w-3.5 h-3.5 text-amber-600" />
                    Emergency Contact
                  </div>
                  <p className="text-xs font-mono text-slate-900">{selectedVehicle.contact_number}</p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-slate-500 text-xs font-mono mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Avg OCR Confidence
                  </div>
                  <p className="text-xs font-mono text-emerald-700 font-bold">96.4% (Multi-Frame)</p>
                </div>
              </div>

              {/* Visit History Section */}
              <div>
                <h4 className="text-xs font-mono uppercase font-bold text-slate-600 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  Previous Gate Visits & Duration
                </h4>
                {vehicleVisits.length > 0 ? (
                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Date</th>
                          <th className="p-2.5">Gate / Camera</th>
                          <th className="p-2.5">Entry</th>
                          <th className="p-2.5">Exit</th>
                          <th className="p-2.5">Duration</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {vehicleVisits.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50">
                            <td className="p-2.5 text-slate-900">{v.date}</td>
                            <td className="p-2.5 text-slate-500">{v.camera_id}</td>
                            <td className="p-2.5 text-emerald-700 font-bold">{v.entry_time}</td>
                            <td className="p-2.5 text-amber-700">{v.exit_time || '—'}</td>
                            <td className="p-2.5">{v.duration_minutes ? `${v.duration_minutes} mins` : 'Inside'}</td>
                            <td className="p-2.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                v.status === 'Currently Inside'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {v.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center text-xs text-slate-500 font-mono">
                    No visit records found in historical gate logs for this vehicle.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Truck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-800 text-sm font-semibold">No vehicle found matching "{searchTerm}"</p>
              <p className="text-xs text-slate-500 font-mono mt-1">
                Try searching for a valid license plate like TN38AB1234, KA04MH5678, or TN40XX9999.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-mono">
          <span>Search index: vehicles, gate history, OCR logs</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded font-medium transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
