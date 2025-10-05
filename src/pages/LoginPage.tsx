import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { authHelpers } from '../utils/supabase/client';

export default function LoginPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleLogin = async (email: string, password: string) => {
    try {
      setError('');
      console.log('Login attempt:', { email });
      
      // Usar autenticação real do Supabase
      const result = await authHelpers.signIn(email, password);
      
      console.log('Login successful:', result.user);
      
      // Redirecionar para a página principal após login bem-sucedido
      navigate('/');
    } catch (error: any) {
      console.error('Erro no login:', error);
      setError(error.message || 'Erro ao fazer login. Tente novamente.');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return <LoginForm onLogin={handleLogin} onBack={handleBack} error={error} />;
}
