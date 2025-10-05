import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check } from 'lucide-react';

interface SignUpFormProps {
  onSignUp?: (data: SignUpData) => void;
  onBack?: () => void;
  error?: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpForm({ onSignUp, onBack, error }: SignUpFormProps) {
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<SignUpData>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const validateForm = () => {
    const newErrors: Partial<SignUpData> = {};

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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Senha deve conter pelo menos 1 letra maiúscula, 1 minúscula e 1 número';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!agreedToTerms) {
      newErrors.confirmPassword = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof SignUpData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (onSignUp) {
        await onSignUp(formData);
      }
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Erro no cadastro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/(?=.*[a-z])/.test(password)) strength++;
    if (/(?=.*[A-Z])/.test(password)) strength++;
    if (/(?=.*\d)/.test(password)) strength++;
    if (/(?=.*[!@#$%^&*])/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);

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
            Criar conta
          </h1>
          
          <p
            style={{
              fontSize: '16px',
              color: 'rgba(255, 255, 255, 0.7)',
              margin: 0,
              lineHeight: '1.5',
            }}
          >
            Junte-se ao UrbMind e explore sua cidade
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
          {/* Name Field */}
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
              Nome completo
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
                <User size={20} />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Seu nome completo"
                style={{
                  width: '100%',
                  height: '56px',
                  padding: '0 16px 0 48px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: errors.name ? '2px solid #EF4444' : '2px solid rgba(255, 255, 255, 0.1)',
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
                  e.target.style.borderColor = errors.name ? '#EF4444' : 'rgba(255, 255, 255, 0.1)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>
            {errors.name && (
              <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.name}
              </p>
            )}
          </div>

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
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
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
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
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
            
            {/* Password Strength Indicator */}
            {formData.password && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      style={{
                        height: '4px',
                        flex: 1,
                        borderRadius: '2px',
                        backgroundColor: level <= passwordStrength 
                          ? passwordStrength <= 2 ? '#EF4444' 
                            : passwordStrength <= 3 ? '#F59E0B' 
                            : '#10B981'
                          : 'rgba(255, 255, 255, 0.1)',
                        transition: 'background-color 0.3s ease',
                      }}
                    />
                  ))}
                </div>
                <p style={{ 
                  fontSize: '12px', 
                  color: passwordStrength <= 2 ? '#EF4444' : passwordStrength <= 3 ? '#F59E0B' : '#10B981',
                  margin: 0 
                }}>
                  {passwordStrength <= 2 ? 'Senha fraca' : passwordStrength <= 3 ? 'Senha média' : 'Senha forte'}
                </p>
              </div>
            )}
            
            {errors.password && (
              <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
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
              Confirmar senha
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
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirme sua senha"
                style={{
                  width: '100%',
                  height: '56px',
                  padding: '0 48px 0 48px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: errors.confirmPassword ? '2px solid #EF4444' : '2px solid rgba(255, 255, 255, 0.1)',
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
                  e.target.style.borderColor = errors.confirmPassword ? '#EF4444' : 'rgba(255, 255, 255, 0.1)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0' }}>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: agreedToTerms ? '#0D52FF' : 'transparent',
                border: agreedToTerms ? '2px solid #0D52FF' : '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0,
                marginTop: '2px',
              }}
            >
              {agreedToTerms && <Check size={12} color="white" />}
            </button>
            <p style={{ 
              fontSize: '14px', 
              color: 'rgba(255, 255, 255, 0.7)', 
              margin: 0, 
              lineHeight: '1.4' 
            }}>
              Eu concordo com os{' '}
              <Link
                to="/terms"
                style={{ color: '#0D52FF', textDecoration: 'none' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#3B82F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#0D52FF';
                }}
              >
                Termos de Uso
              </Link>
              {' '}e{' '}
              <Link
                to="/privacy"
                style={{ color: '#0D52FF', textDecoration: 'none' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#3B82F6';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#0D52FF';
                }}
              >
                Política de Privacidade
              </Link>
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !agreedToTerms}
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: isLoading || !agreedToTerms ? 'rgba(13, 82, 255, 0.7)' : '#0D52FF',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              cursor: isLoading || !agreedToTerms ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
            }}
            onMouseEnter={(e) => {
              if (!isLoading && agreedToTerms) {
                e.currentTarget.style.backgroundColor = '#3B82F6';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading && agreedToTerms) {
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
                Criando conta...
              </>
            ) : (
              'Criar conta'
            )}
          </button>
        </form>

        {/* Login Link */}
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
            Já tem uma conta?
          </p>
          <Link
            to="/login"
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
                Fazer login
          </Link>
        </div>
      </div>
          </div>
  );
}