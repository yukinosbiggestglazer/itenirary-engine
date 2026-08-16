import { useCallback, useState } from 'react';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { MapView } from '@/components/Map/MapView';
import { ResultsPanel } from '@/components/ResultsPanel/ResultsPanel';
import { fetchPOIs, POIRequestError } from '@/api/pois';
import { canSubmit } from '@/utils/validation';
import type { CityConfig, CityPOIResult, FetchPOIsRequest, POICategory, RequestState } from '@/types';

function createCity(): CityConfig {
  return { id: crypto.randomUUID(), name: '', pois: [] };
}

export default function App() {
  const [cities, setCities] = useState<CityConfig[]>([createCity()]);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [requestState, setRequestState] = useState<RequestState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<CityPOIResult[]>([]);
  // Snapshot of city name -> position at the time of the last fetch, so
  // marker/result colors stay stable even if the sidebar is edited afterward.
  const [resultCityColorIndex, setResultCityColorIndex] = useState<Record<string, number>>({});

  const addCity = useCallback(() => {
    setCities((prev) => [...prev, createCity()]);
  }, []);

  const removeCity = useCallback((id: string) => {
    setCities((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const renameCity = useCallback((id: string, name: string) => {
    setCities((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
  }, []);

  const togglePOI = useCallback((id: string, category: POICategory) => {
    setCities((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const has = c.pois.includes(category);
        return { ...c, pois: has ? c.pois.filter((p) => p !== category) : [...c.pois, category] };
      })
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    setAttemptedSubmit(true);
    if (!canSubmit(cities)) return;

    const colorIndex: Record<string, number> = {};
    cities.forEach((c, i) => {
      colorIndex[c.name.trim()] = i;
    });

    const request: FetchPOIsRequest = {
        cities: Object.fromEntries(
          cities.map((c) => [c.name.trim(), c.pois])
      ),
    };

    setRequestState('loading');
    setErrorMessage(null);

    try {
      const response = await fetchPOIs(request);
      setResults(response.cities);
      setResultCityColorIndex(colorIndex);
      setRequestState('success');
    } catch (err) {
      const message =
        err instanceof POIRequestError ? err.message : 'Unexpected error while fetching POIs.';
      setErrorMessage(message);
      setRequestState('error');
    }
  }, [cities]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-ink md:flex-row">
      <Sidebar
        cities={cities}
        requestState={requestState}
        errorMessage={errorMessage}
        attemptedSubmit={attemptedSubmit}
        onAddCity={addCity}
        onRemoveCity={removeCity}
        onNameChange={renameCity}
        onTogglePOI={togglePOI}
        onSubmit={handleSubmit}
      />

      <main className="h-[45vh] min-h-[320px] flex-1 md:h-full">
        <MapView
          requestState={requestState}
          errorMessage={errorMessage}
          results={results}
          cityColorIndex={resultCityColorIndex}
        />
      </main>

      <ResultsPanel
        requestState={requestState}
        errorMessage={errorMessage}
        results={results}
        cityColorIndex={resultCityColorIndex}
      />
    </div>
  );
}
