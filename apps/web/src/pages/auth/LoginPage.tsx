import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Button, Input } from '@/design-system/components';
import api from '@/api/client';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
      <h2 className="text-2xl font-bold">Entrar</h2>
      <p className="mt-2 text-muted-foreground">Acesse sua conta Liga Certa</p>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium">E-mail</label>
          <Input className="mt-1" type="email" {...register('email')} state={errors.email ? 'error' : 'default'} />
          {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-sm font-medium">Senha</label>
          <Input className="mt-1" type="password" {...register('password')} state={errors.password ? 'error' : 'default'} />
          {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password.message}</p>}
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-sm text-primary hover:underline">Esqueci minha senha</Link>
        </div>
        <Button type="submit" className="w-full" loading={mutation.isPending}>Entrar</Button>
        <p className="text-center text-sm text-muted-foreground">
          Não tem conta? <Link to="/register" className="text-primary hover:underline">Cadastre-se</Link>
        </p>
      </form>
    </motion.div>
  );
}
