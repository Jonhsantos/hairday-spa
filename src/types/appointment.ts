export interface Appointment {
  id: string;
  customer: string;
  date: string;
  time: string;
}

export type AppointmentInput = Omit<Appointment, 'id'>;
export type Period = 'morning' | 'afternoon' | 'night';
