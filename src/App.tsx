import { useState, type FormEvent } from 'react';
import { useAppointments } from './hooks/useAppointments';
import { groupAppointments } from './utils/appointments';
import type { Appointment, Period } from './types/appointment';
import styles from './App.module.css';

const periods: { key: Period; title: string; range: string; icon: string; hours: string[] }[] = [
  { key: 'morning', title: 'Manhã', range: '06h-12h', icon: '☼', hours: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00'] },
  { key: 'afternoon', title: 'Tarde', range: '12h-18h', icon: '☁', hours: ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00'] },
  { key: 'night', title: 'Noite', range: '18h-24h', icon: '☾', hours: ['18:00', '19:00', '20:00', '21:00', '22:00', '23:00'] },
];

function today() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function TrashIcon() {
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m5 4v6m4-6v6" /></svg>;
}

function PeriodList({ title, range, icon, items, remove }: { title: string; range: string; icon: string; items: Appointment[]; remove: (id: string) => void }) {
  return <section className={styles.period} aria-label={title}>
    <header className={styles.periodHeader}><span><span className={styles.periodIcon} aria-hidden="true">{icon}</span>{title}</span><span>{range}</span></header>
    <div className={styles.entries}>
      {items.length === 0 ? <p className={styles.empty}>Você ainda não tem agendamentos cadastrados nesse período.</p> : items.map((item) =>
        <div className={styles.entry} key={item.id}><time>{item.time}</time><span>{item.customer}</span><button type="button" className={styles.delete} onClick={() => remove(item.id)} aria-label={`Excluir agendamento de ${item.customer} às ${item.time}`}><TrashIcon /></button></div>)}
    </div>
  </section>;
}

export default function App() {
  const { appointments, add, remove, storageWarning } = useAppointments();
  const [date, setDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(today);
  const [time, setTime] = useState('');
  const [customer, setCustomer] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const grouped = groupAppointments(appointments, selectedDate);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const error = add({ date, time, customer });
    if (error) { setMessage(error); setSuccess(''); return; }
    setMessage('');
    setSuccess('Agendamento cadastrado com sucesso.');
    setCustomer('');
    setTime('');
    setSelectedDate(date);
  }

  return <div className={styles.layout}>
    <aside className={styles.sidebar}>
      <div className={styles.logo}>HairDay <span aria-hidden="true">✂</span></div>
      <div className={styles.formContent}>
        <h1>Agende um atendimento</h1>
        <p className={styles.subtitle}>Selecione data, horário e informe o nome do cliente para criar o agendamento</p>
        <form onSubmit={submit} noValidate>
          <label className={styles.label} htmlFor="appointment-date">Data</label>
          <input className={styles.input} id="appointment-date" type="date" value={date} onChange={(event) => { setDate(event.target.value); setTime(''); }} />
          <fieldset className={styles.hours}><legend>Horários</legend>
            {periods.map((period) => <div key={period.key} className={styles.hourGroup}><div>{period.title}</div><div className={styles.slots}>{period.hours.map((slot) => {
              const occupied = appointments.some((item) => item.date === date && item.time === slot);
              return <button key={slot} type="button" disabled={occupied} aria-pressed={time === slot} className={time === slot ? styles.selected : ''} onClick={() => setTime(slot)}>{slot}</button>;
            })}</div></div>)}
            <label className={styles.customTime} htmlFor="custom-time">Outro horário</label>
            <input className={styles.input} id="custom-time" type="time" min="06:00" max="23:59" value={time} onChange={(event) => setTime(event.target.value)} />
          </fieldset>
          <label className={styles.label} htmlFor="customer">Cliente</label>
          <input className={styles.input} id="customer" value={customer} onChange={(event) => setCustomer(event.target.value)} placeholder="Nome do cliente" autoComplete="name" />
          {message && <p className={styles.error} role="alert">{message}</p>}
          <p className={styles.feedback} aria-live="polite">{success}</p>
          <button className={styles.submit} type="submit">AGENDAR</button>
        </form>
      </div>
    </aside>
    <main className={styles.main}>
      <div className={styles.heading}><div><h2>Sua agenda</h2><p className={styles.subtitle}>Consulte os seus cortes de cabelo agendados por dia</p></div><label className={styles.filter}><span className={styles.srOnly}>Data da agenda</span><input className={styles.input} type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label></div>
      {storageWarning && <p role="alert" className={styles.warning}>Não foi possível salvar os dados com segurança. As alterações ficarão disponíveis apenas nesta sessão.</p>}
      <div className={styles.periods}>{periods.map((period) => <PeriodList key={period.key} title={period.title} range={period.range} icon={period.icon} items={grouped[period.key]} remove={remove} />)}</div>
    </main>
  </div>;
}
