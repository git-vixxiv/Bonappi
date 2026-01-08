import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../contexts';
import { ROUTES } from '../../constants/routes';

// Google icon component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, loginWithGoogle, devLogin, firebaseEnabled } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);

    const result = await loginWithGoogle();

    if (result.success) {
      navigate(ROUTES.HOME);
    } else {
      setError(result.error || 'Google sign-in failed. Please try again.');
    }

    setGoogleLoading(false);
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
          <p className="text-gray-500 italic">
            Enjoy your meal.
          </p>
        </div>

        {/* Login Form */}
        <Card className="max-w-md mx-auto w-full">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            Welcome back
          </h2>

          {/* Google Sign-in Button - Primary */}
          <Button
            variant="outline"
            fullWidth
            onClick={handleGoogleLogin}
            loading={googleLoading}
            disabled={loading}
            className="mb-4 flex items-center justify-center gap-3"
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or sign in with email</span>
            </div>
          </div>

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
              disabled={googleLoading}
              size="lg"
            >
              Sign In
            </Button>
          </form>

          {/* Dev helper - only show when Firebase is not configured */}
          {!firebaseEnabled && (
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={handleDevLogin}
              className="mt-4 text-gray-400"
            >
              Dev: Quick Login
            </Button>
          )}
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
