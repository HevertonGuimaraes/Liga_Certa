import { useForm } from 'react-hook-form';
import { PageHeader } from '@/components/PageHeader';
import { Button, Input } from '@/design-system/components';

export default function SettingsPage() {
  const { register, handleSubmit } = useForm({
    defaultValues: { name: '', email: '', notifications: true },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Configurações" description="Preferências da sua conta" />
      <form onSubmit={handleSubmit(() => {})} className="space-y-4 rounded-lg border bg-card p-6">
        <div>
          <label className="text-sm font-medium">Nome</label>
          <Input className="mt-1" {...register('name')} />
        </div>
        <div>
          <label className="text-sm font-medium">E-mail</label>
          <Input className="mt-1" type="email" {...register('email')} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('notifications')} />
          Receber notificações por e-mail
        </label>
        <Button type="submit">Salvar alterações</Button>
      </form>
    </div>
  );
}
