import React, { useState } from 'react';
import {
  History,
  Search,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  X,
  Download,
} from 'lucide-react';
import { EntryExitLog } from '../types';

interface VehicleHistoryPageProps {
  history: EntryExitLog[];
  onSelectPlate: (plate: string) => void;
}

export const VehicleHistoryPage: React.FC<VehicleHistoryPageProps> = ({
  history,
  onSelectPlate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAuth, setFilterAuth] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedLog, setSelectedLog] = useState<EntryExitLog | null>(null);

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vehicle_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || item.vehicle_type === filterType;
    const matchesAuth = filterAuth === 'all' || item.authorization_status === filterAuth;
    const matchesDate = !filterDate || item.date === filterDate;

    return matchesSearch && matchesType && matchesAuth && matchesDate;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Plate', 'Vehicle Type', 'Company', 'Gate', 'Entry Time', 'Exit Time', 'Duration (Min)', 'Status'];
    const rows = filteredHistory.map(h => [
      h.date,
      h.plate_number,
      h.vehicle_type,
      `"${h.company}"`,
      h.camera_id,
      h.entry_time,
      h.exit_time || 'Inside',
      h.duration_minutes || 'N/A',
      h.authorization_status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `cctv_vehicle_history_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="vehicle-history-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
            <History className="w-5 h-5 text-amber-600" />
            HISTORICAL GATE INGRESS / EGRESS AUDIT LOGS
          </h2>
          <p className="text-xs text-slate-500">
            Searchable CCTV timestamp logs, virtual line duration calculations, and entry/exit traces.
          </p>
        </div>

        <button
          onClick={exportCSV}
          className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-semibold rounded-lg transition border border-slate-200 cursor-pointer w-fit"
        >
          <Download className="w-4 h-4 text-amber-600" />
          Export Audit CSV
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono shadow-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plate, ID, contractor..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none"
          />

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Vehicles</option>
            <option value="Truck">Truck</option>
            <option value="Concrete Mixer">Concrete Mixer</option>
            <option value="Dump Truck">Dump Truck</option>
            <option value="Van">Van</option>
            <option value="Pickup">Pickup</option>
            <option value="Lorry">Lorry</option>
          </select>

          <select
            value={filterAuth}
            onChange={(e) => setFilterAuth(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="authorized">Authorized</option>
            <option value="unauthorized">Unauthorized</option>
            <option value="expired">Expired</option>
          </select>

          {filterDate && (
            <button
              onClick={() => setFilterDate('')}
              className="text-slate-500 hover:text-slate-800 text-xs underline cursor-pointer"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Plate Number</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Gate</th>
                <th className="p-3">Entry</th>
                <th className="p-3">Exit</th>
                <th className="p-3">Stay Duration</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedLog(item)}
                    className="hover:bg-slate-50/80 cursor-pointer transition"
                  >
                    <td className="p-3 text-slate-500">{item.date}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-bold text-slate-900">
                        {item.plate_number}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="text-slate-900 font-semibold">{item.vehicle_type}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{item.company}</div>
                    </td>
                    <td className="p-3 text-slate-500">{item.camera_id}</td>
                    <td className="p-3 text-emerald-700 font-bold">{item.entry_time}</td>
                    <td className="p-3 text-amber-700">{item.exit_time || '—'}</td>
                    <td className="p-3">
                      {item.duration_minutes !== null && item.duration_minutes !== undefined ? (
                        <span className="text-sky-700 font-bold">{item.duration_minutes} mins</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Active Inside
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {item.authorization_status === 'authorized' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ✓ AUTHORIZED
                        </span>
                      )}
                      {item.authorization_status === 'unauthorized' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          ⚠ UNAUTHORIZED
                        </span>
                      )}
                      {item.authorization_status === 'expired' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          ⚠ EXPIRED
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <span className="text-xs text-amber-600 hover:text-amber-700 font-bold">
                        Inspect →
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400 font-mono">
                    No historical logs found for the selected query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Detail Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">CCTV VISIT AUDIT RECORD</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* License Plate Display */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase">License Plate Number</span>
                <div className="text-2xl font-black text-slate-900 tracking-wider">
                  {selectedLog.plate_number}
                </div>
                <span className="text-[11px] text-slate-500">{selectedLog.vehicle_type} • ID: {selectedLog.vehicle_id}</span>
              </div>
              <div>
                {selectedLog.authorization_status === 'authorized' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> AUTHORIZED
                  </span>
                )}
                {selectedLog.authorization_status === 'unauthorized' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4" /> UNAUTHORIZED
                  </span>
                )}
                {selectedLog.authorization_status === 'expired' && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> PERMIT EXPIRED
                  </span>
                )}
              </div>
            </div>

            {/* Entry / Exit Timing Timeline */}
            <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Gate Ingress</span>
                <span className="text-sm font-bold text-emerald-700">{selectedLog.entry_time}</span>
                <span className="text-[10px] text-slate-500 block">{selectedLog.camera_id}</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <ArrowRight className="w-4 h-4 text-slate-400 mb-1" />
                <span className="text-slate-500 text-[10px]">DURATION</span>
                <span className="text-xs font-bold text-sky-700">
                  {selectedLog.duration_minutes ? `${selectedLog.duration_minutes} min` : 'Currently Inside'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block uppercase">Gate Egress</span>
                <span className="text-sm font-bold text-amber-700">{selectedLog.exit_time || 'Awaiting Exit'}</span>
                <span className="text-[10px] text-slate-500 block">{selectedLog.status}</span>
              </div>
            </div>

            {/* Contractor & Driver Specs */}
            <div className="space-y-2">
              <div className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500">Contractor / Company:</span>
                <span className="text-slate-900 font-semibold">{selectedLog.company}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500">Designated Driver:</span>
                <span className="text-slate-900">{selectedLog.driver_name}</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-500">Multi-Frame OCR Confidence:</span>
                <span className="text-emerald-700 font-bold">{selectedLog.ocr_confidence}% (Verified)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => {
                  setSelectedLog(null);
                  onSelectPlate(selectedLog.plate_number);
                }}
                className="text-amber-600 hover:text-amber-700 font-bold underline cursor-pointer"
              >
                View Global Vehicle Profile →
              </button>
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded font-medium cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
