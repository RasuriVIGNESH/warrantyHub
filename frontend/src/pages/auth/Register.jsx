import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, Shield, Sun, Moon, Quote } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleOAuthButton } from './GoogleOAuthButton';

const THEME_STORAGE_KEY = 'theme';

/* ═══════════════════════════════════════════════════════════════════════════
   🎨  CENTRALIZED COLOR CONFIG — CHANGE COLORS HERE
   ═══════════════════════════════════════════════════════════════════════════ */
const THEME = {
  // DEFAULT — Deep Forest Green
  light: '#1F4D3A',
  dark:  '#7FB8A0',

  // Option 2: Royal Navy
  // light: '#1B3A5C',
  // dark:  '#7BA7CC',

  // Option 3: Deep Burgundy
  // light: '#7C2D3A',
  // dark:  '#D4909A',

  // Option 4: Rich Plum
  // light: '#4A2040',
  // dark:  '#B8849E',

  // Option 5: Oxblood Maroon
  // light: '#6B1F2E',
  // dark:  '#C98A96',

  // Option 6: Deep Teal
  // light: '#1A4D5C',
  // dark:  '#6BA8B8',
};
/* ═══════════════════════════════════════════════════════════════════════════ */

export function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light') return false;
    if (stored === 'dark') return true;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
    window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const accent = isDark ? THEME.dark : THEME.light;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
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
      toast.success('Account created! Welcome to WarrantyHub.');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to register. Please try again.';
      toast.error(message);
    }
  };

  return (
      <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0F19] text-[#1A1A1A] dark:text-[#F5F1E8] transition-colors duration-500">
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-serif-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans-body { font-family: 'Inter', system-ui, sans-serif; }
        .divider-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          color: ${accent};
        }
        .divider-ornament::before,
        .divider-ornament::after {
          content: '';
          height: 1px;
          width: 40px;
          background: linear-gradient(to right, transparent, currentColor, transparent);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
      `}</style>

        {/* Theme toggle — top right corner */}
        <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="fixed top-4 right-4 z-50 w-10 h-10 border border-[#1A1A1A]/20 dark:border-[#F5F1E8]/20 rounded-xl flex items-center justify-center hover:border-current transition-colors bg-[#FAF7F2]/80 dark:bg-[#0B0F19]/80 backdrop-blur-lg"
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
            onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = isDark
                    ? 'rgba(245,241,232,0.2)'
                    : 'rgba(26,26,26,0.2)')
            }
        >
          {isDark ? <Sun className="w-4 h-4" strokeWidth={1.5} /> : <Moon className="w-4 h-4" strokeWidth={1.5} />}
        </button>

        <div className="min-h-screen flex flex-col lg:flex-row">
          {/* LEFT PANEL — Brand showcase (compressed) */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-10">
            {/* Subtle background pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                  backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
            ></div>

            {/* Decorative corner flourishes */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: accent }}></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: accent }}></div>

            <div className="relative z-10 max-w-md animate-fade-in">
              {/* Brand mark */}
              <div className="flex items-center space-x-3 mb-8">
                <div
                    className="w-11 h-11 border rounded-xl flex items-center justify-center"
                    style={{ borderColor: accent }}
                >
                  <Shield className="w-5 h-5" strokeWidth={1.5} style={{ color: accent }} />
                </div>
                <h1 className="text-lg font-serif-display font-semibold tracking-wide">
                  WarrantyHub
                </h1>
              </div>

              {/* Headline — smaller */}
              <h2 className="font-serif-display text-4xl xl:text-5xl font-medium leading-[1.1] mb-5">
                Begin Your
                <span className="block italic font-normal" style={{ color: accent }}>
                Journey.
              </span>
              </h2>

              <div className="divider-ornament mb-5 justify-start">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans-body">
                A Refined Start
              </span>
              </div>

              <p className="text-base text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 leading-relaxed font-sans-body font-light mb-8">
                Join a community of thoughtful homeowners who refuse to let a single warranty lapse unnoticed.
              </p>

              {/* Testimonial — compact */}
              <div className="border-l-2 pl-5" style={{ borderColor: `${accent}66` }}>
                <Quote className="w-5 h-5 mb-2" strokeWidth={1} style={{ color: accent }} />
                <p className="font-serif-display text-sm italic leading-relaxed mb-2 text-[#1A1A1A]/80 dark:text-[#F5F1E8]/80">
                  "With 10+ appliances at home, this app keeps me organized and stress-free."
                </p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 dark:text-[#F5F1E8]/50 font-sans-body">
                  — Emily Davis, Busy Parent
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — Form (compressed) */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-md animate-fade-in">
              {/* Mobile brand mark */}
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-6">
                <div
                    className="w-10 h-10 border rounded-xl flex items-center justify-center"
                    style={{ borderColor: accent }}
                >
                  <Shield className="w-5 h-5" strokeWidth={1.5} style={{ color: accent }} />
                </div>
                <h1 className="text-lg font-serif-display font-semibold tracking-wide">
                  WarrantyHub
                </h1>
              </div>

              {/* Heading — tighter */}
              <div className="text-center mb-5">
                <div className="divider-ornament mb-3">
                <span className="text-[10px] uppercase tracking-[0.3em] font-sans-body">
                  Register
                </span>
                </div>
                <h2 className="font-serif-display text-3xl font-medium mb-2">
                  Create your
                  <span className="block italic font-normal" style={{ color: accent }}>
                  Account
                </span>
                </h2>
                <p className="text-sm text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 font-sans-body">
                  Already a member?{' '}
                  <Link
                      to="/login"
                      className="underline underline-offset-4 hover:no-underline transition-all"
                      style={{ color: accent }}
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Google OAuth */}
              <div className="mb-4">
                <GoogleOAuthButton disabled={isSubmitting} />
              </div>

              {/* Divider */}
              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10" />
                </div>
                <div className="relative flex justify-center">
                <span className="px-4 bg-[#FAF7F2] dark:bg-[#0B0F19] text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 dark:text-[#F5F1E8]/50 font-sans-body">
                  Or register with email
                </span>
                </div>
              </div>

              {/* Form — compressed spacing */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                {/* Full Name */}
                <div>
                  <label htmlFor="name" className="block text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 mb-1.5 font-sans-body">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="w-4 h-4 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40" strokeWidth={1.5} />
                    </div>
                    <input
                        id="name"
                        type="text"
                        {...register('name', {
                          required: 'Name is required',
                          minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters',
                          },
                        })}
                        className="w-full pl-10 pr-3 py-2.5 bg-transparent border border-[#1A1A1A]/15 dark:border-[#F5F1E8]/15 rounded-xl text-sm text-[#1A1A1A] dark:text-[#F5F1E8] placeholder-[#1A1A1A]/40 dark:placeholder-[#F5F1E8]/40 focus:outline-none transition-colors font-sans-body"
                        placeholder="John Doe"
                        onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                        onBlur={(e) =>
                            (e.currentTarget.style.borderColor = isDark
                                ? 'rgba(245,241,232,0.15)'
                                : 'rgba(26,26,26,0.15)')
                        }
                    />
                  </div>
                  {errors.name && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-sans-body">
                        {errors.name.message}
                      </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 mb-1.5 font-sans-body">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40" strokeWidth={1.5} />
                    </div>
                    <input
                        id="email"
                        type="email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Invalid email address',
                          },
                        })}
                        className="w-full pl-10 pr-3 py-2.5 bg-transparent border border-[#1A1A1A]/15 dark:border-[#F5F1E8]/15 rounded-xl text-sm text-[#1A1A1A] dark:text-[#F5F1E8] placeholder-[#1A1A1A]/40 dark:placeholder-[#F5F1E8]/40 focus:outline-none transition-colors font-sans-body"
                        placeholder="you@example.com"
                        onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                        onBlur={(e) =>
                            (e.currentTarget.style.borderColor = isDark
                                ? 'rgba(245,241,232,0.15)'
                                : 'rgba(26,26,26,0.15)')
                        }
                    />
                  </div>
                  {errors.email && (
                      <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-sans-body">
                        {errors.email.message}
                      </p>
                  )}
                </div>

                {/* Password + Confirm Password side-by-side on larger screens */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="password" className="block text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 mb-1.5 font-sans-body">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40" strokeWidth={1.5} />
                      </div>
                      <input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          {...register('password', {
                            required: 'Password is required',
                            minLength: {
                              value: 8,
                              message: 'Min 8 characters',
                            },
                            pattern: {
                              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                              message: 'Needs upper, lower, number & symbol',
                            },
                          })}
                          className="w-full pl-10 pr-9 py-2.5 bg-transparent border border-[#1A1A1A]/15 dark:border-[#F5F1E8]/15 rounded-xl text-sm text-[#1A1A1A] dark:text-[#F5F1E8] placeholder-[#1A1A1A]/40 dark:placeholder-[#F5F1E8]/40 focus:outline-none transition-colors font-sans-body"
                          placeholder="••••••••"
                          onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                          onBlur={(e) =>
                              (e.currentTarget.style.borderColor = isDark
                                  ? 'rgba(245,241,232,0.15)'
                                  : 'rgba(26,26,26,0.15)')
                          }
                      />
                      <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                            <EyeOff className="w-3.5 h-3.5 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40" strokeWidth={1.5} />
                        ) : (
                            <Eye className="w-3.5 h-3.5 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-sans-body">
                          {errors.password.message}
                        </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 mb-1.5 font-sans-body">
                      Confirm
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40" strokeWidth={1.5} />
                      </div>
                      <input
                          id="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...register('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (value) =>
                                value === password || 'Passwords do not match',
                          })}
                          className="w-full pl-10 pr-9 py-2.5 bg-transparent border border-[#1A1A1A]/15 dark:border-[#F5F1E8]/15 rounded-xl text-sm text-[#1A1A1A] dark:text-[#F5F1E8] placeholder-[#1A1A1A]/40 dark:placeholder-[#F5F1E8]/40 focus:outline-none transition-colors font-sans-body"
                          placeholder="••••••••"
                          onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                          onBlur={(e) =>
                              (e.currentTarget.style.borderColor = isDark
                                  ? 'rgba(245,241,232,0.15)'
                                  : 'rgba(26,26,26,0.15)')
                          }
                      />
                      <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      >
                        {showConfirmPassword ? (
                            <EyeOff className="w-3.5 h-3.5 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40" strokeWidth={1.5} />
                        ) : (
                            <Eye className="w-3.5 h-3.5 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40" strokeWidth={1.5} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-xs text-red-500 dark:text-red-400 font-sans-body">
                          {errors.confirmPassword.message}
                        </p>
                    )}
                  </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full flex justify-center items-center gap-3 py-3 px-4 bg-[#1A1A1A] dark:bg-[#F5F1E8] text-[#FAF7F2] dark:text-[#0B0F19] hover:text-[#FAF7F2] dark:hover:text-[#0B0F19] rounded-xl text-sm uppercase tracking-[0.2em] font-sans-body transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    onMouseEnter={(e) => {
                      if (!isSubmitting) e.currentTarget.style.backgroundColor = accent;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isDark ? '#F5F1E8' : '#1A1A1A';
                    }}
                >
                  {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                      'Create Account'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
  );
}