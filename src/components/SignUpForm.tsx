import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { Loader2, Eye, EyeOff, User, Mail, Lock } from 'lucide-react';

interface SignUpFormProps {
  onSignUp: (name: string, email: string, password: string) => Promise<void>;
  onSwitchToLogin: () => void;
  isLoading: boolean;
}

export function SignUpForm({ onSignUp, onSwitchToLogin, isLoading }: SignUpFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSignUp(formData.name, formData.email, formData.password);
    } catch (error) {
      setErrors({ email: 'Este email já está em uso' });
    }
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle>Criar sua conta</CardTitle>
        <CardDescription>
          Preencha os dados abaixo para criar sua conta gratuita
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="name"
                type="text"
                placeholder="Seu nome completo"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                className={errors.name ? 'border-destructive pl-10' : 'pl-10'}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className={errors.email ? 'border-destructive pl-10' : 'pl-10'}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                className={errors.password ? 'border-destructive pl-10 pr-10' : 'pl-10 pr-10'}
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Digite novamente sua senha"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                className={errors.confirmPassword ? 'border-destructive pl-10 pr-10' : 'pl-10 pr-10'}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => updateFormData('acceptTerms', !!checked)}
              className={errors.acceptTerms ? 'border-destructive' : ''}
            />
            <Label 
              htmlFor="acceptTerms" 
              className="text-sm leading-4 cursor-pointer"
            >
              Eu aceito os{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  // Implementar modal de termos futuramente
                  alert('Termos de uso serão exibidos aqui');
                }}
              >
                termos de uso
              </button>
              {' '}e{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => {
                  // Implementar modal de privacidade futuramente
                  alert('Política de privacidade será exibida aqui');
                }}
              >
                política de privacidade
              </button>
            </Label>
          </div>
          {errors.acceptTerms && (
            <p className="text-sm text-destructive">{errors.acceptTerms}</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </Button>
          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-primary hover:underline"
              >
                Fazer login
              </button>
            </span>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}