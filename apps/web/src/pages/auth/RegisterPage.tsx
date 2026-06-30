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
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Senhas não conferem',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) navigate('/dashboard', { replace: true });
  }, [navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/auth/register', { name: data.name, email: data.email, password: data.password }),
    onSuccess: () => navigate('/login'),
  });

  return (
    <FigmaAuthShell
      activeTab="register"
      title="Crie sua conta e faça parte da Liga Certa"
      subtitle="Preencha os dados abaixo para criar sua conta e começar agora mesmo."
    >
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-5">
        <div>
          <label className="font-display text-xl font-semibold text-white sm:text-2xl">Nome completo</label>
          <input placeholder="Digite seu nome completo" className="liga-input-dark mt-3" {...register('name')} />
          {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="font-display text-xl font-semibold text-white sm:text-2xl">E-mail</label>
          <input type="email" placeholder="Digite seu melhor e-mail" className="liga-input-dark mt-3" {...register('email')} />
          {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email.message}</p>}
        </div>
        <div>
          <label className="font-display text-xl font-semibold text-white sm:text-2xl">Senha</label>
          <input type="password" placeholder="Crie uma senha forte" className="liga-input-dark mt-3" {...register('password')} />
          {errors.password && <p className="mt-2 text-sm text-red-400">{errors.password.message}</p>}
        </div>
        <div>
          <label className="font-display text-xl font-semibold text-white sm:text-2xl">Confirma a senha</label>
          <input type="password" placeholder="Confirme sua senha" className="liga-input-dark mt-3" {...register('confirmPassword')} />
          {errors.confirmPassword && <p className="mt-2 text-sm text-red-400">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={mutation.isPending} className="liga-btn-primary w-full disabled:opacity-60">
          {mutation.isPending ? <Loader2 className="mx-auto h-6 w-6 animate-spin" /> : 'Criar a minha conta'}
        </button>
        <p className="text-center font-display text-base text-white/80 sm:text-xl">
          Já tem uma conta? <Link to="/login" className="text-liga-blue hover:underline">Entrar</Link>
        </p>
      </form>
    </FigmaAuthShell>
  );
}
