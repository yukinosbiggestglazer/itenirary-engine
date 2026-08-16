import type { FetchPOIsRequest, FetchPOIsResponse } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

export class POIRequestError extends Error {}

/**
 * Sends the current city/POI configuration to the backend pipeline and
 * returns the resolved POIs, grouped by city.
 *
 * When VITE_API_URL is not set (e.g. local UI development before the
 * FastAPI service exists), this transparently falls back to a mock
 * implementation so the rest of the app never needs to know the difference.
 */
export async function fetchPOIs(request: FetchPOIsRequest): Promise<FetchPOIsResponse> {
  if (!API_URL) {
    return mockFetchPOIs(request);
  }

  let response: Response;
  try {
    response = await fetch(`${API_URL}/pois`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
  } catch {
    throw new POIRequestError('Could not reach the server. Check your connection and try again.');
  }

  if (!response.ok) {
    throw new POIRequestError(`The server returned an error (status ${response.status}).`);
  }

  try {
    return (await response.json()) as FetchPOIsResponse;
  } catch {
    throw new POIRequestError('The server response could not be read.');
  }
}
