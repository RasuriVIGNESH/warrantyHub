import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, Shield, Sun, Moon, Quote } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { GoogleOAuthButton } from './GoogleOAuthButton';

const THEME_STORAGE_KEY = 'theme';

/* ═══════════════════════════════════════════════════════════════════════════
   🎨  CENTRALIZED COLOR CONFIG — CHANGE COLORS HERE
   ─────────────────────────────────────────────────────────────────────────
   Edit ONLY this object to change the accent color across the entire page.
   Must match the THEME object in LandingPage.jsx for visual consistency.
   ═══════════════════════════════════════════════════════════════════════════ */
const THEME = {
  // DEFAULT — Deep Forest Green (classic luxury / old money)
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

export function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

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
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  // If Google OAuth2 failed, surface the error from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const error = params.get('error');
    if (error) {
      const message = params.get('message') || 'Google sign-in failed. Please try again.';
      toast.error(message);
      navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || 'Invalid email or password.';
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
            className="fixed top-6 right-6 z-50 w-11 h-11 border border-[#1A1A1A]/20 dark:border-[#F5F1E8]/20 rounded-xl flex items-center justify-center hover:border-current transition-colors bg-[#FAF7F2]/80 dark:bg-[#0B0F19]/80 backdrop-blur-lg"
            style={{ ['--hover-color']: accent }}
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
          {/* LEFT PANEL — Brand showcase (hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16">
            {/* Subtle background pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                  backgroundImage: `radial-gradient(${accent} 1px, transparent 1px)`,
                  backgroundSize: '24px 24px',
                }}
            ></div>

            {/* Decorative corner flourishes */}
            <div className="absolute top-12 left-12 w-16 h-16 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: accent }}></div>
            <div className="absolute bottom-12 right-12 w-16 h-16 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: accent }}></div>

            <div className="relative z-10 max-w-md animate-fade-in">
              {/* Brand mark */}
              <div className="flex items-center space-x-3 mb-12">
                <div
                    className="w-12 h-12 border rounded-xl flex items-center justify-center"
                    style={{ borderColor: accent }}
                >
                  <Shield className="w-6 h-6" strokeWidth={1.5} style={{ color: accent }} />
                </div>
                <h1 className="text-xl font-serif-display font-semibold tracking-wide">
                  WarrantyHub
                </h1>
              </div>

              {/* Headline */}
              <h2 className="font-serif-display text-5xl xl:text-6xl font-medium leading-[1.1] mb-8">
                Welcome
                <span className="block italic font-normal" style={{ color: accent }}>
                Back Home.
              </span>
              </h2>

              <div className="divider-ornament mb-8 justify-start">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans-body">
                Your Sanctuary Awaits
              </span>
              </div>

              <p className="text-lg text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 leading-relaxed font-sans-body font-light mb-12">
                Every warranty, every document, every reminder — quietly waiting for you in one refined place.
              </p>

              {/* Testimonial */}
              <div className="border-l-2 pl-6" style={{ borderColor: `${accent}66` }}>
                <Quote className="w-6 h-6 mb-3" strokeWidth={1} style={{ color: accent }} />
                <p className="font-serif-display text-base italic leading-relaxed mb-4 text-[#1A1A1A]/80 dark:text-[#F5F1E8]/80">
                  "Finally, all my device warranties in one place. The reminders are a lifesaver."
                </p>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 dark:text-[#F5F1E8]/50 font-sans-body">
                  — Michael Chen, Tech Enthusiast
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL — Form */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
            <div className="w-full max-w-md animate-fade-in">
              {/* Mobile brand mark (shown only on mobile) */}
              <div className="lg:hidden flex items-center justify-center space-x-3 mb-10">
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

              {/* Heading */}
              <div className="text-center mb-10">
                <div className="divider-ornament mb-5">
                <span className="text-[10px] uppercase tracking-[0.3em] font-sans-body">
                  Sign In
                </span>
                </div>
                <h2 className="font-serif-display text-4xl font-medium mb-3">
                  Sign in to your
                  <span className="block italic font-normal" style={{ color: accent }}>
                  Account
                </span>
                </h2>
                <p className="text-sm text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 font-sans-body">
                  Or{' '}
                  <Link
                      to="/register"
                      className="underline underline-offset-4 hover:no-underline transition-all"
                      style={{ color: accent }}
                  >
                    create a new account
                  </Link>
                </p>
              </div>

              {/* Google OAuth */}
              <div className="mb-6">
                <GoogleOAuthButton disabled={isSubmitting} />
              </div>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10" />
                </div>
                <div className="relative flex justify-center">
                <span className="px-4 bg-[#FAF7F2] dark:bg-[#0B0F19] text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/50 dark:text-[#F5F1E8]/50 font-sans-body">
                  Or continue with email
                </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 mb-2 font-sans-body">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
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
                        className="w-full pl-11 pr-4 py-3 bg-transparent border border-[#1A1A1A]/15 dark:border-[#F5F1E8]/15 rounded-xl text-sm text-[#1A1A1A] dark:text-[#F5F1E8] placeholder-[#1A1A1A]/40 dark:placeholder-[#F5F1E8]/40 focus:outline-none transition-colors font-sans-body"
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
                      <p className="mt-2 text-xs text-red-500 dark:text-red-400 font-sans-body">
                        {errors.email.message}
                      </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 mb-2 font-sans-body">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="w-4 h-4 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40" strokeWidth={1.5} />
                    </div>
                    <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        {...register('password', {
                          required: 'Password is required',
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters',
                          },
                        })}
                        className="w-full pl-11 pr-11 py-3 bg-transparent border border-[#1A1A1A]/15 dark:border-[#F5F1E8]/15 rounded-xl text-sm text-[#1A1A1A] dark:text-[#F5F1E8] placeholder-[#1A1A1A]/40 dark:placeholder-[#F5F1E8]/40 focus:outline-none transition-colors font-sans-body"
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
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                          <EyeOff className="w-4 h-4 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40 hover:text-[#1A1A1A] dark:hover:text-[#F5F1E8] transition-colors" strokeWidth={1.5} />
                      ) : (
                          <Eye className="w-4 h-4 text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40 hover:text-[#1A1A1A] dark:hover:text-[#F5F1E8] transition-colors" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                      <p className="mt-2 text-xs text-red-500 dark:text-red-400 font-sans-body">
                        {errors.password.message}
                      </p>
                  )}
                </div>

                {/* Remember me + Forgot password */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-[#1A1A1A]/30 dark:border-[#F5F1E8]/30 bg-transparent focus:ring-0 transition-colors"
                        style={{ ['--accent']: accent }}
                    />
                    <span className="text-xs text-[#1A1A1A]/70 dark:text-[#F5F1E8]/70 font-sans-body group-hover:text-[#1A1A1A] dark:group-hover:text-[#F5F1E8] transition-colors">
                    Remember me
                  </span>
                  </label>
                  <Link
                      to="/forgot-password"
                      className="text-xs font-sans-body transition-colors hover:underline underline-offset-4"
                      style={{ color: accent }}
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full flex justify-center items-center gap-3 py-3.5 px-4 bg-[#1A1A1A] dark:bg-[#F5F1E8] text-[#FAF7F2] dark:text-[#0B0F19] hover:text-[#FAF7F2] dark:hover:text-[#0B0F19] rounded-xl text-sm uppercase tracking-[0.2em] font-sans-body transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
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
                      'Sign In'
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="text-center text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/40 dark:text-[#F5F1E8]/40 mt-10 font-sans-body">
                Protected by WarrantyHub · Est. 2025
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}