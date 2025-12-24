import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../contexts';
import { ROUTES } from '../../constants/routes';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, devLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      navigate(ROUTES.HOME);
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }

    setLoading(false);
  };

  const handleDevLogin = () => {
    devLogin();
    navigate(ROUTES.HOME);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12">
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo.png"
            alt="BonAppi"
            className="h-16 w-auto mx-auto mb-3"
          />
          <p className="text-gray-500">
            Your dining companion
          </p>
        </div>

        {/* Login Form */}
        <Card className="max-w-md mx-auto w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Welcome back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              type={showPassword ? 'text' : 'password'}
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
              required
            />

            {error && (
              <p className="text-error-500 text-sm">{error}</p>
            )}

            <div className="flex justify-end">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              size="lg"
            >
              Sign In
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or</span>
            </div>
          </div>

          {/* Social login buttons - placeholder */}
          <div className="space-y-3">
            <Button variant="outline" fullWidth disabled>
              Continue with Google
            </Button>
            <Button variant="outline" fullWidth disabled>
              Continue with Apple
            </Button>
          </div>

          {/* Dev helper */}
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={handleDevLogin}
            className="mt-4 text-gray-400"
          >
            Dev: Quick Login
          </Button>
        </Card>

        {/* Register link */}
        <p className="text-center mt-6 text-gray-500">
          Don't have an account?{' '}
          <Link
            to={ROUTES.REGISTER}
            className="text-primary-600 font-medium hover:text-primary-700"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
