import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Truck,
  X,
} from 'lucide-react';
import { Vehicle, VehicleType, AuthorizationStatus } from '../types';

interface VehicleManagementPageProps {
  vehicles: Vehicle[];
  onAddVehicle: (v: Omit<Vehicle, 'id' | 'created_at'>) => Promise<void>;
  onUpdateVehicle: (id: string, updates: Partial<Vehicle>) => Promise<void>;
  onDeleteVehicle: (id: string) => Promise<void>;
  onSelectPlate: (plate: string) => void;
}

export const VehicleManagementPage: React.FC<VehicleManagementPageProps> = ({
  vehicles,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onSelectPlate,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAuth, setFilterAuth] = useState<string>('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    vehicle_id: '',
    plate_number: '',
    vehicle_type: 'Truck' as VehicleType,
    company: '',
    driver_name: '',
    contact_number: '',
    authorization_status: 'authorized' as AuthorizationStatus,
    permit_start_date: new Date().toISOString().split('T')[0],
    permit_expiry_date: '2026-12-31',
    notes: '',
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter logic
  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.vehicle_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driver_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || v.vehicle_type === filterType;
    const matchesAuth = filterAuth === 'all' || v.authorization_status === filterAuth;

    return matchesSearch && matchesType && matchesAuth;
  });

  const handleOpenAdd = () => {
    setFormData({
      vehicle_id: `REG-${Math.floor(111 + Math.random() * 888)}`,
      plate_number: '',
      vehicle_type: 'Truck',
      company: '',
      driver_name: '',
      contact_number: '',
      authorization_status: 'authorized',
      permit_start_date: new Date().toISOString().split('T')[0],
      permit_expiry_date: '2026-12-31',
      notes: '',
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (v: Vehicle) => {
    setEditingVehicle(v);
    setFormData({
      vehicle_id: v.vehicle_id,
      plate_number: v.plate_number,
      vehicle_type: v.vehicle_type,
      company: v.company,
      driver_name: v.driver_name,
      contact_number: v.contact_number,
      authorization_status: v.authorization_status,
      permit_start_date: v.permit_start_date,
      permit_expiry_date: v.permit_expiry_date,
      notes: v.notes || '',
    });
    setFormError('');
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.plate_number.trim()) {
      setFormError('License Plate is required.');
      return;
    }
    if (!formData.company.trim()) {
      setFormError('Company/Contractor name is required.');
      return;
    }

    // Plate format normalization
    const cleanPlate = formData.plate_number.toUpperCase().replace(/\s+/g, '');

    setIsSubmitting(true);
    try {
      if (editingVehicle) {
        await onUpdateVehicle(editingVehicle.id, {
          ...formData,
          plate_number: cleanPlate,
        });
        setEditingVehicle(null);
      } else {
        await onAddVehicle({
          ...formData,
          plate_number: cleanPlate,
        });
        setIsAddModalOpen(false);
      }
    } catch (err: any) {
      setFormError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;
    try {
      await onDeleteVehicle(deletingId);
      setDeletingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="vehicle-management-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 font-mono flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            REGISTERED VEHICLE DATABASE & PERMITS
          </h2>
          <p className="text-xs text-slate-500">
            Maintain contractor vehicle registry, authorized permits, and gate security permissions.
          </p>
        </div>

        <button
          id="add-vehicle-btn"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs font-mono uppercase tracking-wider rounded-lg transition shadow-md shadow-amber-500/20 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle Permit
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search plate, ID, company, driver..."
            className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg pl-9 pr-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="Truck">Truck</option>
              <option value="Concrete Mixer">Concrete Mixer</option>
              <option value="Dump Truck">Dump Truck</option>
              <option value="Flatbed">Flatbed</option>
              <option value="Van">Van</option>
              <option value="Pickup">Pickup</option>
              <option value="Lorry">Lorry</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700">
            <span>Status:</span>
            <select
              value={filterAuth}
              onChange={(e) => setFilterAuth(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="authorized">Authorized</option>
              <option value="unauthorized">Unauthorized</option>
              <option value="expired">Expired Permit</option>
            </select>
          </div>

          <span className="text-slate-500 text-[11px] ml-auto">
            Showing {filteredVehicles.length} of {vehicles.length} records
          </span>
        </div>
      </div>

      {/* Main Vehicles Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase border-b border-slate-200">
              <tr>
                <th className="p-3">Vehicle ID</th>
                <th className="p-3">License Plate</th>
                <th className="p-3">Type</th>
                <th className="p-3">Contractor / Company</th>
                <th className="p-3">Driver & Contact</th>
                <th className="p-3">Authorization</th>
                <th className="p-3">Permit Period</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3 text-sky-700 font-bold">{v.vehicle_id}</td>
                    <td className="p-3">
                      <button
                        onClick={() => onSelectPlate(v.plate_number)}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded font-bold text-slate-900 tracking-wider transition cursor-pointer text-xs"
                      >
                        {v.plate_number}
                      </button>
                    </td>
                    <td className="p-3 text-slate-700">{v.vehicle_type}</td>
                    <td className="p-3 font-semibold text-slate-900">{v.company}</td>
                    <td className="p-3">
                      <div className="text-slate-900 font-medium">{v.driver_name}</div>
                      <div className="text-[10px] text-slate-500">{v.contact_number}</div>
                    </td>
                    <td className="p-3">
                      {v.authorization_status === 'authorized' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3" /> AUTHORIZED
                        </span>
                      )}
                      {v.authorization_status === 'unauthorized' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                          <ShieldAlert className="w-3 h-3" /> UNAUTHORIZED
                        </span>
                      )}
                      {v.authorization_status === 'expired' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> EXPIRED
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-500 text-[11px]">
                      {v.permit_start_date} → {v.permit_expiry_date}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(v)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Edit vehicle"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(v.id)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded transition cursor-pointer"
                          title="Delete vehicle"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 font-mono">
                    No vehicles found matching current filter parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Vehicle Modal */}
      {(isAddModalOpen || editingVehicle) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4 font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-600" />
                {editingVehicle ? 'EDIT VEHICLE PERMIT' : 'REGISTER NEW VEHICLE'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingVehicle(null);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">System Vehicle ID</label>
                  <input
                    type="text"
                    value={formData.vehicle_id}
                    onChange={(e) => setFormData({ ...formData, vehicle_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">License Plate Number *</label>
                  <input
                    type="text"
                    value={formData.plate_number}
                    onChange={(e) => setFormData({ ...formData, plate_number: e.target.value })}
                    placeholder="e.g. TN38AB1234"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900 font-bold uppercase"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Vehicle Classification</label>
                  <select
                    value={formData.vehicle_type}
                    onChange={(e) => setFormData({ ...formData, vehicle_type: e.target.value as VehicleType })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                  >
                    <option value="Truck">Truck</option>
                    <option value="Concrete Mixer">Concrete Mixer</option>
                    <option value="Dump Truck">Dump Truck</option>
                    <option value="Flatbed">Flatbed</option>
                    <option value="Van">Van</option>
                    <option value="Pickup">Pickup</option>
                    <option value="Lorry">Lorry</option>
                    <option value="Car">Car</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Authorization Decision</label>
                  <select
                    value={formData.authorization_status}
                    onChange={(e) => setFormData({ ...formData, authorization_status: e.target.value as AuthorizationStatus })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                  >
                    <option value="authorized">✓ Authorized</option>
                    <option value="unauthorized">⚠ Unauthorized</option>
                    <option value="expired">⚠ Expired</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1">Company / Contractor Name *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="e.g. ABC Construction Ltd"
                  className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Designated Driver Name</label>
                  <input
                    type="text"
                    value={formData.driver_name}
                    onChange={(e) => setFormData({ ...formData, driver_name: e.target.value })}
                    placeholder="e.g. Murugan Selvam"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Driver Contact Number</label>
                  <input
                    type="text"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                    placeholder="e.g. +91 98452 11029"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1">Permit Start Date</label>
                  <input
                    type="date"
                    value={formData.permit_start_date}
                    onChange={(e) => setFormData({ ...formData, permit_start_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1">Permit Expiry Date</label>
                  <input
                    type="date"
                    value={formData.permit_expiry_date}
                    onChange={(e) => setFormData({ ...formData, permit_expiry_date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 text-slate-900"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingVehicle(null);
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium border border-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Register Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-xl p-6 max-w-sm w-full space-y-4 font-mono text-xs shadow-xl">
            <h3 className="text-sm font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Confirm Deletion
            </h3>
            <p className="text-slate-600">
              Are you sure you want to remove this vehicle from the authorized site registry? Any future CCTV sightings will trigger an Unauthorized Vehicle alert.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
