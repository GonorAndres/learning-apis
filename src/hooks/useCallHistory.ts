"use client";

import { create } from "zustand";

export type CallRecord = {
  id: string;
  timestamp: number;
  apiId: string;
  apiName: string;
  color: string;
  method: string;
  url: string;
  status: number;
  latency: number;
  responseBody: unknown;
  responseSize: number;
};

type CallHistoryState = {
  records: CallRecord[];
  selectedId: string | null;
  compareId: string | null;
  hydrated: boolean;
  addRecord: (record: Omit<CallRecord, "id" | "timestamp">) => void;
  hydrate: () => void;
  select: (id: string | null) => void;
  setCompare: (id: string | null) => void;
  clear: () => void;
};

const MAX_RECORDS = 50;

function loadFromStorage(): CallRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("call-history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveToStorage(records: CallRecord[]) {
  try {
    localStorage.setItem("call-history", JSON.stringify(records.slice(-MAX_RECORDS)));
  } catch {
    // quota exceeded - trim and retry
    try {
      localStorage.setItem("call-history", JSON.stringify(records.slice(-20)));
    } catch {
      // give up
    }
  }
}

export const useCallHistory = create<CallHistoryState>((set) => ({
  records: [],
  selectedId: null,
  compareId: null,
  hydrated: false,

  hydrate: () => {
    const records = loadFromStorage();
    set({ records, hydrated: true });
  },

  addRecord: (record) => {
    const newRecord: CallRecord = {
      ...record,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: Date.now(),
    };
    set((state) => {
      const records = [...state.records, newRecord].slice(-MAX_RECORDS);
      saveToStorage(records);
      return { records };
    });
  },

  select: (id) => set({ selectedId: id, compareId: null }),
  setCompare: (id) => set({ compareId: id }),
  clear: () => {
    localStorage.removeItem("call-history");
    set({ records: [], selectedId: null, compareId: null });
  },
}));
