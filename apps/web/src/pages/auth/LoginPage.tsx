import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { isAuthenticated } from '@/utils/auth';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { FigmaAuthShell } from '@/components/layout/FigmaAuthShell';
import api from '@/api/client';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) navigate('/dashboard', { replace: true });
  }, [navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/auth/login', data),
    onSuccess: (res) => {
      localStorage.setItem('liga_certa_token', res.data.accessToken);
      navigate('/dashboard');
    },
  });

  return (
    <FigmaAuthShell
      activeTab="login"
      title="Bem-vindo de volta!"
      subtitle="Entre com seu e-mail e senha para acessar seus campeonatos."
    >
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-6">
        <div>
          <label className="font-display text-xl font-semibold text-white sm:text-2xl">E-mail</label>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="liga-input-dark mt-3"
            {...register('email')}
          />
          {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="font-display text-xl font-semibold text-white sm:text-2xl">Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            className="liga-input-dark mt-3"
            {...register('password')}
          />
          {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="font-display text-base text-liga-blue hover:underline sm:text-xl">
            Esqueci minha senha
          </Link>
        </div>
        <button type="submit" disabled={mutation.isPending} className="liga-btn-primary w-full disabled:opacity-60">
          {mutation.isPending ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : 'Entrar na minha conta'}
        </button>
        <p className="text-center font-display text-base text-white/80 sm:text-xl">
          Não tem conta?{' '}
          <Link to="/register" className="text-liga-blue hover:underline">Criar conta</Link>
        </p>
      </form>
    </FigmaAuthShell>
  );
}
