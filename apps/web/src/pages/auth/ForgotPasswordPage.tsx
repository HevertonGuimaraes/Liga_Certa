import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { Button, Input } from '@/design-system/components';
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
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
      <h2 className="text-2xl font-bold">Recuperar senha</h2>
      <p className="mt-2 text-muted-foreground">Enviaremos um link para redefinir sua senha</p>
      {mutation.isSuccess ? (
        <p className="mt-8 rounded-md bg-muted p-4 text-sm">Se o e-mail existir, você receberá as instruções.</p>
      ) : (
        <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="mt-8 space-y-4">
          <div>
            <label className="text-sm font-medium">E-mail</label>
            <Input className="mt-1" type="email" {...register('email')} state={errors.email ? 'error' : 'default'} />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="w-full" loading={mutation.isPending}>Enviar link</Button>
        </form>
      )}
      <p className="mt-4 text-center text-sm">
        <Link to="/login" className="text-primary hover:underline">Voltar ao login</Link>
      </p>
    </motion.div>
  );
}
