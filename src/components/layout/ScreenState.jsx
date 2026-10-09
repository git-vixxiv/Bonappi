import { Loader2 } from 'lucide-react';
import { Button } from '../ui';

// Full-screen loading / error / not-found placeholder
export default function ScreenState({ loading, title, message, actionLabel, onAction }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        {loading ? (
          <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" aria-label="Loading" />
        ) : (
          <>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">{title}</h1>
            {message && <p className="text-gray-500 mb-4">{message}</p>}
            {onAction && <Button onClick={onAction}>{actionLabel}</Button>}
          </>
        )}
      </div>
    </div>
  );
}
