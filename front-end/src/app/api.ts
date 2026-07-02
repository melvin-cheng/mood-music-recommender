import type { Song } from './App';

// Backend base URL. Override at build/dev time with VITE_API_URL if the API
// isn't on localhost:8000.
const API_BASE =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000';

// Shapes mirror the pydantic models in src/api.py.
export interface MoodScore {
  name: string;
  score: number;
}

export interface Track {
  rank: number;
  track_id: string;
  name: string;
  artist: string;
  album: string;
  genre: string;
  distance: number;
}

export interface RecommendResponse {
  moods: MoodScore[];
  recommendations: Track[];
}

// POST an image + caption to /recommend as multipart/form-data. Either the
// image or the caption may be omitted, but the backend requires at least one.
export async function fetchRecommendations(
  image: File | null,
  caption: string,
  k = 10
): Promise<RecommendResponse> {
  const form = new FormData();
  if (image) form.append('image', image);
  if (caption) form.append('caption', caption);
  form.append('k', String(k));

  // Note: no Content-Type header — the browser sets the multipart boundary.
  const res = await fetch(`${API_BASE}/recommend`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      // response wasn't JSON; keep the generic message
    }
    throw new Error(detail);
  }

  return res.json();
}

// The backend has no album art, so pick a gradient per card from a fixed
// palette (mirrors the seed data in App.tsx).
const GRADIENTS: [string, string][] = [
  ['#7c3aed', '#c026d3'],
  ['#0284c7', '#7c3aed'],
  ['#db2777', '#9333ea'],
  ['#16a34a', '#0284c7'],
  ['#d97706', '#dc2626'],
  ['#475569', '#1e3a5f'],
  ['#6d28d9', '#1e3a5f'],
  ['#0f766e', '#4f46e5'],
];

// Turn a snake_case mood name ("happy_upbeat") into a display label
// ("Happy Upbeat").
function prettifyMood(name: string): string {
  return name
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

// Map the backend response into the frontend Song[] the UI expects. The top
// mood becomes the shared "vibe" label for the batch.
export function tracksToSongs(resp: RecommendResponse): Song[] {
  const topVibe = resp.moods[0] ? prettifyMood(resp.moods[0].name) : 'Vibe';
  return resp.recommendations.map((t, i) => ({
    id: t.track_id || `track-${i}`,
    title: t.name || 'Unknown',
    artist: t.artist || 'Unknown Artist',
    gradient: GRADIENTS[i % GRADIENTS.length],
    genre: t.genre,
    vibe: topVibe,
    duration: '',
  }));
}
