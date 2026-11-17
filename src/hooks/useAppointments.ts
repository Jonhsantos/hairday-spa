import { useRef, useState } from 'react';
import { loadAppointments, saveAppointments } from '../services/appointmentStorage';
import type { Appointment, AppointmentInput } from '../types/appointment';
import { validateAppointment } from '../utils/appointments';

export function useAppointments() {
  const [initial] = useState(loadAppointments);
  const [appointments, setAppointments] = useState(initial.appointments);
  const current = useRef(initial.appointments);
  const [storageWarning, setStorageWarning] = useState(!initial.ok);
  const safeToWrite = useRef(initial.ok);

  function commit(next: Appointment[]) {
    current.current = next;
    setAppointments(next);
    if (!safeToWrite.current || !saveAppointments(next)) setStorageWarning(true);
    else setStorageWarning(false);
  }

  function add(input: AppointmentInput): string | null {
    const error = validateAppointment(input, current.current);
    if (error) return error;
    const id = crypto.randomUUID();
    commit([...current.current, { ...input, customer: input.customer.trim(), id }]);
    return null;
  }

  function remove(id: string) {
    commit(current.current.filter((item) => item.id !== id));
  }

  return { appointments, add, remove, storageWarning };
}
