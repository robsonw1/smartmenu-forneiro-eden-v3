import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useSettingsStore, WeekSchedule } from '@/store/useSettingsStore';

const dayLabels: Record<keyof WeekSchedule, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

const dayOrder: (keyof WeekSchedule)[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export function ScheduleDialog() {
  const [open, setOpen] = useState(false);
  const settings = useSettingsStore((s) => s.settings);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="link"
          className="text-primary hover:text-primary/80 p-0 h-auto font-semibold text-sm"
        >
          Ver horários completos
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Horários de Funcionamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {dayOrder.map((day) => {
            const daySchedule = settings.schedule[day];
            const isOpen = daySchedule.isOpen;

            return (
              <div
                key={day}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <span className="font-semibold text-foreground min-w-[150px]">
                  {dayLabels[day]}
                </span>
                <span className="text-sm text-muted-foreground">
                  {isOpen
                    ? `${daySchedule.openTime} às ${daySchedule.closeTime}`
                    : 'Fechado'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-xs text-blue-700 dark:text-blue-400">
            💡 <strong>Dica:</strong> Os horários acima são os horários de funcionamento da loja. Para pedidos agendados, consulte as opções de horário no checkout.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
