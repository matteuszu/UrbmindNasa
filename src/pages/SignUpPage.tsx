import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUpForm from '../components/SignUpForm';
import { supabase } from '../utils/supabase/client';

interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const handleSignUp = async (data: SignUpData) => {
    try {
      setError('');
      console.log('Sign up attempt:', { name: data.name, email: data.email });
      
      // Usar autenticação real do Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          },
        },
      });

      if (authError) {
        throw new Error(authError.message);
      }

      console.log('Sign up successful:', authData.user);
      
      // Redirecionar para a página de login após cadastro bem-sucedido
      navigate('/login');
    } catch (error: any) {
      console.error('Erro no cadastro:', error);
      setError(error.message || 'Erro ao criar conta. Tente novamente.');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return <SignUpForm onSignUp={handleSignUp} onBack={handleBack} error={error} />;
}
