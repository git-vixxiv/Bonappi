import { useState } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { Phone, Mail, KeyRound, User } from 'lucide-react';
import { Button, Input, Card } from '../../components/ui';
import { useAuth } from '../../contexts';
import { ROUTES } from '../../constants/routes';
import { normalizePhone } from '../../utils/phone';

// Phone number + texted code is the primary sign-in; email code is the
// fallback (and how restaurant staff sign in).
export default function LoginScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // Only allow in-app paths as a return target
  const next = searchParams.get('next')?.startsWith('/') && !searchParams.get('next').startsWith('//')
    ? searchParams.get('next')
    : ROUTES.HOME;
  const { isAuthenticated, needsName, sendCode, verifyCode, updateProfile } = useAuth();

  const [method, setMethod] = useState(next === ROUTES.KITCHEN ? 'email' : 'phone');
  const [step, setStep] = useState('identify');
  const [identifier, setIdentifier] = useState('');
  const [target, setTarget] = useState(null);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated && !needsName) {
    return <Navigate to={next} replace />;
  }

  const switchMethod = () => {
    setMethod(method === 'phone' ? 'email' : 'phone');
    setIdentifier('');
    setError('');
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');

    let contact;
    if (method === 'phone') {
      const phone = normalizePhone(identifier);
      if (!phone) {
        setError('Enter a 10-digit US phone number.');
        return;
      }
      contact = { phone };
    } else {
      contact = { email: identifier.trim().toLowerCase() };
    }

    setLoading(true);
    const result = await sendCode(contact);
    setLoading(false);

    if (result.success) {
      setTarget(contact);
      setStep('verify');
    } else {
      setError(result.error);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await verifyCode({ ...target, token: code.trim() });
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await updateProfile({ name: name.trim() });
    setLoading(false);
    if (result.success) navigate(next, { replace: true });
    else setError(result.error);
  };

  const showNameStep = isAuthenticated && needsName;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-4 py-12">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="BonAppi" className="h-16 w-auto mx-auto mb-3" />
          <p className="text-gray-500">Your dining companion</p>
        </div>

        <Card className="max-w-md mx-auto w-full">
          {showNameStep ? (
            <form onSubmit={handleSaveName} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                What should we call you?
              </h2>
              <p className="text-sm text-gray-500 text-center">
                Restaurants see this name on your orders.
              </p>
              <Input
                label="Your name"
                placeholder="First name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<User className="w-5 h-5" />}
                autoComplete="given-name"
                required
              />
              {error && <p className="text-error-500 text-sm">{error}</p>}
              <Button type="submit" fullWidth size="lg" loading={loading}>
                Continue
              </Button>
            </form>
          ) : step === 'identify' ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Sign in or create an account
              </h2>
              {method === 'phone' ? (
                <Input
                  type="tel"
                  label="Mobile number"
                  placeholder="(512) 555-0100"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  leftIcon={<Phone className="w-5 h-5" />}
                  autoComplete="tel-national"
                  required
                />
              ) : (
                <Input
                  type="email"
                  label="Email"
                  placeholder="you@example.com"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  leftIcon={<Mail className="w-5 h-5" />}
                  autoComplete="email"
                  required
                />
              )}
              {error && <p className="text-error-500 text-sm">{error}</p>}
              <Button type="submit" fullWidth size="lg" loading={loading}>
                Send code
              </Button>
              <button
                type="button"
                onClick={switchMethod}
                className="w-full text-sm text-primary-600 hover:text-primary-700"
              >
                {method === 'phone' ? 'Use email instead' : 'Use phone instead'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 text-center">
                Enter your code
              </h2>
              <p className="text-sm text-gray-500 text-center">
                Sent to {target.phone || target.email}.
                {target.email && ' You can also tap the link in the email.'}
              </p>
              <Input
                inputMode="numeric"
                label="Code"
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                leftIcon={<KeyRound className="w-5 h-5" />}
                autoComplete="one-time-code"
                required
              />
              {error && <p className="text-error-500 text-sm">{error}</p>}
              <Button type="submit" fullWidth size="lg" loading={loading}>
                Verify
              </Button>
              <button
                type="button"
                onClick={() => {
                  setStep('identify');
                  setCode('');
                  setError('');
                }}
                className="w-full text-sm text-primary-600 hover:text-primary-700"
              >
                Use a different {method === 'phone' ? 'number' : 'email'}
              </button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
