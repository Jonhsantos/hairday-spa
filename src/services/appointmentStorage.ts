import type { Appointment } from '../types/appointment';
import { isValidDate, isValidTime } from '../utils/appointments';

export const STORAGE_KEY = 'hairday:appointments';

function isAppointment(value: unknown): value is Appointment {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === 'string' &&
    item.id.trim().length > 0 &&
    typeof item.customer === 'string' &&
    item.customer.trim().length > 0 &&
    typeof item.date === 'string' &&
    isValidDate(item.date) &&
    typeof item.time === 'string' &&
    isValidTime(item.time)
  );
}

export type StorageResult =
  | { ok: true; appointments: Appointment[] }
  | { ok: false; appointments: Appointment[] };

export function loadAppointments(): StorageResult {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return { ok: true, appointments: [] };
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return { ok: false, appointments: [] };
    const valid = value.filter(isAppointment);
    // Keep the original storage untouched when any data cannot be safely interpreted.
    return { ok: valid.length === value.length, appointments: valid };
  } catch {
    return { ok: false, appointments: [] };
  }
}

export function saveAppointments(appointments: readonly Appointment[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    return true;
  } catch {
    return false;
  }
}
