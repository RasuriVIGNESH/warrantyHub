import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, Menu, Package, ShieldCheck, Wrench, FileText, Users, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Devices', href: '/devices', icon: Package },
    { name: 'Claims', href: '/claims', icon: Wrench },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Household', href: '/household', icon: Users },
];

function Brand({ compact = false }) {
    return (
        <Link to="/dashboard" className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-700 text-white">
        <ShieldCheck className="h-6 w-6" />
      </span>
            {!compact && (
                <span>
          <b className="block text-lg font-semibold tracking-tight text-slate-950 dark:text-white">WarrantyHub</b>
          <small className="block text-xs text-slate-500 dark:text-slate-400">Protect what matters</small>
        </span>
            )}
        </Link>
    );
}

function Navigation({ collapsed, onNavigate }) {
    const location = useLocation();
    return (
        <nav className="space-y-1">
            {navigation.map(item => {
                const Icon = item.icon;
                const active = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
                return (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        onClick={onNavigate}
                        title={collapsed ? item.name : undefined}
                        className={`flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                            collapsed ? 'justify-center' : 'gap-3'
                        } ${
                            active
                                ? 'bg-blue-50 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        {!collapsed && item.name}
                    </NavLink>
                );
            })}
        </nav>
    );
}

function UserProfile({ collapsed, onClick }) {
    const { user } = useAuth();
    const userName = user?.name || 'User';
    const initials = userName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <button
            onClick={onClick}
            title={collapsed ? userName : undefined}
            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white ${
                collapsed ? 'justify-center' : 'gap-3'
            }`}
        >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-700">
        {initials}
      </span>
            {!collapsed && <span className="truncate">{userName}</span>}
        </button>
    );
}

export function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();

    const handleProfileClick = () => {
        setMobileOpen(false);
        navigate('/profile');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* Desktop Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 hidden border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all lg:block ${
                    collapsed ? 'w-20' : 'w-64'
                }`}
            >
                <div className={`flex h-full flex-col p-4 ${collapsed ? 'items-center' : ''}`}>
                    <div className="mb-10 mt-2">
                        {collapsed ? <Brand compact /> : <Brand />}
                    </div>
                    <Navigation collapsed={collapsed} />
                    <div className="mt-auto border-t border-slate-200 dark:border-slate-800 pt-4">
                        <UserProfile collapsed={collapsed} onClick={handleProfileClick} />
                    </div>
                </div>
                <button
                    aria-label="Toggle sidebar"
                    onClick={() => setCollapsed(value => !value)}
                    className="absolute -right-3 top-20 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 text-slate-500 dark:text-slate-400 shadow-sm hover:text-blue-700 dark:hover:text-blue-400"
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            </aside>

            {/* Mobile Header */}
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 lg:hidden">
                <button
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    onClick={() => setMobileOpen(true)}
                    aria-label="Open navigation"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <Brand compact />
                <div className="w-9" /> {/* Spacer for centering */}
            </header>

            {/* Main Content */}
            <div className={`min-h-screen transition-all ${collapsed ? 'lg:pl-20' : 'lg:pl-64'}`}>
                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close navigation"
                    />
                    <aside className="relative flex h-full w-72 flex-col bg-white dark:bg-slate-900 p-5 shadow-xl">
                        <div className="mb-10 flex items-center justify-between">
                            <Brand />
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                                aria-label="Close navigation"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="flex-1">
                            <Navigation onNavigate={() => setMobileOpen(false)} />
                        </div>
                        <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                            <UserProfile collapsed={false} onClick={handleProfileClick} />
                        </div>
                    </aside>
                </div>
            )}
        </div>
    );
}