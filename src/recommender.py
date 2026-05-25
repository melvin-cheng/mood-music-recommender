"""
posts -> mood scores -> target features -> k-NN songs.
Pipeline:
  1. Encode (image, caption) into a fused 512-d CLIP embedding.
  2. Score against precomputed mood anchor text embeddings (cosine similarity).
  3. Softmax over scores -> mood distribution.
  4. Weighted mix of mood target feature vectors -> retrieval target.
  5. Euclidean k-NN against the songs dataset in normalized feature space.
"""
from __future__ import annotations
from dataclasses import dataclass
import numpy as np
import pandas as pd
import torch
import torch.nn.functional as F
from PIL import Image
from .embeddings import PostEncoder
from .mood_anchors import MOODS, Mood


FEATURE_COLS = ["valence", "energy", "danceability", "acousticness", "tempo_norm"]
TEMPO_NORM = 200.0


def mood_to_target(mood: Mood) -> np.ndarray:
    return np.array([
        mood.valence,
        mood.energy,
        mood.danceability,
        mood.acousticness,
        mood.tempo / TEMPO_NORM,
    ], dtype=np.float32)


@dataclass
class Recommendation:
    track_id: str
    name: str
    artist_name: str
    album_name: str
    genre: str
    score: float  # lower is better (Euclidean distance)


def _load_dataset(path: str) -> pd.DataFrame:
    raw_cols = ["valence", "energy", "danceability", "acousticness", "tempo"]
    df = pd.read_csv(path)
    df = df.dropna(subset=raw_cols)
    df["tempo_norm"] = df["tempo"] / TEMPO_NORM
    return df.reset_index(drop=True)


def _knn(songs: pd.DataFrame, target: np.ndarray, k: int) -> list[Recommendation]:
    matrix = songs[FEATURE_COLS].to_numpy(dtype=np.float32)
    dists = np.linalg.norm(matrix - target, axis=1)
    top_idx = np.argpartition(dists, k)[:k]
    top_idx = top_idx[np.argsort(dists[top_idx])]
    return [
        Recommendation(
            track_id=str(songs.iloc[i].get("track_id", "")),
            name=str(songs.iloc[i].get("track_name", "")),
            artist_name=str(songs.iloc[i].get("artists", "")),
            album_name=str(songs.iloc[i].get("album_name", "")),
            genre=str(songs.iloc[i].get("track_genre", "")),
            score=float(dists[i]),
        )
        for i in top_idx
    ]


class MusicMoodRecommender:

    def __init__(self, dataset_path: str, image_weight: float = 0.5, softmax_temp: float = 100.0,) -> None:
        self.image_weight = image_weight
        self.softmax_temp = softmax_temp
        self._encoder = PostEncoder()
        self._songs = _load_dataset(dataset_path)
        self._anchor_embs = self._precompute_anchors()   # (n_moods, 512)
        self._feature_matrix = self._build_feature_matrix()  # (n_moods, n_features)

    def _precompute_anchors(self) -> torch.Tensor:
        prompts = [m.clip_prompt for m in MOODS]
        return self._encoder.encode_text(prompts)

    def _build_feature_matrix(self) -> np.ndarray:
        return np.stack([mood_to_target(m) for m in MOODS])  # (n_moods, n_features)

    def _mood_scores(self, embedding: torch.Tensor) -> np.ndarray:
        sims = F.cosine_similarity(embedding.unsqueeze(0), self._anchor_embs)
        scores = F.softmax(sims * self.softmax_temp, dim=0)
        return scores.cpu().numpy()

    def recommend(self, image: Image.Image | None = None, caption: str | None = None, k: int = 10,) -> list[Recommendation]:
        embedding = self._encoder.encode(image, caption, self.image_weight)
        scores = self._mood_scores(embedding)
        target = (scores @ self._feature_matrix).astype(np.float32)
        return _knn(self._songs, target, k)


MoodMusicRecommender = MusicMoodRecommender
