import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
  onBack?: () => void;
  error?: string;
}

export default function LoginForm({ onLogin, onBack, error }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (onLogin) {
        await onLogin(email, password);
      }
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erro no login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #01081A 0%, #0D1B2A 100%)',
        padding: '16px',
        fontFamily: 'Poppins, ui-sans-serif, sans-serif',
        paddingBottom: '80px', // Espaço extra para evitar que o conteúdo fique escondido atrás da barra do navegador
      }}
    >
      <div
        style={{
          maxWidth: '400px',
          margin: '0 auto',
          padding: '0',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          {/* Botão Voltar */}
          {onBack && (
            <button
              onClick={onBack}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                marginBottom: '20px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <ArrowLeft size={20} />
            </button>
          )}

          {/* Logo e Título */}
          <div style={{ textAlign: 'center' }}>

          {/* Logo */}
          <div style={{ marginBottom: '16px' }}>
            <img 
              src="/logo urbmind.svg" 
              alt="UrbMind Logo"
              style={{
                height: '32px',
                width: 'auto',
                display: 'block',
                margin: '0 auto',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </div>
          
          <h1
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: 'white',
              margin: '0 0 8px 0',
              letterSpacing: '-0.5px',
            }}
          >
            Bem-vindo de volta
          </h1>
          
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
              lineHeight: '1.5',
            }}
          >
            Entre na sua conta para continuar
          </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>!</span>
            </div>
            <p
              style={{
                color: '#EF4444',
                fontSize: '14px',
                margin: 0,
                lineHeight: '1.4',
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                marginBottom: '8px',
              }}
            >
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.5)',
                  zIndex: 1,
                }}
              >
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                style={{
                  width: '100%',
                  height: '56px',
                  padding: '0 16px 0 48px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: errors.email ? '2px solid #EF4444' : '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  fontSize: '16px',
                  color: 'white',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0D52FF';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.email ? '#EF4444' : 'rgba(255, 255, 255, 0.1)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
            {errors.email && (
              <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: 'white',
                marginBottom: '8px',
              }}
            >
              Senha
            </label>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.5)',
                  zIndex: 1,
                }}
              >
                <Lock size={20} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                style={{
                  width: '100%',
                  height: '56px',
                  padding: '0 48px 0 48px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: errors.password ? '2px solid #EF4444' : '2px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '16px',
                  fontSize: '16px',
                  color: 'white',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontFamily: 'Poppins, ui-sans-serif, sans-serif',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#0D52FF';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.password ? '#EF4444' : 'rgba(255, 255, 255, 0.1)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.5)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '4px',
                  transition: 'color 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: 'right' }}>
            <Link
              to="/forgot-password"
              style={{
                fontSize: '14px',
                color: '#0D52FF',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#3B82F6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#0D52FF';
              }}
            >
              Esqueceu sua senha?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: isLoading ? 'rgba(13, 82, 255, 0.7)' : '#0D52FF',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#3B82F6';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = '#0D52FF';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            {isLoading ? (
              <>
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }}
                />
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: '0 0 16px 0',
            }}
          >
            Não tem uma conta?
          </p>
          <Link
            to="/signup"
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#0D52FF',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#3B82F6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#0D52FF';
            }}
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}