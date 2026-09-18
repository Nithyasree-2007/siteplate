import React, { useState } from 'react';
import { HardHat, ShieldCheck, KeyRound, UserCheck, AlertCircle } from 'lucide-react';
import { UserSession } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin_security');
  const [password, setPassword] = useState('siteguard2026');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        username: username.trim(),
        name: username.includes('admin') ? 'Chief Inspector Davis' : 'Gate Operator Patel',
        role: username.includes('admin') ? 'Site Security Admin' : 'Gate Operations Officer',
        shift: 'Day Shift (Gate 01-03)',
        token: `jwt_sim_${Date.now()}`,
      });
    }, 450);
  };

  const handleFillDemo = (role: 'admin' | 'operator') => {
    if (role === 'admin') {
      setUsername('admin_security');
      setPassword('siteguard2026');
    } else {
      setUsername('gate_operator');
      setPassword('cctvoperator2026');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e140_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e140_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      {/* Industrial Hazard Stripe Accent Bar */}
      <div className="w-full max-w-md h-2.5 bg-[repeating-linear-gradient(45deg,#f59e0b,#f59e0b_12px,#0f172a_12px,#0f172a_24px)] rounded-t-xl mb-0 shadow-sm" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white border border-slate-200 border-t-0 rounded-b-xl shadow-xl p-6 sm:p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 mb-3 shadow-lg shadow-amber-500/20">
            <HardHat className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-slate-900 font-mono">
            SITE<span className="text-amber-600">PLATE</span> AI
          </h1>
          <p className="text-xs text-slate-500 font-mono uppercase tracking-wider mt-1">
            Construction Vehicle & License Plate Monitoring
          </p>
        </div>

        {/* Security Notification Banner */}
        <div className="mb-6 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-600 font-mono">
          <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Authorized security personnel only. All CCTV streams, vehicle detections, and ANPR OCR logs are cryptographically recorded.
          </span>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700 font-mono">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5" htmlFor="login-username">
              Username / Badge ID
            </label>
            <div className="relative">
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin_security"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:bg-white transition"
              />
              <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-1.5" htmlFor="login-password">
              Security Passcode
            </label>
            <div className="relative">
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-mono placeholder-slate-400 focus:outline-none focus:bg-white transition"
              />
              <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 active:scale-[0.99] text-slate-950 font-black text-xs font-mono uppercase tracking-wider rounded-lg transition shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              'Access Security Operations'
            )}
          </button>
        </form>

        {/* Demo Fast-fill Buttons */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500 font-mono mb-2">PROTOTYPE QUICK LOGIN:</p>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleFillDemo('admin')}
              className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-700 transition cursor-pointer font-medium"
            >
              Admin (Davis)
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('operator')}
              className="px-3 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-mono text-slate-700 transition cursor-pointer font-medium"
            >
              Operator (Patel)
            </button>
          </div>
        </div>
      </div>

      {/* System info footnote */}
      <div className="text-center mt-6 text-xs text-slate-500 font-mono">
        SitePlate ANPR Engine v2.4 • Edge YOLOv8 + PaddleOCR Multi-Frame Fusion
      </div>
    </div>
  );
};
