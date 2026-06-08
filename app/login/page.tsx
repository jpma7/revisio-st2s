'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'PapaPourLana') {
      const hash = btoa(password);
      document.cookie = `site-auth=${hash}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 jours
      router.push('/');
      router.refresh();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4">
      <div className="bg-slate-800/50 backdrop-blur p-8 rounded-2xl border border-slate-700 shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-center mb-2 text-emerald-400">🔒 Révisio ST2S</h1>
        <p className="text-slate-300 text-center mb-6 text-sm">
          Site privé — Entre le mot de passe pour accéder aux révisions.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe..."
            className="w-full px-4 py-3 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-emerald-400 transition-colors"
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg transition-colors"
          >
            Entrer
          </button>
        </form>
      </div>
    </div>
  );
}
