import { Link } from 'react-router-dom';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Card } from '../components/ui/Card';

export function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>

        <Card>
          <Card.Content>
            <RegisterForm />
          </Card.Content>
        </Card>

        <p className="text-center text-xs text-gray-600">
          By signing up, you agree to our{' '}
          <Link
            to="/terms"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            to="/privacy"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
} 