import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PublicLayout } from '../components/layout/PublicLayout';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Zap, Eye, EyeOff } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-white">Welcome back</h1>
            <p className="text-[#A1A1AA] mt-2">Sign in to your account to continue</p>
          </div>

          {/* Form */}
          <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-8">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  data-testid="login-email"
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
                    className="bg-[#121212] border-[#27272A] text-white placeholder:text-[#52525B] focus:border-[#FF5F1F] focus:ring-[#FF5F1F] pr-10"
                    placeholder="Enter your password"
                    data-testid="login-password"
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
                data-testid="login-submit"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-[#A1A1AA] text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#FF5F1F] hover:underline" data-testid="login-register-link">
                  Get Started
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
