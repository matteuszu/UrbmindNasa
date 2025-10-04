import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Loader2, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToSignUp: () => void;
  isLoading: boolean;
}

export function LoginForm({ onLogin, onSwitchToSignUp, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onLogin(email, password);
    } catch (error) {
      setErrors({ email: 'Email ou senha incorretos' });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle>Entrar na sua conta</CardTitle>
        <CardDescription>
          Digite seu email e senha para acessar sua conta
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => {
                // Implementar reset de senha futuramente
                alert('Funcionalidade de recuperação de senha será implementada em breve');
              }}
            >
              Esqueceu sua senha?
            </button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </Button>
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="text-primary hover:underline"
              >
                Criar conta
              </button>
            </span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}