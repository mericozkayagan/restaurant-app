'use client';

import { useSession, signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function DebugPage() {
  const { data: session, status } = useSession();
  const [cookies, setCookies] = useState<string>('Loading...');

  useEffect(() => {
    setCookies(document.cookie);
  }, []);

  async function checkBackendSession() {
    try {
      const res = await fetch('/api/auth/test');
      const data = await res.json();
      alert(JSON.stringify(data, null, 2));
    } catch (error) {
      alert('Error checking backend session: ' + error);
    }
  }

  async function forceSignIn() {
    await signIn('credentials', {
      redirect: false,
      // Leave email and password empty - we'll show the sign-in page
    });
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Auth Debug Page</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Session Status</h2>
        <p><strong>Status:</strong> {status}</p>
        <p><strong>Authenticated:</strong> {session ? 'Yes' : 'No'}</p>
        {session && (
          <div>
            <p><strong>User:</strong> {session.user?.name || session.user?.email}</p>
            <p><strong>Role:</strong> {session.user?.role}</p>
          </div>
        )}
      </div>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-xl font-semibold mb-2">Cookies</h2>
        <pre className="whitespace-pre-wrap bg-white p-2 rounded text-sm">
          {cookies}
        </pre>
      </div>

      <div className="flex gap-4">
        <button
          onClick={checkBackendSession}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Check Backend Session
        </button>

        <button
          onClick={forceSignIn}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Force Sign In
        </button>
      </div>
    </div>
  );
}