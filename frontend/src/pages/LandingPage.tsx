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
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fixed navigation functions - ensure they're called with strings only
  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleLinkClick = (href: string) => {
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
      title: "Never Miss a Warranty",
      description: "Track all your home appliances and get reminders before warranties expire",
      color: "from-emerald-500 to-green-600"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Get timely alerts when your warranties are about to expire",
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: FileText,
      title: "Document Management",
      description: "Store all warranty documents, receipts, and maintenance records safely",
      color: "from-purple-500 to-indigo-600"
    },
    {
      icon: Download,
      title: "Easy Export & Share",
      description: "Export device details as PDFs and share with service providers instantly",
      color: "from-orange-500 to-red-600"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      content: "WarrantyHub saved me $500 on my refrigerator repair. I almost missed the warranty deadline!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Tech Enthusiast",
      content: "Finally, all my device warranties in one place. The reminders are a lifesaver.",
      rating: 5
    },
    {
      name: "Emily Davis",
      role: "Busy Parent",
      content: "With 10+ appliances at home, this app keeps me organized and stress-free.",
      rating: 5
    }
  ];

  const deviceIcons = [
    { Icon: Smartphone, name: "Phones" },
    { Icon: Tv, name: "TVs" },
    { Icon: Refrigerator, name: "Fridges" },
    { Icon: WashingMachine, name: "Washers" },
    { Icon: Laptop, name: "Laptops" },
    { Icon: AirVent, name: "AC Units" }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">WarrantyHub</h1>
                <p className="text-xs text-gray-400">Never Miss a Warranty Again.</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => handleLinkClick('#features')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => handleLinkClick('#how-it-works')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                How it Works
              </button>
              <button 
                onClick={() => handleLinkClick('#testimonials')}
                className="text-gray-300 hover:text-white transition-colors"
              >
                Reviews
              </button>
              <button 
                onClick={handleSignIn}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Sign In
              </button>
              <button 
                onClick={handleGetStarted}
                className="bg-white text-slate-900 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-800">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => {
                    handleLinkClick('#features');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => {
                    handleLinkClick('#how-it-works');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-300 hover:text-white transition-colors"
                >
                  How it Works
                </button>
                <button 
                  onClick={() => {
                    handleLinkClick('#testimonials');
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-gray-300 hover:text-white transition-colors"
                >
                  Reviews
                </button>
                <button 
                  onClick={() => {
                    handleSignIn();
                    setIsMenuOpen(false);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-lg font-medium w-full"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    handleGetStarted();
                    setIsMenuOpen(false);
                  }}
                  className="bg-white text-slate-900 px-6 py-2 rounded-lg font-medium w-full"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-8">
              <Shield className="w-4 h-4 mr-2" />
              Your Home's Warranty Guardian
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Never Miss a
              <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Warranty Again
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Keep track of all your home appliances, get timely reminders, and manage warranty documents in one beautiful, organized place.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105"
              >
                Get Started
                <ArrowRight className="inline-block ml-2 w-5 h-5" />
              </button>
              <button className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* Floating Device Icons */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-8 max-w-2xl mx-auto">
              {deviceIcons.map(({ Icon, name }, index) => (
                <div
                  key={name}
                  className="group flex flex-col items-center"
                  style={{
                    animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                    animationDelay: `${index * 0.2}s`
                  }}
                >
                  <div className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 group-hover:border-blue-500/50 transition-all duration-300 group-hover:scale-110">
                    <Icon className="w-8 h-8 text-gray-400 group-hover:text-blue-400 transition-colors" />
                  </div>
                  <span className="text-xs text-gray-500 mt-2 group-hover:text-gray-300 transition-colors">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="block text-blue-400">Stay Protected</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              WarrantyHub provides comprehensive warranty management with intelligent reminders and seamless document organization.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isActive = index === activeFeature;
              
              return (
                <div
                  key={feature.title}
                  className={`p-8 rounded-2xl border transition-all duration-500 hover:scale-105 cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30 shadow-xl shadow-blue-500/10' 
                      : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div className={`p-4 rounded-xl mb-6 bg-gradient-to-r ${feature.color} inline-block`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple. Smart. Secure.
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started in minutes with our intuitive three-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "01",
                title: "Add Your Devices",
                description: "Simply photograph your appliances and upload warranty documents. Our smart system organizes everything automatically.",
                icon: FileText
              },
              {
                step: "02",
                title: "Set Reminders",
                description: "We'll automatically track expiration dates and send you timely notifications before warranties expire.",
                icon: Bell
              },
              {
                step: "03",
                title: "Stay Protected",
                description: "Access all your warranty information instantly, export PDFs for service calls, and never lose coverage again.",
                icon: Shield
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center group">
                  <div className="relative mb-8">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-white">{item.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-300">
              See what our users say about WarrantyHub
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.name}
                className="p-8 bg-gray-800/50 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-emerald-500/10 border border-blue-500/20 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-cyan-500/5 rounded-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Protect
                <span className="block text-blue-400">Your Investments?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of smart homeowners who never miss a warranty deadline. Start your free trial today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105"
                >
                  Get Started
                  <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </button>
                <button className="border border-gray-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">WarrantyHub</h1>
                <p className="text-xs text-gray-400">Never Miss a Warranty Again.</p>
              </div>
            </div>
            <div className="flex space-x-8 text-gray-400">
              <button className="hover:text-white transition-colors">Privacy</button>
              <button className="hover:text-white transition-colors">Terms</button>
              <button className="hover:text-white transition-colors">Support</button>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2025 WarrantyHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
      `}</style>
    </div>
  );
}