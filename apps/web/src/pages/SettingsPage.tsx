import { useForm } from 'react-hook-form';
import { AppPageHeader } from '@/layouts/AppLayout';
import {
  FigmaPanel,
  FigmaFormField,
  FigmaInput,
  FigmaFormActions,
} from '@/components/layout/FigmaAppUI';

export default function SettingsPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: { name: '', email: '', notifications: true },
  });

  return (
    <div>
      <AppPageHeader title="Configuração" description="Preferências da sua conta Liga Certa." />
      <FigmaPanel className="max-w-2xl">
        <form onSubmit={handleSubmit(() => {})} className="space-y-6">
          <FigmaFormField label="Nome">
            <FigmaInput placeholder="Seu nome completo" {...register('name')} />
          </FigmaFormField>
          <FigmaFormField label="E-mail">
            <FigmaInput type="email" placeholder="seu@email.com" {...register('email')} />
          </FigmaFormField>
          <label className="flex items-center gap-3 font-display text-white/80">
            <input type="checkbox" className="h-5 w-5 rounded accent-liga-blue" {...register('notifications')} />
            Receber notificações por e-mail
          </label>
          <FigmaFormActions onCancel={() => window.history.back()} submitLabel="Salvar alterações" />
        </form>
      </FigmaPanel>
    </div>
  );
}
