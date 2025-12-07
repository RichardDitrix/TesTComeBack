// app/login/page.tsx
'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error || 'Помилка входу');
      return;
    }

    router.push('/projects');
  }

  return (
    <div className="w-full max-w-md bg-white shadow rounded-xl p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">Вхід</h1>
      {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full border rounded px-3 py-2"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Пароль"
          className="w-full border rounded px-3 py-2"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded bg-blue-600 text-white disabled:opacity-60"
        >
          {loading ? 'Вхід...' : 'Увійти'}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Немає акаунту?{' '}
        <a href="/register" className="text-blue-600 underline">
          Зареєструватися
        </a>
      </p>
    </div>
  );
}
