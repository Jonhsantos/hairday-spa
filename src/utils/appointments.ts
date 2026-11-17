import type { Appointment, AppointmentInput, Period } from '../types/appointment';

export function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return day <= days[month - 1];
}

export function isValidTime(value: string): boolean {
  return /^(0[6-9]|1\d|2[0-3]):[0-5]\d$/.test(value);
}

export function validateAppointment(
  input: AppointmentInput,
  appointments: readonly Appointment[],
): string | null {
  if (!input.customer.trim()) return 'Informe o nome do cliente.';
  if (!isValidDate(input.date)) return 'Informe uma data válida.';
  if (!isValidTime(input.time)) return 'Informe um horário válido entre 06:00 e 23:59.';
  if (appointments.some((item) => item.date === input.date && item.time === input.time)) {
    return 'Já existe um agendamento para este horário.';
  }
  return null;
}

export function groupAppointments(
  appointments: readonly Appointment[],
  date: string,
): Record<Period, Appointment[]> {
  const groups: Record<Period, Appointment[]> = { morning: [], afternoon: [], night: [] };
  return appointments
    .filter((item) => item.date === date && isValidTime(item.time))
    .slice()
    .sort((a, b) => a.time.localeCompare(b.time))
    .reduce((result, item) => {
      const hour = Number(item.time.slice(0, 2));
      const period: Period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'night';
      result[period].push(item);
      return result;
    }, groups);
}
