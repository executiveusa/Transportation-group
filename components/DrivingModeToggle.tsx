"use client";

import { useState, useEffect } from "react";

export default function DrivingModeToggle() {
  const [drivingMode, setDrivingMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Hydrate initial state from API
  useEffect(() => {
    setMounted(true);
    fetch("/api/driving-mode")
      .then((r) => r.json())
      .then((data: { enabled?: boolean }) => {
        if (typeof data.enabled === "boolean") {
          setDrivingMode(data.enabled);
        }
      })
      .catch(() => {
        // Default to off if API unavailable
      });
  }, []);

  const toggle = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/driving-mode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !drivingMode }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setError(data.error ?? "Failed to update driving mode");
        return;
      }
      const data = (await res.json()) as { enabled?: boolean };
      if (typeof data.enabled === "boolean") {
        setDrivingMode(data.enabled);
      }
    } catch {
      setError("Network error — could not reach server");
    } finally {
      setLoading(false);
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {error && (
        <div className="mb-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-lg px-3 py-2 max-w-[200px]">
          {error}
        </div>
      )}
      {drivingMode ? (
        <div className="bg-brand-red text-white rounded-2xl px-5 py-4 shadow-2xl min-w-[200px]">
          <div className="flex items-center gap-2 mb-1">
            <CarIcon />
            <span className="font-bold text-sm uppercase tracking-wide">
              Driving Mode On
            </span>
          </div>
          <p className="text-red-200 text-xs mb-3">
            AI handling all calls &amp; bookings
          </p>
          <button
            onClick={toggle}
            disabled={loading}
            className="w-full bg-white text-brand-red font-semibold text-sm px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "End Driving Mode"}
          </button>
        </div>
      ) : (
        <button
          onClick={toggle}
          disabled={loading}
          className="bg-[#0f2744] hover:bg-[#1e3a5f] text-white font-semibold px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <CarIcon />
          <span className="text-sm">{loading ? "..." : "Start Driving Mode"}</span>
        </button>
      )}
    </div>
  );
}

function CarIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
