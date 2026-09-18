import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavigationPage } from './components/Sidebar';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { VehicleDossierModal } from './components/VehicleDossierModal';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LiveMonitoringPage } from './pages/LiveMonitoringPage';
import { VehicleManagementPage } from './pages/VehicleManagementPage';
import { VehicleHistoryPage } from './pages/VehicleHistoryPage';
import { AlertsPage } from './pages/AlertsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { api } from './services/api';
import {
  INITIAL_VEHICLES,
  INITIAL_ALERTS,
  INITIAL_HISTORY,
  INITIAL_ANALYTICS,
} from './services/mockData';
import {
  Vehicle,
  Alert,
  EntryExitLog,
  AnalyticsData,
  Detection,
  UserSession,
  AlertStatus,
} from './types';
import { CheckCircle2, ShieldAlert, X } from 'lucide-react';

export function App() {
  // Navigation and Auth
  const [currentPage, setCurrentPage] = useState<NavigationPage>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserSession | null>({
    username: 'admin_security',
    name: 'Chief Inspector Davis',
    role: 'Site Security Admin',
    shift: 'Day Shift (06:00 - 18:00)',
    token: 'jwt_mock_token_siteguard_2026',
  });

  // App Data initialized with robust defaults
  const [vehicles, setVehicles] = useState<Vehicle[]>([...INITIAL_VEHICLES]);
  const [alerts, setAlerts] = useState<Alert[]>([...INITIAL_ALERTS]);
  const [history, setHistory] = useState<EntryExitLog[]>([...INITIAL_HISTORY]);
  const [analytics, setAnalytics] = useState<AnalyticsData>({ ...INITIAL_ANALYTICS });
  const [detections, setDetections] = useState<Detection[]>([]);
  const [activeCamera, setActiveCamera] = useState('Gate-01');
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Modals & Overlays
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedPlateDossier, setSelectedPlateDossier] = useState<string | null>(null);
  const [activeNotification, setActiveNotification] = useState<{
    type: 'alert' | 'success';
    title: string;
    message: string;
  } | null>(null);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial Data Fetching
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [vData, aData, hData, stats, dData] = await Promise.all([
        api.getVehicles(),
        api.getAlerts(),
        api.getHistory(),
        api.getAnalytics(),
        api.getDetections(),
      ]);
      setVehicles(Array.isArray(vData) ? vData : INITIAL_VEHICLES);
      setAlerts(Array.isArray(aData) ? aData : INITIAL_ALERTS);
      setHistory(Array.isArray(hData) ? hData : INITIAL_HISTORY);
      if (stats && Array.isArray(stats.vehicles_per_hour)) {
        setAnalytics(stats);
      } else {
        setAnalytics({ ...INITIAL_ANALYTICS, ...(stats || {}) });
      }
      setDetections(Array.isArray(dData) ? dData : []);
      setIsBackendConnected(api.isLive());
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  // Handlers
  const handleToggleBackend = () => {
    const nextState = !isBackendConnected;
    api.setLiveMode(nextState);
    setIsBackendConnected(nextState);
    loadAllData();
    showToast(
      'success',
      'Runtime Switch',
      nextState ? 'Connected to FastAPI backend' : 'Switched to Demo Simulator mode'
    );
  };

  const handleAddVehicle = async (v: Omit<Vehicle, 'id' | 'created_at'>) => {
    const created = await api.createVehicle(v);
    setVehicles((prev) => [created, ...prev]);
    showToast('success', 'Vehicle Registered', `${v.plate_number} added to authorized site registry`);
  };

  const handleUpdateVehicle = async (id: string, updates: Partial<Vehicle>) => {
    const updated = await api.updateVehicle(id, updates);
    setVehicles((prev) => prev.map((v) => (v.id === id ? updated : v)));
    showToast('success', 'Vehicle Updated', `Permit details updated for ${updated.plate_number}`);
  };

  const handleDeleteVehicle = async (id: string) => {
    await api.deleteVehicle(id);
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    showToast('alert', 'Vehicle Removed', 'Vehicle permit deleted from registry');
  };

  const handleUpdateAlertStatus = async (id: string, status: AlertStatus, notes?: string) => {
    const updated = await api.updateAlertStatus(id, status, notes);
    setAlerts((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const handleRecordGateEvent = (evt: any) => {
    const newLog: EntryExitLog = {
      id: `LOG-${Date.now()}`,
      vehicle_id: evt.vehicle_id,
      plate_number: evt.plate_number,
      vehicle_type: evt.vehicle_type,
      company: evt.company,
      driver_name: 'Site Driver',
      camera_id: evt.camera_id,
      entry_time: evt.time,
      exit_time: evt.type === 'exit' ? evt.time : null,
      duration_minutes: evt.type === 'exit' ? Math.floor(Math.random() * 45 + 15) : null,
      status: evt.type === 'exit' ? 'Exited' : 'Currently Inside',
      authorization_status: evt.auth_status,
      ocr_confidence: 96,
      date: new Date().toISOString().split('T')[0],
    };

    setHistory((prev) => [newLog, ...prev]);

    // If unauthorized or expired, trigger an Alert
    if (evt.auth_status === 'unauthorized') {
      const newAlert: Alert = {
        id: `ALT-${Date.now()}`,
        type: 'unauthorized_vehicle',
        plate_number: evt.plate_number,
        vehicle_id: evt.vehicle_id,
        camera_id: evt.camera_id,
        camera_name: evt.camera_id === 'Gate-01' ? 'Gate 01 - North Heavy Haul' : 'Gate 02 - South Materials Gate',
        timestamp: evt.time,
        status: 'new',
        severity: 'high',
        title: 'Unauthorized Vehicle Detected at Gate',
        description: `Vehicle with plate ${evt.plate_number} detected crossing gate line without valid entry permit.`,
      };
      setAlerts((prev) => [newAlert, ...prev]);
      showToast('alert', 'Security Alert: Unauthorized Vehicle', `Plate: ${evt.plate_number} detected at ${evt.camera_id}`);
    } else if (evt.auth_status === 'expired') {
      const newAlert: Alert = {
        id: `ALT-${Date.now()}`,
        type: 'expired_permit',
        plate_number: evt.plate_number,
        vehicle_id: evt.vehicle_id,
        camera_id: evt.camera_id,
        camera_name: 'Gate 01 - North Heavy Haul',
        timestamp: evt.time,
        status: 'new',
        severity: 'medium',
        title: 'Expired Permit Sighting',
        description: `Vehicle ${evt.plate_number} permit expired. Access verification required.`,
      };
      setAlerts((prev) => [newAlert, ...prev]);
    }
  };

  const handleRecordDetection = (det: Detection) => {
    setDetections((prev) => [det, ...prev.slice(0, 49)]);
  };

  const showToast = (type: 'alert' | 'success', title: string, message: string) => {
    setActiveNotification({ type, title, message });
    setTimeout(() => {
      setActiveNotification(null);
    }, 4500);
  };

  // If user logged out, show Login screen
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    );
  }

  const unreadAlertCount = alerts.filter((a) => a.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-900">
      {/* Top Navigation Bar */}
      <Navbar
        user={currentUser}
        onLogout={() => setCurrentUser(null)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateToAlerts={() => setCurrentPage('alerts')}
        unreadAlertsCount={unreadAlertCount}
        activeCamera={activeCamera}
        onChangeCamera={(cam) => setActiveCamera(cam)}
        isBackendConnected={isBackendConnected}
        onToggleMode={handleToggleBackend}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => setCurrentPage(page)}
          unreadAlertsCount={unreadAlertCount}
          vehiclesCount={vehicles.length}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/60">
          {currentPage === 'dashboard' && analytics && (
            <DashboardPage
              analytics={analytics}
              recentHistory={history}
              recentAlerts={alerts}
              onNavigateToMonitoring={() => setCurrentPage('monitoring')}
              onNavigateToAlerts={() => setCurrentPage('alerts')}
              onNavigateToHistory={() => setCurrentPage('history')}
              onSelectPlate={(plate) => setSelectedPlateDossier(plate)}
            />
          )}

          {currentPage === 'monitoring' && (
            <LiveMonitoringPage
              activeCamera={activeCamera}
              onChangeCamera={(cam) => setActiveCamera(cam)}
              onSelectPlate={(plate) => setSelectedPlateDossier(plate)}
              onRecordGateEvent={handleRecordGateEvent}
              onRecordDetection={handleRecordDetection}
              vehicles={vehicles}
            />
          )}

          {currentPage === 'vehicles' && (
            <VehicleManagementPage
              vehicles={vehicles}
              onAddVehicle={handleAddVehicle}
              onUpdateVehicle={handleUpdateVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onSelectPlate={(plate) => setSelectedPlateDossier(plate)}
            />
          )}

          {currentPage === 'history' && (
            <VehicleHistoryPage
              history={history}
              onSelectPlate={(plate) => setSelectedPlateDossier(plate)}
            />
          )}

          {currentPage === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onUpdateAlertStatus={handleUpdateAlertStatus}
              onSelectPlate={(plate) => setSelectedPlateDossier(plate)}
            />
          )}

          {currentPage === 'analytics' && analytics && (
            <AnalyticsPage
              analytics={analytics}
              onSelectPlate={(plate) => setSelectedPlateDossier(plate)}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsPage
              isBackendConnected={isBackendConnected}
              onToggleMode={handleToggleBackend}
            />
          )}
        </main>
      </div>

      {/* Global Search Modal (Cmd + K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        vehicles={vehicles}
        history={history}
        detections={detections}
        onSelectPlate={(plate) => {
          setIsSearchOpen(false);
          setSelectedPlateDossier(plate);
        }}
      />

      {/* Vehicle Dossier Modal */}
      {selectedPlateDossier && (
        <VehicleDossierModal
          plateNumber={selectedPlateDossier}
          vehicle={vehicles.find(
            (v) => v.plate_number.toUpperCase() === selectedPlateDossier.toUpperCase()
          )}
          historyLogs={history}
          onClose={() => setSelectedPlateDossier(null)}
          onNavigateToHistory={() => {
            setSelectedPlateDossier(null);
            setCurrentPage('history');
          }}
        />
      )}

      {/* Real-time Floating Security Toast Notification */}
      {activeNotification && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in">
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl font-mono text-xs max-w-sm ${
              activeNotification.type === 'alert'
                ? 'bg-white border-red-200 text-red-700 shadow-red-100'
                : 'bg-white border-emerald-200 text-emerald-800 shadow-emerald-100'
            }`}
          >
            <div className={`p-1.5 rounded-lg ${activeNotification.type === 'alert' ? 'bg-red-50' : 'bg-emerald-50'}`}>
              {activeNotification.type === 'alert' ? (
                <ShieldAlert className="w-5 h-5 text-red-600" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-slate-900">{activeNotification.title}</h5>
              <p className="text-slate-600 mt-0.5">{activeNotification.message}</p>
            </div>
            <button
              onClick={() => setActiveNotification(null)}
              className="text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
