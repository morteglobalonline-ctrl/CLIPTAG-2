import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Zap, Eye, EyeOff, Check } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    'Access to all AI tools',
    'Unlimited content generation',
    'Secure content library',
    'Cancel anytime'
  ];

  return (
    <PublicLayout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#FF5F1F] rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-black" />
              </div>
              <span className="font-bold text-2xl text-white">ClipTag AI</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Create your account</h1>
            <p className="text-[#A1A1AA] mt-2">Start creating amazing content today</p>
          </div>

          {/* Form */}
          <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                  Full Name
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F]"
                  placeholder="John Doe"
                  data-testid="register-name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F]"
                  placeholder="you@example.com"
                  data-testid="register-email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#A1A1AA] mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F] pr-10"
                    placeholder="Create a password (min 6 chars)"
                    data-testid="register-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF5F1F] text-black font-bold py-6 hover:bg-[#FF7A45] hover:shadow-[0_0_15px_rgba(255,95,31,0.4)] disabled:opacity-50"
                data-testid="register-submit"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-[#27272A]">
              <p className="text-[#52525B] text-xs mb-3">What you'll get:</p>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 text-[#A1A1AA] text-sm">
                    <Check className="w-4 h-4 text-[#10B981]" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 text-center">
              <p className="text-[#A1A1AA] text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-[#FF5F1F] hover:underline" data-testid="register-login-link">
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-[#52525B] text-xs">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-[#A1A1AA] hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-[#A1A1AA] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default RegisterPage;
