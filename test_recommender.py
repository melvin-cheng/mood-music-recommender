"""
Quick usability test: image + caption -> music recommendations.

Creates a synthetic 200-song dataset and two test posts:
  1. A bright/warm image + "golden hour vibes, feeling grateful"
  2. A dark/cool image + "3am can't sleep, overthinking everything"

Run from the repo root:
    python test_recommender.py
"""
import sys
import os
import numpy as np
import pandas as pd
from PIL import Image

sys.path.insert(0, os.path.dirname(__file__))
from src.recommender import MusicMoodRecommender


# ── Synthetic dataset ────────────────────────────────────────────────────────

def make_dataset(path: str, n: int = 200, seed: int = 42) -> None:
    rng = np.random.default_rng(seed)
    genres = ["pop", "indie", "hip-hop", "electronic", "r&b", "rock", "jazz", "classical", "folk", "metal"]
    artists = [
        "Taylor Swift", "Radiohead", "Kendrick Lamar", "Daft Punk", "Frank Ocean",
        "Tame Impala", "Billie Eilish", "The Weeknd", "SZA", "LCD Soundsystem",
        "Bon Iver", "Tyler the Creator", "Rihanna", "Arctic Monkeys", "Portishead",
        "Burial", "Sufjan Stevens", "Kanye West", "Lorde", "James Blake",
    ]
    rows = []
    for i in range(n):
        rows.append({
            "track_id": f"track_{i:03d}",
            "track_name": f"Song {i + 1}",
            "artists": rng.choice(artists),
            "album_name": f"Album {i // 5 + 1}",
            "track_genre": rng.choice(genres),
            "valence": float(rng.uniform(0.0, 1.0)),
            "energy": float(rng.uniform(0.0, 1.0)),
            "danceability": float(rng.uniform(0.0, 1.0)),
            "acousticness": float(rng.uniform(0.0, 1.0)),
            "tempo": float(rng.uniform(60.0, 180.0)),
        })
    pd.DataFrame(rows).to_csv(path, index=False)
    print(f"Created synthetic dataset: {path} ({n} songs)")


# ── Test images ──────────────────────────────────────────────────────────────

def make_warm_image() -> Image.Image:
    """Simulates a golden-hour outdoor photo: warm oranges and yellows."""
    img = Image.new("RGB", (224, 224))
    pixels = img.load()
    for y in range(224):
        for x in range(224):
            r = int(255 * (0.9 + 0.1 * x / 224))
            g = int(255 * (0.6 + 0.2 * y / 224))
            b = int(255 * (0.1 + 0.1 * x / 224))
            pixels[x, y] = (min(r, 255), min(g, 255), min(b, 255))
    return img


def make_dark_image() -> Image.Image:
    """Simulates a late-night moody photo: deep blues and dark tones."""
    img = Image.new("RGB", (224, 224))
    pixels = img.load()
    for y in range(224):
        for x in range(224):
            r = int(30 * (1 - x / 224))
            g = int(20 * (1 - y / 224))
            b = int(80 + 60 * (x + y) / 448)
            pixels[x, y] = (r, g, min(b, 255))
    return img


# ── Run ──────────────────────────────────────────────────────────────────────

def print_results(label: str, recs, mood_scores=None) -> None:
    print(f"\n{'=' * 60}")
    print(f"  {label}")
    print(f"{'=' * 60}")
    if mood_scores is not None:
        print("\nMood distribution:")
        from src.mood_anchors import MOODS
        for mood, score in sorted(zip(MOODS, mood_scores), key=lambda x: -x[1]):
            bar = "█" * int(score * 40)
            print(f"  {mood.name:<20} {score:.3f}  {bar}")
    print("\nTop recommendations:")
    for i, r in enumerate(recs, 1):
        print(f"  {i:2}. {r.name:<12}  {r.artist_name:<22}  [{r.genre}]  dist={r.score:.4f}")


def main() -> None:
    dataset_path = "/tmp/test_songs.csv"
    make_dataset(dataset_path)

    print("\nLoading model (CLIP ViT-B/32)...")
    rec = MusicMoodRecommender(dataset_path=dataset_path)

    # Expose mood scores for display
    def recommend_with_scores(image, caption, k=5):
        import torch.nn.functional as F
        embedding = rec._encoder.encode(image, caption, rec.image_weight)
        scores = rec._mood_scores(embedding)
        recs = rec.recommend(image=image, caption=caption, k=k)
        return recs, scores

    # Test 1: warm image + happy caption
    warm_img = make_warm_image()
    recs, scores = recommend_with_scores(warm_img, "golden hour vibes, feeling grateful and alive")
    print_results("POST 1 — warm image + 'golden hour vibes, feeling grateful and alive'", recs, scores)

    # Test 2: dark image + sad caption
    dark_img = make_dark_image()
    recs, scores = recommend_with_scores(dark_img, "3am can't sleep, overthinking everything")
    print_results("POST 2 — dark image + '3am can't sleep, overthinking everything'", recs, scores)

    # Test 3: caption only (no image)
    recs, scores = recommend_with_scores(None, "let's get this party started, hands in the air!")
    print_results("POST 3 — caption only: 'let's get this party started, hands in the air!'", recs, scores)

    # Test 4: image only (no caption)
    recs, scores = recommend_with_scores(warm_img, None)
    print_results("POST 4 — warm image only (no caption)", recs, scores)

    print("\nDone.")


if __name__ == "__main__":
    main()
