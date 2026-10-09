import { useMemo, useState } from 'react';
import { Minus, Plus, Users } from 'lucide-react';
import { Card } from '../ui';
import { arrivalSlots } from '../../utils/time';

const MAX_PARTY = 12;

// Arrival time + party size. This stands in for reservations in the pilot;
// the restaurant accepts or declines each one.
export default function ArrivalPicker({ restaurant, value, onChange }) {
  const days = useMemo(
    () => arrivalSlots(restaurant.hours, restaurant.timezone),
    [restaurant.hours, restaurant.timezone]
  );
  const partySize = value?.partySize ?? 2;
  const selectedIso = value?.arrivalAt ?? null;

  const selectedDayKey = days.find((d) => d.slots.some((s) => s.iso === selectedIso))?.key;
  const [dayKey, setDayKey] = useState(selectedDayKey ?? days[0]?.key);
  const day = days.find((d) => d.key === dayKey) ?? days[0];

  const update = (patch) => onChange({ arrivalAt: selectedIso, partySize, ...patch });

  if (days.length === 0) {
    return (
      <Card>
        <h3 className="font-semibold text-gray-900 mb-1">When are you arriving?</h3>
        <p className="text-sm text-gray-500">No arrival times available this week.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="font-semibold text-gray-900 mb-3">When are you arriving?</h3>

      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" role="tablist" aria-label="Day">
        {days.map((d) => (
          <button
            key={d.key}
            role="tab"
            aria-selected={d.key === day.key}
            onClick={() => setDayKey(d.key)}
            className={`shrink-0 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
              d.key === day.key
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-2 mt-2 max-h-48 overflow-y-auto" aria-label="Arrival time">
        {day.slots.map((slot) => (
          <button
            key={slot.iso}
            onClick={() => update({ arrivalAt: slot.iso })}
            aria-pressed={slot.iso === selectedIso}
            className={`py-2 rounded-lg text-sm font-medium border transition-colors ${
              slot.iso === selectedIso
                ? 'bg-primary-600 text-white border-primary-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-300'
            }`}
          >
            {slot.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-5 h-5" />
          <span className="font-medium">Party size</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => update({ partySize: Math.max(1, partySize - 1) })}
            disabled={partySize <= 1}
            aria-label="Fewer guests"
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40"
          >
            <Minus className="w-4 h-4 text-gray-600" />
          </button>
          <span className="w-6 text-center font-semibold" aria-live="polite">{partySize}</span>
          <button
            onClick={() => update({ partySize: Math.min(MAX_PARTY, partySize + 1) })}
            disabled={partySize >= MAX_PARTY}
            aria-label="More guests"
            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40"
          >
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </Card>
  );
}
