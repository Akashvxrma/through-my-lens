'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 bg-neutral-900 p-8 rounded border border-neutral-800">
      <h1 className="text-xl font-semibold text-white text-center mb-6">Admin Sign In</h1>

      {errorMsg && (
        <div className="p-3 bg-red-950 border border-red-800 text-red-200 text-sm rounded">
          {errorMsg}
        </div>
      )}

      <div>
        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2.5 bg-white text-black font-medium text-sm rounded hover:bg-neutral-200 transition disabled:opacity-50"
      >
        {loading ? 'Authenticating...' : 'Sign In'}
      </button>
    </form>
  );
}
