import { useState } from 'react';
import { Clock, Users, AlertTriangle } from 'lucide-react';
import { Button } from '../ui';

const money = (cents) => `$${(cents / 100).toFixed(2)}`;

// What staff can do next from each status. Labels are verbs on the button.
const ACTIONS = {
  pending: [
    { status: 'accepted', label: 'Accept' },
    { status: 'declined', label: 'Decline', variant: 'outline', confirm: 'Decline this order? The diner is refunded.' },
  ],
  accepted: [
    { status: 'arrived', label: 'Mark arrived' },
    { status: 'no_show', label: 'No-show', variant: 'outline', confirm: 'Mark as no-show? The payment is kept.', afterGrace: true },
  ],
  arrived: [{ status: 'firing', label: 'Fire' }],
  firing: [{ status: 'served', label: 'Served' }],
  served: [{ status: 'closed', label: 'Close', needsFinalCheck: true }],
};

function summarize(customizations) {
  if (!customizations) return '';
  const parts = [customizations.size, customizations.crust];
  if (customizations.toppings?.length) parts.push(customizations.toppings.join(', '));
  if (customizations.combo) parts.push('combo');
  return parts.filter(Boolean).join(' · ');
}

export default function OrderCard({ order, timezone, graceMinutes, now, onAdvance }) {
  const [busy, setBusy] = useState(false);
  const [closing, setClosing] = useState(false);
  const [finalCheck, setFinalCheck] = useState('');
  const [error, setError] = useState('');

  const arrival = new Date(order.arrival_at);
  const minutesUntil = Math.round((arrival - now) / 60000);
  const late = order.status === 'accepted' && minutesUntil < 0;
  const pastGrace = order.status === 'accepted' && minutesUntil < -graceMinutes;

  const run = async (action) => {
    if (action.needsFinalCheck && !closing) {
      setClosing(true);
      return;
    }
    if (action.confirm && !window.confirm(action.confirm)) return;

    let finalCents = null;
    if (action.needsFinalCheck) {
      finalCents = Math.round(parseFloat(finalCheck) * 100);
      if (!Number.isFinite(finalCents) || finalCents < order.total_cents) {
        setError(`Enter the full check total, at least ${money(order.total_cents)}.`);
        return;
      }
    }

    setBusy(true);
    setError('');
    try {
      await onAdvance(order.id, action.status, finalCents);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const actions = (ACTIONS[order.status] ?? []).filter((a) => !a.afterGrace || pastGrace);

  return (
    <article
      className={`bg-white rounded-xl border p-3 shadow-sm ${late ? 'border-warning-500' : 'border-gray-200'}`}
      aria-label={`Order for ${order.diner_name}`}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{order.diner_name || 'Guest'}</h3>
          <div className="flex items-center gap-3 text-sm text-gray-600 mt-0.5">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {arrival.toLocaleTimeString('en-US', { timeZone: timezone, hour: 'numeric', minute: '2-digit' })}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {order.party_size}
            </span>
          </div>
        </div>
        <span className="text-sm font-semibold text-gray-900">{money(order.total_cents)}</span>
      </header>

      {late && (
        <p className="flex items-center gap-1 text-xs font-medium text-warning-600 mt-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          {-minutesUntil} min late{pastGrace ? ' · past grace period' : ''}
        </p>
      )}

      <ul className="mt-2 space-y-1 text-sm">
        {order.order_items.map((item) => (
          <li key={item.id}>
            <span className="font-medium">{item.quantity}× {item.name}</span>
            {summarize(item.customizations) && (
              <span className="block text-xs text-gray-500">{summarize(item.customizations)}</span>
            )}
            {item.special_instructions && (
              <span className="block text-xs text-gray-700 italic">“{item.special_instructions}”</span>
            )}
          </li>
        ))}
      </ul>
      {order.notes && <p className="mt-2 text-xs text-gray-700 bg-gray-50 rounded p-2">{order.notes}</p>}

      {closing && (
        <label className="block mt-3 text-sm">
          <span className="text-gray-700">Final check total (incl. table orders)</span>
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min={order.total_cents / 100}
            value={finalCheck}
            onChange={(e) => setFinalCheck(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            autoFocus
          />
        </label>
      )}

      {error && <p className="mt-2 text-xs text-error-600">{error}</p>}

      {actions.length > 0 && (
        <div className="flex gap-2 mt-3">
          {actions.map((action) => (
            <Button
              key={action.status}
              size="sm"
              variant={action.variant ?? 'primary'}
              fullWidth
              loading={busy}
              onClick={() => run(action)}
            >
              {action.needsFinalCheck && closing ? 'Confirm close' : action.label}
            </Button>
          ))}
        </div>
      )}
    </article>
  );
}
