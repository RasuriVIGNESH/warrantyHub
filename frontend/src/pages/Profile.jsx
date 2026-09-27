import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Camera, Loader2, Sun, Moon, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

/* ═══════════════════════════════════════════════════════════════════════════
   🎨  COLOR FUNCTION — CHANGE THE COLOR HERE
   ─────────────────────────────────────────────────────────────────────────
   Just return the color you want. Pick one from the presets below, or
   enter any hex code. The entire page will update automatically.
   ═══════════════════════════════════════════════════════════════════════════ */
function getAccent() {
  // ── PRESETS (uncomment ONE) ─────────────────────────────────────────────
  // 1. Deep Burgundy (Default)
  // return '#7C2D3A';

  // 2. Royal Navy
  //  return '#1B3A5C';

  // 3. Forest Green
  // return '#1F4D3A';

  // 4. Rich Plum
  // return '#4A2040';

  // 5. Oxblood Maroon
  // return '#6B1F2E';

  // 6. Deep Teal
   return '#1A4D5C';

  // 7. Charcoal Black
  // return '#1A1A1A';

  // 8. Terracotta
  // return '#A0522D';
}
/* ═══════════════════════════════════════════════════════════════════════════ */

export function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = window.localStorage.getItem('theme');
    if (stored === 'light') return false;
    if (stored === 'dark') return true;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const accent = getAccent();

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      // TODO: Implement image upload to your backend/storage
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated upload
      toast.success('Profile picture updated');
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  const initials = user?.name
      ? user.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'U';

  return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 px-4 py-8 sm:px-8">
        <div className="mx-auto max-w-4xl space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-6 w-6" style={{ color: accent }} />
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Profile Settings
              </h1>
            </div>
            <button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600"
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = isDark
                        ? 'rgba(245,241,232,0.2)'
                        : 'rgba(26,26,26,0.2)')
                }
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Main Profile Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-8">
            <div className="flex flex-col gap-8 md:flex-row">

              {/* Profile Picture Section */}
              <div className="flex flex-col items-center space-y-4 md:w-1/3">
                <div className="relative group">
                  <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-700">
                    {user?.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="text-3xl font-semibold text-slate-500 dark:text-slate-400">
                      {initials}
                    </span>
                    )}
                  </div>

                  {/* Upload Overlay */}
                  <label className="absolute bottom-0 right-0 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white text-slate-700 shadow-md transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                    />
                    {isUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Camera className="h-4 w-4" />
                    )}
                  </label>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Profile Picture
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>

              {/* Profile Info Section */}
              <div className="flex-1 space-y-6 md:w-2/3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Full Name
                  </label>
                  <div className="mt-1.5 flex items-center gap-3">
                    <User className="h-5 w-5 text-slate-400" />
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      {user?.name || 'N/A'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Email Address
                  </label>
                  <div className="mt-1.5 flex items-center gap-3">
                    <Mail className="h-5 w-5 text-slate-400" />
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      {user?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                      onClick={() => navigate('/profile/edit')}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:opacity-90"
                      style={{ backgroundColor: accent }}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out Section */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/30 dark:bg-red-900/10 sm:p-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-red-900 dark:text-red-200">
                  Sign Out
                </h3>
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  You will be redirected to the login page.
                </p>
              </div>
              <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 shadow-sm transition-all duration-300 hover:bg-red-50 dark:border-red-800 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-900/50"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>
  );
}