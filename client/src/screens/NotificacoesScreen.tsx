import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { NotificationToggleItem } from '../components/NotificationToggleItem';
import { TimeSelectorItem } from '../components/TimeSelectorItem';
import { SectionHeader } from '../components/SectionHeader';
import { useNotificationStore } from '../store/notificationStore';
import * as service from '../services/notificationService';

const NotificacoesScreen: React.FC = () => {
  const {
    notificationsEnabled,
    dailyVerseEnabled,
    readingReminderEnabled,
    selectedTimeDailyVerse,
    selectedTimeReadingReminder,
    vibrationEnabled,
    soundEnabled,
    quietHoursStart,
    quietHoursEnd,
    toggleNotifications,
    toggleDailyVerse,
    toggleReadingReminder,
    setDailyTime,
    setReadingTime,
    toggleVibration,
    toggleSound,
    setQuietHours,
  } = useNotificationStore();

  const [scheduled, setScheduled] = useState<{ id: string; type: string; time: string }[]>([]);

  useEffect(() => {
    setScheduled(service.getScheduledNotifications());
  }, []);

  const updateSchedule = () => {
    // clear existing when notifications disabled
    if (!notificationsEnabled) {
      service.cancelAllNotifications();
      setScheduled([]);
      return;
    }
    if (dailyVerseEnabled) service.scheduleDailyVerseNotification(selectedTimeDailyVerse);
    if (readingReminderEnabled) service.scheduleReadingReminder(selectedTimeReadingReminder);
    setScheduled(service.getScheduledNotifications());
  };

  useEffect(() => {
    updateSchedule();
  }, [
    notificationsEnabled,
    dailyVerseEnabled,
    readingReminderEnabled,
    selectedTimeDailyVerse,
    selectedTimeReadingReminder,
  ]);

  return (
    <div className="p-5 max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <PageHeader
        title="Notificações."
        subtitle="Configure alertas e lembretes."
        icon={<Bell className="h-4 w-4" />}
        showBack
      />

      <section className="bg-card border border-foreground/5 rounded-[32px] p-6 shadow-sm">
        <NotificationToggleItem
          label="Ativar Notificações"
          value={notificationsEnabled}
          onChange={toggleNotifications}
        />
      </section>

      <section className="bg-card border border-foreground/5 rounded-[32px] p-6 shadow-sm space-y-4">
        <SectionHeader title="Versículo Diário" description="Receba um versículo por dia" />
        <NotificationToggleItem
          label="Ativar"
          value={dailyVerseEnabled}
          onChange={toggleDailyVerse}
          disabled={!notificationsEnabled}
        />
        <TimeSelectorItem
          label="Horário"
          time={selectedTimeDailyVerse}
          onChange={setDailyTime}
          disabled={!dailyVerseEnabled || !notificationsEnabled}
        />
        <p>Próxima: {scheduled.find((n) => n.type === 'daily')?.time || '-'}</p>
      </section>

      <section className="bg-card border border-foreground/5 rounded-[32px] p-6 shadow-sm space-y-4">
        <SectionHeader title="Lembrete de Leitura" description="Lembrete diário para leitura" />
        <NotificationToggleItem
          label="Ativar"
          value={readingReminderEnabled}
          onChange={toggleReadingReminder}
          disabled={!notificationsEnabled}
        />
        <TimeSelectorItem
          label="Horário"
          time={selectedTimeReadingReminder}
          onChange={setReadingTime}
          disabled={!readingReminderEnabled || !notificationsEnabled}
        />
        <p>Próxima: {scheduled.find((n) => n.type === 'reading')?.time || '-'}</p>
      </section>

      <section className="bg-card border border-foreground/5 rounded-[32px] p-6 shadow-sm space-y-4">
        <SectionHeader title="Sons e Vibração" description="Ajuste feedback sonoro e vibração" />
        <NotificationToggleItem
          label="Som"
          value={soundEnabled}
          onChange={toggleSound}
          disabled={!notificationsEnabled}
        />
        <NotificationToggleItem
          label="Vibração"
          value={vibrationEnabled}
          onChange={toggleVibration}
          disabled={!notificationsEnabled}
        />
      </section>

      <section className="bg-card border border-foreground/5 rounded-[32px] p-6 shadow-sm space-y-4">
        <SectionHeader
          title="Horário de Silêncio"
          description="Não receber notificações durante este período"
        />
        <NotificationToggleItem
          label="Ativar"
          value={quietHoursStart !== ''}
          onChange={(v) => setQuietHours(v ? '22:00' : '', v ? '07:00' : '')}
        />
        <TimeSelectorItem
          label="Início"
          time={quietHoursStart}
          onChange={(t) => setQuietHours(t, quietHoursEnd)}
        />
        <TimeSelectorItem
          label="Fim"
          time={quietHoursEnd}
          onChange={(t) => setQuietHours(quietHoursStart, t)}
        />
      </section>

      <section className="bg-card border border-foreground/5 rounded-[32px] p-6 shadow-sm space-y-3">
        <SectionHeader title="Gerenciamento" description="Visualize e cancele notificações" />
        <p>Agendadas:</p>
        {scheduled.map((n) => (
          <p key={n.id}>
            {n.id} @ {n.time}
          </p>
        ))}
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => {
            service.cancelAllNotifications();
            setScheduled([]);
            toggleNotifications(false);
            toggleDailyVerse(false);
            toggleReadingReminder(false);
          }}
        >
          Cancelar todas
        </button>
      </section>
    </div>
  );
};

export default NotificacoesScreen;
