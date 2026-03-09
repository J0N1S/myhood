import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { isTokenExpired, tryRefreshToken, clearTokens, getAccessToken } from '../utils/auth';

/**
 * Wraps a route so that:
 * 1. If the token is valid → render children.
 * 2. If the token is expired but refresh succeeds → render children.
 * 3. If both fail → clear tokens and redirect to /login.
 *
 * Shows a tiny loading spinner while the async refresh is in progress.
 */
export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const check = async () => {
      // Fast path: token still valid
      if (!isTokenExpired()) {
        setAllowed(true);
        setChecking(false);
        return;
      }

      // Try a silent refresh
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        setAllowed(true);
      } else {
        clearTokens();
        setAllowed(false);
      }
      setChecking(false);
    };

    check();

    // Also schedule a periodic re-check every 60 seconds
    const interval = setInterval(async () => {
      if (isTokenExpired()) {
        const refreshed = await tryRefreshToken();
        if (!refreshed) {
          clearTokens();
          navigate('/login', { replace: true });
        }
      }
    }, 60_000);

    return () => clearInterval(interval);
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 font-semibold text-sm">იტვირთება...</span>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
