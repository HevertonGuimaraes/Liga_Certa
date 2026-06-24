import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Button, Input } from '@/design-system/components';
import api from '@/api/client';

const schema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) => api.post('/auth/register', data),
    onSuccess: () => navigate('/login'),
  });

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
      <h2 className="text-2xl font-bold">Criar conta</h2>
      <p className="mt-2 text-muted-foreground">Cadastre-se no Liga Certa</p>
      <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="mt-8 space-y-4">
        <div>
          <label className="text-sm font-medium">Nome</label>
          <Input className="mt-1" {...register('name')} state={errors.name ? 'error' : 'default'} />
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
        </div>
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
        <Button type="submit" className="w-full" loading={mutation.isPending}>Cadastrar</Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta? <Link to="/login" className="text-primary hover:underline">Entrar</Link>
        </p>
      </form>
    </motion.div>
  );
}
