import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  Database,
  Terminal,
  Copy,
  RefreshCw,
} from 'lucide-react';
import { CameraConfig } from '../types';
import { INITIAL_CAMERAS } from '../services/mockData';

interface SettingsPageProps {
  isBackendConnected: boolean;
  onToggleMode: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  isBackendConnected,
  onToggleMode,
}) => {
  const [cameras, setCameras] = useState<CameraConfig[]>(INITIAL_CAMERAS);
  const [yoloVehicleConf, setYoloVehicleConf] = useState(0.55);
  const [yoloPlateConf, setYoloPlateConf] = useState(0.65);
  const [ocrEngine, setOcrEngine] = useState<'PaddleOCR' | 'EasyOCR'>('PaddleOCR');
  const [fusionWindowSize, setFusionWindowSize] = useState(5);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const fastApiCommand = `cd backend
python -m venv venv
source venv/bin/activate  # Or .\\venv\\Scripts\\activate on Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000 --reload`;

  return (
    <div id="settings-page" className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-mono">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-600" />
          SYSTEM CONFIGURATION & BACKEND INTEGRATION
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Adjust computer vision hyperparameters, RTSP camera streams, and deploy the Python FastAPI ANPR engine.
        </p>
      </div>

      {/* Mode Selector Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">SYSTEM RUNTIME MODE</h3>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
              isBackendConnected
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {isBackendConnected ? 'CONNECTED: FASTAPI BACKEND' : 'ACTIVE: DEMO SIMULATOR'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isBackendConnected
              ? 'The system communicates directly with local/remote REST API endpoints at /api/*.'
              : 'Interactive synthetic CCTV stream and in-memory simulated multi-frame fusion engine enabled.'}
          </p>
        </div>

        <button
          onClick={onToggleMode}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs rounded-lg transition border border-slate-200 cursor-pointer w-fit font-semibold"
        >
          <RefreshCw className="w-4 h-4 text-amber-600" />
          Toggle Runtime Mode
        </button>
      </div>

      {/* CV Hyperparameters */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-600" />
          COMPUTER VISION & OCR HYPERPARAMETERS
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* YOLO Vehicle Conf */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-700 font-semibold">YOLO Vehicle Detection Confidence:</span>
              <span className="text-amber-700 font-bold">{Math.round(yoloVehicleConf * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.30"
              max="0.95"
              step="0.05"
              value={yoloVehicleConf}
              onChange={(e) => setYoloVehicleConf(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Minimum threshold for identifying truck, car, and van classes.</p>
          </div>

          {/* YOLO Plate Conf */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-700 font-semibold">YOLO License Plate Detector Threshold:</span>
              <span className="text-amber-700 font-bold">{Math.round(yoloPlateConf * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.40"
              max="0.95"
              step="0.05"
              value={yoloPlateConf}
              onChange={(e) => setYoloPlateConf(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Threshold for localized license plate bounding box extraction.</p>
          </div>

          {/* OCR Engine Selection */}
          <div className="space-y-2 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-slate-700 font-semibold block">Primary Optical Character Recognition (OCR):</span>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ocrEngine"
                  checked={ocrEngine === 'PaddleOCR'}
                  onChange={() => setOcrEngine('PaddleOCR')}
                  className="accent-amber-500"
                />
                <span className="text-slate-800 font-medium">PaddleOCR (Recommended)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="ocrEngine"
                  checked={ocrEngine === 'EasyOCR'}
                  onChange={() => setOcrEngine('EasyOCR')}
                  className="accent-amber-500"
                />
                <span className="text-slate-800 font-medium">EasyOCR</span>
              </label>
            </div>
            <p className="text-[11px] text-slate-500">PaddleOCR provides faster lightweight mobile inference on construction edge devices.</p>
          </div>

          {/* Multi-Frame Fusion Window */}
          <div className="space-y-1.5 bg-slate-50 p-4 rounded-lg border border-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-700 font-semibold">Multi-Frame OCR Fusion Window:</span>
              <span className="text-sky-700 font-bold">{fusionWindowSize} Frames</span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              step="1"
              value={fusionWindowSize}
              onChange={(e) => setFusionWindowSize(parseInt(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">Number of successive video frames combined for character voting consensus.</p>
          </div>
        </div>
      </div>

      {/* Python FastAPI Backend Setup & Documentation */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-600" />
            PYTHON FASTAPI BACKEND ARCHITECTURE & LOCAL SETUP
          </h3>
          <span className="text-xs text-slate-500">REST API + SQLite / PostgreSQL</span>
        </div>

        <p className="text-xs text-slate-600">
          The full Python FastAPI backend codebase is organized in the <code className="bg-slate-100 px-1.5 py-0.5 rounded text-amber-700 border border-slate-200">backend/</code> directory, complete with OpenCV, YOLOv8 object & plate detection models, ByteTrack tracking, PaddleOCR, and SQLite database migration scripts.
        </p>

        {/* Setup Terminal Snippet */}
        <div className="relative bg-slate-900 border border-slate-800 rounded-lg p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[11px] text-slate-400 font-bold uppercase">Setup Commands:</span>
            <button
              onClick={() => copyToClipboard(fastApiCommand, 'fastapi')}
              className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedSection === 'fastapi' ? 'Copied!' : 'Copy Shell Script'}
            </button>
          </div>
          <pre className="text-xs text-emerald-400 overflow-x-auto leading-relaxed">
            {fastApiCommand}
          </pre>
        </div>

        {/* Database Migration Path */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-800 font-bold">
            <Database className="w-4 h-4 text-amber-600" />
            Database Architecture & PostgreSQL / Supabase Migration
          </div>
          <p className="text-slate-600">
            The database uses SQLAlchemy with SQLite for immediate local execution, with zero configuration needed. The models in <code className="text-slate-800">backend/models/schemas.py</code> are 100% compliant with PostgreSQL and Supabase. To switch to PostgreSQL, simply set <code className="text-amber-700 font-mono">DATABASE_URL=postgresql://user:password@localhost:5432/construction_anpr</code> in your <code className="text-slate-800">.env</code> file.
          </p>
        </div>
      </div>
    </div>
  );
};
