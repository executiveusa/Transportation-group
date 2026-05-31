"use client";

import { useState, useEffect } from "react";
import { getDriverConfig } from "@/lib/driver-config";

const driver = getDriverConfig();

export default function DrivingModeToggle() {
  const [drivingMode, setDrivingMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/driving-mode")
      .then((r) => r.json())
      .then((data: { enabled?: boolean }) => {
        if (typeof data.enabled === "boolean") setDrivingMode(data.enabled);
      })
      .catch(() => {});
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
        setError(data.error ?? "Failed to update");
        return;
      }
      const data = (await res.json()) as { enabled?: boolean };
      if (typeof data.enabled === "boolean") setDrivingMode(data.enabled);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {error && (
        <div className="mb-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs rounded-lg px-3 py-2 max-w-[200px]">
          {error}
        </div>
      )}
      {drivingMode ? (
        <div className="bg-red-600 text-white rounded-full px-6 py-4 shadow-lg min-w-[220px]">
          <div className="flex items-center gap-2 mb-1">
            <CarIcon />
            <span className="font-bold text-sm uppercase tracking-wide">Driving Mode</span>
          </div>
          <p className="text-red-200 text-xs mb-3">AI handling all calls</p>
          <button
            onClick={toggle}
            disabled={loading}
            className="w-full bg-white text-red-600 font-semibold text-xs px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "End Mode"}
          </button>
        </div>
      ) : (
        <button
          onClick={toggle}
          disabled={loading}
          className="bg-navy hover:bg-navy/90 text-white font-semibold px-6 py-3.5 rounded-full shadow-lg flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <CarIcon />
          <span className="text-sm">Driving Mode</span>
        </button>
      )}
    </div>
  );
}

function CarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
      <circle cx="7.5" cy="17.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  );
}
