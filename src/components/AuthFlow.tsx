import { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';
import { toast } from 'sonner@2.0.3';
import { authHelpers } from '../utils/supabase/client';

type AuthMode = 'login' | 'signup';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthFlowProps {
  onAuthSuccess: (user: User) => void;
}

export function AuthFlow({ onAuthSuccess }: AuthFlowProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { user } = await authHelpers.signIn(email, password);
      toast.success('Login realizado com sucesso!');
      onAuthSuccess(user);
    } catch (error) {
      console.log('Login error:', error);
      if (error.message.includes('Invalid login credentials')) {
        toast.error('Email ou senha incorretos. Verifique suas credenciais.');
      } else {
        toast.error('Erro ao fazer login. Tente novamente.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { user } = await authHelpers.signUp(name, email, password);
      toast.success('Conta criada com sucesso! Bem-vindo(a)!');
      onAuthSuccess(user);
    } catch (error) {
      console.log('Signup error:', error);
      if (error.message.includes('já está cadastrado')) {
        toast.error('Este email já está cadastrado. Tente fazer login.');
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {mode === 'login' ? (
          <LoginForm
            onLogin={handleLogin}
            onSwitchToSignUp={() => setMode('signup')}
            isLoading={isLoading}
          />
        ) : (
          <SignUpForm
            onSignUp={handleSignUp}
            onSwitchToLogin={() => setMode('login')}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}