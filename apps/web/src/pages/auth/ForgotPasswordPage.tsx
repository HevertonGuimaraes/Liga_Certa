import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { FigmaAuthShell } from '@/components/layout/FigmaAuthShell';
import api from '@/api/client';

const schema = z.object({ email: z.string().email('E-mail inválido') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/auth/forgot-password', data),
  });

  return (
    <FigmaAuthShell
      activeTab="login"
      title="Recuperar senha"
      subtitle="Informe seu e-mail e enviaremos as instruções para redefinir sua senha."
    >
      {mutation.isSuccess ? (
        <p className="rounded-xl bg-liga-panel p-6 font-display text-lg text-white/90">
          Se o e-mail existir, você receberá as instruções em breve.
        </p>
      ) : (
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
          <div>
            <label className="font-display text-xl font-semibold text-white sm:text-2xl">E-mail</label>
            <input type="email" placeholder="Digite seu e-mail" className="liga-input-dark mt-3" {...register('email')} />
            {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
          </div>
          <button type="submit" disabled={mutation.isPending} className="liga-btn-primary w-full disabled:opacity-60">
            {mutation.isPending ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : 'Enviar link'}
          </button>
        </form>
      )}
      <p className="mt-6 text-center font-display text-base text-white/80">
        <Link to="/login" className="text-liga-blue hover:underline">← Voltar ao login</Link>
      </p>
    </FigmaAuthShell>
  );
}
