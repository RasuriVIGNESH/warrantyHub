import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: error.response?.data?.message || 'Registration failed',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        error={errors.name?.message}
        leftIcon={<User className="h-5 w-5" />}
        {...register('name', {
          required: 'Full name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
          },
        })}
      />

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
          pattern: {
            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
          },
        })}
      />

      <Input
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        error={errors.confirmPassword?.message}
        leftIcon={<Lock className="h-5 w-5" />}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (value) =>
            value === password || 'The passwords do not match',
        })}
      />

      {errors.root && (
        <div className="text-sm text-red-500">{errors.root.message}</div>
      )}

      <Button
        type="submit"
        className="w-full"
        isLoading={isSubmitting}
        onClick={handleSubmit(onSubmit)}
      >
        Create Account
      </Button>
    </form>
  );
}