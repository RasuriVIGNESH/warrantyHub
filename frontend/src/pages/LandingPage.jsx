import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Shield,
    Bell,
    FileText,
    Download,
    Smartphone,
    Tv,
    Refrigerator,
    WashingMachine,
    Laptop,
    AirVent,
    ArrowRight,
    Menu,
    X,
    Star,
    Loader2,
    Sun,
    Moon,
    Quote,
    Check
} from 'lucide-react';
import constants from '../utils/constants';

const HEALTH_POLL_INTERVAL_MS = 3000;
const THEME_STORAGE_KEY = 'theme';

/* ═══════════════════════════════════════════════════════════════════════════
   🎨  CENTRALIZED COLOR CONFIG — CHANGE COLORS HERE
   ─────────────────────────────────────────────────────────────────────────
   Edit ONLY this object to change the accent color across the entire page.
   - light: used on the ivory background (#FAF7F2)
   - dark:  used on the deep navy background (#0B0F19)
   ═══════════════════════════════════════════════════════════════════════════ */
const THEME = {
    // DEFAULT — Deep Forest Green (classic luxury / old money)
    light: '#1F4D3A',
    dark:  '#7FB8A0',

    // ── Alternative palettes (uncomment ONE to use) ────────────────────────

    // Option 2: Royal Navy (Harvard / Ralph Lauren vibe)
    // light: '#1B3A5C',
    // dark:  '#7BA7CC',

    // Option 3: Deep Burgundy (wine / velvet)
    // light: '#7C2D3A',
    // dark:  '#D4909A',

    // Option 4: Rich Plum (sophisticated / elegant)
    // light: '#4A2040',
    // dark:  '#B8849E',

    // Option 5: Oxblood Maroon (vintage classic)
    // light: '#6B1F2E',
    // dark:  '#C98A96',

    // Option 6: Deep Teal (refined modern classic)
    // light: '#1A4D5C',
    // dark:  '#6BA8B8',
};
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function LandingPage() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Theme (light/dark) — persisted to localStorage, defaults to system preference
    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
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
        window.localStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    }, [isDark]);

    const toggleTheme = () => setIsDark((prev) => !prev);

    // 🎨 Active accent color — derived from THEME config
    const accent = isDark ? THEME.dark : THEME.light;

    // Server health check ("cold start" wake-up banner)
    const [showServerBanner, setShowServerBanner] = useState(true);

    // Poll until the backend explicitly returns HTTP 200.
    useEffect(() => {
        let isActive = true;
        let pollTimeoutId;
        let controller;
        const checkHealth = async () => {
            controller = new AbortController();
            let shouldRetry = true;
            try {
                const response = await fetch(constants.API_CONFIG.HEALTH_URL, {
                    method: 'GET',
                    cache: 'no-store',
                    signal: controller.signal,
                });
                if (!isActive) return;
                if (response.status === 200) {
                    setShowServerBanner(false);
                    shouldRetry = false;
                    return;
                }
                setShowServerBanner(true);
            } catch (error) {
                if (!isActive || error.name === 'AbortError') return;
                setShowServerBanner(true);
            } finally {
                if (isActive && shouldRetry && !pollTimeoutId && controller && !controller.signal.aborted) {
                    pollTimeoutId = setTimeout(() => {
                        pollTimeoutId = undefined;
                        checkHealth();
                    }, HEALTH_POLL_INTERVAL_MS);
                }
            }
        };
        checkHealth();
        return () => {
            isActive = false;
            if (pollTimeoutId !== undefined) clearTimeout(pollTimeoutId);
            controller?.abort();
        };
    }, []);

    const handleSignIn = () => {
        navigate('/login');
    };

    const handleLinkClick = (href) => {
        if (href && href.startsWith('#')) {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    const features = [
        {
            icon: Shield,
            title: 'Never Miss a Warranty',
            description: 'Track all your home appliances and get reminders before warranties expire.',
            number: '01',
        },
        {
            icon: Bell,
            title: 'Smart Notifications',
            description: 'Get timely alerts when your warranties are about to expire.',
            number: '02',
        },
        {
            icon: FileText,
            title: 'Document Management',
            description: 'Store all warranty documents, receipts, and maintenance records safely.',
            number: '03',
        },
        {
            icon: Download,
            title: 'Easy Export & Share',
            description: 'Export device details as PDFs and share with service providers instantly.',
            number: '04',
        },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Homeowner',
            content:
                'WarrantyHub saved me $500 on my refrigerator repair. I almost missed the warranty deadline.',
            rating: 5,
        },
        {
            name: 'Michael Chen',
            role: 'Tech Enthusiast',
            content:
                'Finally, all my device warranties in one place. The reminders are a lifesaver.',
            rating: 5,
        },
        {
            name: 'Emily Davis',
            role: 'Busy Parent',
            content:
                'With 10+ appliances at home, this app keeps me organized and stress-free.',
            rating: 5,
        },
    ];

    const deviceIcons = [
        { Icon: Smartphone, name: 'Phones' },
        { Icon: Tv, name: 'TVs' },
        { Icon: Refrigerator, name: 'Fridges' },
        { Icon: WashingMachine, name: 'Washers' },
        { Icon: Laptop, name: 'Laptops' },
        { Icon: AirVent, name: 'AC Units' },
    ];

    return (
        <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#0B0F19] text-[#1A1A1A] dark:text-[#F5F1E8] transition-colors duration-500 font-sans">
            {/* Inject Google Fonts + keyframes + dynamic accent color */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-serif-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-sans-body { font-family: 'Inter', system-ui, sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
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
          width: 60px;
          background: linear-gradient(to right, transparent, currentColor, transparent);
        }
      `}</style>

            {/* Server wake-up banner */}
            {showServerBanner && (
                <div
                    role="status"
                    aria-live="polite"
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-[92%] sm:w-auto max-w-md"
                >
                    <div
                        className="flex items-center gap-3 bg-[#FAF7F2]/95 dark:bg-[#0B0F19]/95 backdrop-blur-lg border rounded-2xl px-5 py-3 shadow-lg"
                        style={{ borderColor: `${accent}40` }}
                    >
                        <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" style={{ color: accent }} />
                        <p className="text-sm text-[#1A1A1A] dark:text-[#F5F1E8] font-sans-body">
                            Server is starting, this might take 30–40 seconds. Please wait…
                        </p>
                    </div>
                </div>
            )}

            {/* Navigation — "Est. 2025" removed, links centered */}
            <nav className="fixed top-0 w-full bg-[#FAF7F2]/90 dark:bg-[#0B0F19]/90 backdrop-blur-lg border-b border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="relative flex justify-between items-center py-5">
                        {/* Logo — left (no "Est. 2025") */}
                        <div className="flex items-center space-x-3 z-10">
                            <div
                                className="w-10 h-10 border rounded-xl flex items-center justify-center transition-colors"
                                style={{ borderColor: accent }}
                            >
                                <Shield className="w-5 h-5" strokeWidth={1.5} style={{ color: accent }} />
                            </div>
                            <h1 className="text-lg font-serif-display font-semibold tracking-wide text-[#1A1A1A] dark:text-[#F5F1E8]">
                                WarrantyHub
                            </h1>
                        </div>

                        {/* Centered Desktop Navigation */}
                        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center space-x-10">
                            <button
                                onClick={() => handleLinkClick('#features')}
                                className="text-sm uppercase tracking-wider text-[#1A1A1A]/70 dark:text-[#F5F1E8]/70 hover:text-[#1A1A1A] dark:hover:text-[#F5F1E8] transition-colors font-sans-body"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => handleLinkClick('#how-it-works')}
                                className="text-sm uppercase tracking-wider text-[#1A1A1A]/70 dark:text-[#F5F1E8]/70 hover:text-[#1A1A1A] dark:hover:text-[#F5F1E8] transition-colors font-sans-body"
                            >
                                Process
                            </button>
                            <button
                                onClick={() => handleLinkClick('#testimonials')}
                                className="text-sm uppercase tracking-wider text-[#1A1A1A]/70 dark:text-[#F5F1E8]/70 hover:text-[#1A1A1A] dark:hover:text-[#F5F1E8] transition-colors font-sans-body"
                            >
                                Testimonials
                            </button>
                        </div>

                        {/* Right side — theme toggle only */}
                        <div className="flex items-center gap-2 z-10">
                            <button
                                onClick={toggleTheme}
                                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                                className="w-10 h-10 border border-[#1A1A1A]/20 dark:border-[#F5F1E8]/20 rounded-xl flex items-center justify-center transition-colors"
                                style={{ ['--hover-color']: accent }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.borderColor = isDark
                                        ? 'rgba(245,241,232,0.2)'
                                        : 'rgba(26,26,26,0.2)')
                                }
                            >
                                {isDark ? (
                                    <Sun className="w-4 h-4" strokeWidth={1.5} />
                                ) : (
                                    <Moon className="w-4 h-4" strokeWidth={1.5} />
                                )}
                            </button>
                            {/* Mobile menu toggle */}
                            <button
                                className="md:hidden w-10 h-10 border border-[#1A1A1A]/20 dark:border-[#F5F1E8]/20 rounded-xl flex items-center justify-center text-[#1A1A1A] dark:text-[#F5F1E8]"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                {isMenuOpen ? <X className="w-4 h-4" strokeWidth={1.5} /> : <Menu className="w-4 h-4" strokeWidth={1.5} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden py-6 border-t border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10 rounded-b-2xl">
                            <div className="flex flex-col space-y-5">
                                {['Features', 'Process', 'Testimonials'].map((label, idx) => {
                                    const hrefs = ['#features', '#how-it-works', '#testimonials'];
                                    return (
                                        <button
                                            key={label}
                                            onClick={() => {
                                                handleLinkClick(hrefs[idx]);
                                                setIsMenuOpen(false);
                                            }}
                                            className="text-left text-sm uppercase tracking-wider text-[#1A1A1A]/70 dark:text-[#F5F1E8]/70 hover:text-[#1A1A1A] dark:hover:text-[#F5F1E8] transition-colors font-sans-body"
                                        >
                                            {label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-36 pb-24 px-6 lg:px-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="divider-ornament mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans-body">
                The Warranty Guardian
              </span>
                        </div>

                        <h1 className="font-serif-display text-5xl md:text-7xl lg:text-8xl font-medium leading-[1.05] mb-8 text-[#1A1A1A] dark:text-[#F5F1E8]">
                            Never Miss a
                            <span className="block italic font-normal" style={{ color: accent }}>
                Warranty Again.
              </span>
                        </h1>

                        <p className="text-lg md:text-xl text-[#1A1A1A]/70 dark:text-[#F5F1E8]/70 mb-14 max-w-2xl mx-auto leading-relaxed font-sans-body font-light">
                            A refined sanctuary for your home's most valuable appliances. Track, protect, and
                            preserve every warranty with quiet confidence.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
                            <button
                                onClick={handleSignIn}
                                className="group flex items-center gap-3 px-8 py-4 bg-[#1A1A1A] dark:bg-[#F5F1E8] text-[#FAF7F2] dark:text-[#0B0F19] transition-all duration-300 text-sm uppercase tracking-[0.2em] font-sans-body rounded-2xl"
                                style={{ ['--hover-bg']: accent }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = accent;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = isDark ? '#F5F1E8' : '#1A1A1A';
                                }}
                            >
                                Begin Your Membership
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                            </button>
                            <button
                                onClick={() => handleLinkClick('#how-it-works')}
                                className="px-8 py-4 border border-[#1A1A1A]/20 dark:border-[#F5F1E8]/20 transition-colors text-sm uppercase tracking-[0.2em] font-sans-body rounded-2xl"
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.borderColor = isDark
                                        ? 'rgba(245,241,232,0.2)'
                                        : 'rgba(26,26,26,0.2)')
                                }
                            >
                                Discover the Process
                            </button>
                        </div>

                        {/* Floating Device Icons — curved containers */}
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-3xl mx-auto">
                            {deviceIcons.map(({ Icon, name }, index) => (
                                <div
                                    key={name}
                                    className="group flex flex-col items-center animate-float"
                                    style={{ animationDelay: `${index * 0.4}s` }}
                                >
                                    <div
                                        className="w-16 h-16 border border-[#1A1A1A]/15 dark:border-[#F5F1E8]/15 rounded-2xl flex items-center justify-center transition-all duration-500"
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor = accent;
                                            e.currentTarget.style.backgroundColor = `${accent}10`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor = isDark
                                                ? 'rgba(245,241,232,0.15)'
                                                : 'rgba(26,26,26,0.15)';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        <Icon
                                            className="w-6 h-6 text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 transition-colors"
                                            strokeWidth={1.25}
                                            style={{ ['--hover-color']: accent }}
                                            onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                        />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 dark:text-[#F5F1E8]/50 mt-3 font-sans-body transition-colors group-hover:text-current" style={{ ['--tw-hover']: accent }}>
                    {name}
                  </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-24 px-6 lg:px-12 border-t border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="divider-ornament mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans-body">
                Our Capabilities
              </span>
                        </div>
                        <h2 className="font-serif-display text-4xl md:text-6xl font-medium mb-6 text-[#1A1A1A] dark:text-[#F5F1E8]">
                            Everything You Need,
                            <span className="block italic font-normal" style={{ color: accent }}>
                Nothing You Don't.
              </span>
                        </h2>
                        <p className="text-lg text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 max-w-2xl mx-auto font-sans-body font-light">
                            Comprehensive warranty management, thoughtfully designed for the modern home.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="group p-8 bg-[#FAF7F2] dark:bg-[#0B0F19] border border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10 rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = `${accent}66`;
                                        e.currentTarget.style.boxShadow = `0 10px 30px -10px ${accent}33`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = isDark
                                            ? 'rgba(245,241,232,0.1)'
                                            : 'rgba(26,26,26,0.1)';
                                        e.currentTarget.style.boxShadow = '';
                                    }}
                                >
                                    <div className="flex items-start justify-between mb-8">
                                        <div
                                            className="w-12 h-12 border border-[#1A1A1A]/20 dark:border-[#F5F1E8]/20 rounded-xl flex items-center justify-center transition-colors"
                                            style={{ backgroundColor: `${accent}10` }}
                                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.borderColor = isDark
                                                    ? 'rgba(245,241,232,0.2)'
                                                    : 'rgba(26,26,26,0.2)')
                                            }
                                        >
                                            <Icon className="w-5 h-5" strokeWidth={1.25} style={{ color: accent }} />
                                        </div>
                                        <span
                                            className="font-serif-display text-3xl font-light text-[#1A1A1A]/20 dark:text-[#F5F1E8]/20 transition-colors"
                                            onMouseEnter={(e) => (e.currentTarget.style.color = `${accent}66`)}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                        >
                      {feature.number}
                    </span>
                                    </div>
                                    <h3 className="font-serif-display text-2xl font-medium mb-4 leading-tight text-[#1A1A1A] dark:text-[#F5F1E8]">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed font-sans-body font-light text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-24 px-6 lg:px-12 border-t border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="divider-ornament mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans-body">
                The Process
              </span>
                        </div>
                        <h2 className="font-serif-display text-4xl md:text-6xl font-medium mb-6 text-[#1A1A1A] dark:text-[#F5F1E8]">
                            Simple.
                            <span className="italic font-normal" style={{ color: accent }}> Elegant.</span> Secure.
                        </h2>
                        <p className="text-lg text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 max-w-2xl mx-auto font-sans-body font-light">
                            Three refined steps to complete peace of mind.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 md:gap-8 relative">
                        {/* Connecting line */}
                        <div
                            className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px"
                            style={{ background: `linear-gradient(to right, transparent, ${accent}66, transparent)` }}
                        ></div>

                        {[
                            {
                                step: 'I',
                                title: 'Add Your Devices',
                                description:
                                    'Photograph your appliances and upload warranty documents. Our system organizes everything with quiet precision.',
                                icon: FileText,
                            },
                            {
                                step: 'II',
                                title: 'Set Reminders',
                                description:
                                    'We track expiration dates automatically and send timely notifications before warranties lapse.',
                                icon: Bell,
                            },
                            {
                                step: 'III',
                                title: 'Stay Protected',
                                description:
                                    'Access warranty information instantly, export PDFs for service calls, and never lose coverage again.',
                                icon: Shield,
                            },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.step} className="text-center group relative">
                                    <div className="relative inline-block mb-8">
                                        <div
                                            className="w-24 h-24 border border-[#1A1A1A]/20 dark:border-[#F5F1E8]/20 rounded-full flex items-center justify-center transition-colors duration-500 bg-[#FAF7F2] dark:bg-[#0B0F19]"
                                            onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.borderColor = isDark
                                                    ? 'rgba(245,241,232,0.2)'
                                                    : 'rgba(26,26,26,0.2)')
                                            }
                                        >
                                            <Icon
                                                className="w-8 h-8 text-[#1A1A1A]/70 dark:text-[#F5F1E8]/70 transition-colors"
                                                strokeWidth={1.25}
                                                style={{ ['--hover-color']: accent }}
                                                onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                                                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                            />
                                        </div>
                                        <div
                                            className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center font-serif-display text-sm text-[#FAF7F2] shadow-md"
                                            style={{ backgroundColor: accent }}
                                        >
                                            {item.step}
                                        </div>
                                    </div>
                                    <h3 className="font-serif-display text-2xl font-medium mb-4 text-[#1A1A1A] dark:text-[#F5F1E8]">
                                        {item.title}
                                    </h3>
                                    <p className="text-sm text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 leading-relaxed font-sans-body font-light max-w-xs mx-auto">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="testimonials" className="py-24 px-6 lg:px-12 border-t border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <div className="divider-ornament mb-6">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans-body">
                Voices of Trust
              </span>
                        </div>
                        <h2 className="font-serif-display text-4xl md:text-6xl font-medium mb-6 text-[#1A1A1A] dark:text-[#F5F1E8]">
                            Trusted by
                            <span className="italic font-normal" style={{ color: accent }}> Discerning</span> Homes.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.name}
                                className="p-10 border border-[#1A1A1A]/15 dark:border-[#F5F1E8]/15 transition-all duration-500 bg-[#FAF7F2] dark:bg-[#0B0F19] rounded-2xl hover:-translate-y-1"
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${accent}80`)}
                                onMouseLeave={(e) =>
                                    (e.currentTarget.style.borderColor = isDark
                                        ? 'rgba(245,241,232,0.15)'
                                        : 'rgba(26,26,26,0.15)')
                                }
                            >
                                <Quote className="w-8 h-8 mb-6" strokeWidth={1} style={{ color: `${accent}66` }} />
                                <div className="flex mb-5">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className="w-3.5 h-3.5 fill-current"
                                            strokeWidth={1}
                                            style={{ color: accent }}
                                        />
                                    ))}
                                </div>
                                <p className="font-serif-display text-lg italic leading-relaxed mb-8 text-[#1A1A1A] dark:text-[#F5F1E8] font-light">
                                    "{testimonial.content}"
                                </p>
                                <div className="pt-6 border-t border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10">
                                    <h4 className="font-serif-display text-base font-medium text-[#1A1A1A] dark:text-[#F5F1E8]">
                                        {testimonial.name}
                                    </h4>
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#1A1A1A]/50 dark:text-[#F5F1E8]/50 mt-1 font-sans-body">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 lg:px-12 border-t border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10">
                <div className="max-w-4xl mx-auto">
                    <div className="border border-[#1A1A1A]/20 dark:border-[#F5F1E8]/20 p-12 md:p-20 text-center relative bg-[#FAF7F2] dark:bg-[#0B0F19] rounded-3xl">
                        {/* Corner ornaments */}
                        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 rounded-tl-xl" style={{ borderColor: accent }}></div>
                        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 rounded-tr-xl" style={{ borderColor: accent }}></div>
                        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 rounded-bl-xl" style={{ borderColor: accent }}></div>
                        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 rounded-br-xl" style={{ borderColor: accent }}></div>

                        <div className="divider-ornament mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] font-sans-body">
                An Invitation
              </span>
                        </div>

                        <h2 className="font-serif-display text-4xl md:text-5xl font-medium mb-6 text-[#1A1A1A] dark:text-[#F5F1E8] leading-tight">
                            Ready to Protect
                            <span className="block italic font-normal" style={{ color: accent }}>
                Your Investments?
              </span>
                        </h2>
                        <p className="text-lg text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 mb-10 max-w-xl mx-auto font-sans-body font-light">
                            Join a community of thoughtful homeowners who refuse to let a single warranty lapse
                            unnoticed.
                        </p>

                        <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-10 text-xs uppercase tracking-[0.2em] text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 font-sans-body">
                            <li className="flex items-center gap-2">
                                <Check className="w-3 h-3" strokeWidth={2} style={{ color: accent }} /> No credit card required
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-3 h-3" strokeWidth={2} style={{ color: accent }} /> Cancel anytime
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-3 h-3" strokeWidth={2} style={{ color: accent }} /> Full access
                            </li>
                        </ul>

                        <button
                            onClick={handleSignIn}
                            className="group inline-flex items-center gap-3 px-10 py-4 bg-[#1A1A1A] dark:bg-[#F5F1E8] text-[#FAF7F2] dark:text-[#0B0F19] transition-all duration-300 text-sm uppercase tracking-[0.2em] font-sans-body rounded-2xl"
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = accent)}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = isDark ? '#F5F1E8' : '#1A1A1A';
                            }}
                        >
                            Begin Your Membership
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={1.5} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-16 px-6 lg:px-12 border-t border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="md:col-span-2">
                            {/* Logo — no "Est. 2025" */}
                            <div className="flex items-center space-x-3 mb-6">
                                <div
                                    className="w-10 h-10 border rounded-xl flex items-center justify-center"
                                    style={{ borderColor: accent }}
                                >
                                    <Shield className="w-5 h-5" strokeWidth={1.5} style={{ color: accent }} />
                                </div>
                                <h1 className="text-lg font-serif-display font-semibold tracking-wide text-[#1A1A1A] dark:text-[#F5F1E8]">
                                    WarrantyHub
                                </h1>
                            </div>
                            <p className="text-sm text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 max-w-sm leading-relaxed font-sans-body font-light">
                                A refined sanctuary for your home's most valuable appliances. Track, protect, and
                                preserve every warranty with quiet confidence.
                            </p>
                        </div>

                        <div>
                            <h4
                                className="text-[10px] uppercase tracking-[0.3em] mb-5 font-sans-body"
                                style={{ color: accent }}
                            >
                                Navigate
                            </h4>
                            <ul className="space-y-3">
                                {['Features', 'Process', 'Testimonials'].map((label, idx) => {
                                    const hrefs = ['#features', '#how-it-works', '#testimonials'];
                                    return (
                                        <li key={label}>
                                            <button
                                                onClick={() => handleLinkClick(hrefs[idx])}
                                                className="text-sm text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 transition-colors font-sans-body"
                                                onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                                                onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                            >
                                                {label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        <div>
                            <h4
                                className="text-[10px] uppercase tracking-[0.3em] mb-5 font-sans-body"
                                style={{ color: accent }}
                            >
                                Legal
                            </h4>
                            <ul className="space-y-3">
                                {['Privacy', 'Terms', 'Support'].map((label) => (
                                    <li key={label}>
                                        <button
                                            className="text-sm text-[#1A1A1A]/60 dark:text-[#F5F1E8]/60 transition-colors font-sans-body"
                                            onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                                            onMouseLeave={(e) => (e.currentTarget.style.color = '')}
                                        >
                                            {label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-[#1A1A1A]/10 dark:border-[#F5F1E8]/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-[#1A1A1A]/50 dark:text-[#F5F1E8]/50 font-sans-body tracking-wide">
                            © 2025 WarrantyHub. All rights reserved.
                        </p>
                        <p
                            className="text-xs italic font-serif-display"
                            style={{ color: `${accent}B3` }}
                        >
                            Crafted with care for the modern home.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}