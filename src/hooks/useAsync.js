import { useEffect, useState } from 'react';

// Runs an async loader whenever deps change. Loading is derived from whether
// the stored result belongs to the current deps, so stale results never show.
export function useAsync(loader, deps) {
  const key = JSON.stringify(deps);
  const [result, setResult] = useState({ key: null, data: null, error: null });

  useEffect(() => {
    let active = true;
    loader()
      .then((data) => active && setResult({ key, data, error: null }))
      .catch((error) => active && setResult({ key, data: null, error }));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const current = result.key === key;
  return {
    data: current ? result.data : null,
    error: current ? result.error : null,
    loading: !current,
  };
}
