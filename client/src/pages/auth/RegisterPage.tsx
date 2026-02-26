import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { BookPlus } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = React.useState<string | null>(null);
    const [loading, setLoading] = React.useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        setError(null);
        setLoading(true);
        try {
            await authService.register({
                name: data.name,
                email: data.email,
                password: data.password
            });
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Erro ao realizar cadastro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
            <div className="max-w-md w-full space-y-8 p-8 bg-card rounded-2xl border shadow-xl">
                <div className="text-center">
                    <BookPlus className="mx-auto h-12 w-12 text-primary" />
                    <h2 className="mt-6 text-3xl font-extrabold text-foreground tracking-tight">Crie sua conta</h2>
                    <p className="mt-2 text-sm text-muted-foreground">Junte-se a nós em sua jornada bíblica.</p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-3">
                        <div>
                            <label className="text-sm font-medium ml-1">Nome Completo</label>
                            <Input
                                {...register('name')}
                                placeholder="Seu nome"
                                className={errors.name ? 'border-destructive' : ''}
                            />
                            {errors.name && <p className="text-xs text-destructive mt-1 ml-1">{errors.name.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium ml-1">E-mail</label>
                            <Input
                                {...register('email')}
                                type="email"
                                placeholder="exemplo@email.com"
                                className={errors.email ? 'border-destructive' : ''}
                            />
                            {errors.email && <p className="text-xs text-destructive mt-1 ml-1">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium ml-1">Senha</label>
                            <Input
                                {...register('password')}
                                type="password"
                                placeholder="••••••••"
                                className={errors.password ? 'border-destructive' : ''}
                            />
                            {errors.password && <p className="text-xs text-destructive mt-1 ml-1">{errors.password.message}</p>}
                        </div>
                        <div>
                            <label className="text-sm font-medium ml-1">Confirmar Senha</label>
                            <Input
                                {...register('confirmPassword')}
                                type="password"
                                placeholder="••••••••"
                                className={errors.confirmPassword ? 'border-destructive' : ''}
                            />
                            {errors.confirmPassword && <p className="text-xs text-destructive mt-1 ml-1">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>

                    {error && <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">{error}</div>}

                    <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={loading}>
                        {loading ? 'Criando conta...' : 'Cadastrar'}
                    </Button>

                    <div className="text-center text-sm pt-2">
                        <span className="text-muted-foreground">Já tem uma conta? </span>
                        <Link to="/login" className="text-primary hover:underline font-bold transition-all">Entrar</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
