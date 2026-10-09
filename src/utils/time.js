// Time helpers that work in a restaurant's timezone without a date library.

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

// Wall-clock parts of `date` as seen in `timeZone`
function zonedParts(date, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour),
    minute: Number(parts.minute),
  };
}

// Milliseconds the zone is ahead of UTC at `date`
function zoneOffset(date, timeZone) {
  const p = zonedParts(date, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return asUtc - Math.floor(date.getTime() / 60000) * 60000;
}

// The instant when the clock in `timeZone` reads year-month-day hour:minute
export function zonedTimeToDate({ year, month, day, hour, minute }, timeZone) {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const first = guess - zoneOffset(new Date(guess), timeZone);
  // Second pass settles DST transitions
  return new Date(guess - zoneOffset(new Date(first), timeZone));
}

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/**
 * Arrival slots for the next `days` days, every `step` minutes, from opening
 * until `lastSeatingBeforeClose` minutes before closing, and at least
 * `leadMinutes` from now so the kitchen has notice.
 * Returns [{ key, label, slots: [{ iso, label }] }] for days that have slots.
 */
export function arrivalSlots(hours, timeZone, {
  now = new Date(),
  days = 7,
  step = 15,
  leadMinutes = 30,
  lastSeatingBeforeClose = 45,
} = {}) {
  const earliest = now.getTime() + leadMinutes * 60000;
  const today = zonedParts(now, timeZone);
  const result = [];

  for (let offset = 0; offset < days; offset += 1) {
    // Noon avoids DST edges when stepping whole days
    const dayDate = zonedTimeToDate({ ...today, day: today.day + offset, hour: 12, minute: 0 }, timeZone);
    const d = zonedParts(dayDate, timeZone);
    const weekday = WEEKDAYS[new Date(Date.UTC(d.year, d.month - 1, d.day)).getUTCDay()];
    const window = hours?.[weekday];
    if (!window) continue;

    const open = toMinutes(window.open);
    let close = toMinutes(window.close);
    if (close <= open) close += 24 * 60; // closes after midnight

    const slots = [];
    for (let m = open; m <= close - lastSeatingBeforeClose; m += step) {
      const at = zonedTimeToDate({ ...d, hour: 0, minute: m }, timeZone);
      if (at.getTime() < earliest) continue;
      slots.push({
        iso: at.toISOString(),
        label: at.toLocaleTimeString('en-US', { timeZone, hour: 'numeric', minute: '2-digit' }),
      });
    }
    if (slots.length === 0) continue;

    const label =
      offset === 0
        ? 'Today'
        : offset === 1
          ? 'Tomorrow'
          : dayDate.toLocaleDateString('en-US', { timeZone, weekday: 'short', month: 'short', day: 'numeric' });
    result.push({ key: `${d.year}-${d.month}-${d.day}`, label, slots });
  }
  return result;
}

export function formatArrival(iso, timeZone) {
  return new Date(iso).toLocaleString('en-US', {
    timeZone,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
