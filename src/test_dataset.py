import kagglehub
import pandas as pd
from pathlib import Path

# Downloads to ~/.cache/kagglehub/ (global cache, avoids re-downloading)
cache_path = kagglehub.dataset_download("amitanshjoshi/spotify-1million-tracks")

df = pd.read_csv(cache_path + "/spotify_data.csv")
df = df.dropna(subset=["artist_name", "track_name", "valence", "energy", "danceability", "acousticness", "tempo"])
df = df.rename(columns={"artist_name": "artists", "genre": "track_genre"})

out = Path(__file__).parent.parent / "data" / "tracks_cleaned.csv"
out.parent.mkdir(exist_ok=True)
df.to_csv(out, index=False)
print(f"Saved {len(df):,} tracks -> {out}")