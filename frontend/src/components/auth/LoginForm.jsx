import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from);
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Invalid email or password',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Email"
        type="email"
        error={errors.email?.message}
        leftIcon={<Mail className="h-5 w-5" />}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address',
          },
        })}
      />

      <Input
        label="Password"
        type={showPassword ? 'text' : 'password'}
        error={errors.password?.message}
        leftIcon={<Lock className="h-5 w-5" />}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        }
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
        })}
      />

      {errors.root && (
        <div className="text-sm text-red-500">{errors.root.message}</div>
      )}

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
      >
        Sign In
      </Button>
    </form>
  );
} 