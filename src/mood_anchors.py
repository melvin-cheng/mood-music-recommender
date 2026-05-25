"""
Mood anchors for music recommendation.
"""
from dataclasses import dataclass
import numpy as np

def _normalize_tempo(tempo: float) -> float:
    return tempo / 200.0
def _denormalize_tempo(tempo_norm: float) -> float:
    return tempo_norm * 200.0
def _mood_embedding(valence: float, energy: float, danceability: float, acousticness: float, tempo: float) -> np.ndarray:
    return np.array([valence, energy, danceability, acousticness, _normalize_tempo(tempo)], dtype=np.float32)

@dataclass
class Mood:
    name: str
    clip_prompt: str
    valence: float
    energy: float
    danceability: float
    acousticness: float
    tempo: float

    def embedding(self) -> np.ndarray:
        return _mood_embedding(self.valence, self.energy, self.danceability, self.acousticness, self.tempo)


MOODS: list[Mood] = [
    Mood("happy_upbeat",     "a cheerful sunny day full of joy and positive energy",       0.90, 0.85, 0.80, 0.10, 128),
    Mood("melancholic",      "a sad emotional moment, longing and heartbreak",             0.15, 0.25, 0.30, 0.60,  70),
    Mood("dreamy_nostalgic", "a hazy nostalgic memory, soft and wistful",                 0.55, 0.35, 0.40, 0.70,  80),
    Mood("workout",          "intense athletic training, pumped up and powerful",          0.70, 0.95, 0.80, 0.05, 150),
    Mood("dark_moody",       "brooding dark atmosphere, tense and cinematic",              0.15, 0.65, 0.40, 0.20, 100),
    Mood("party",            "a crowded dance floor, euphoric and celebratory",            0.85, 0.90, 0.90, 0.05, 128),
    Mood("chill_lofi",       "relaxed late night studying, calm and mellow",               0.50, 0.30, 0.55, 0.75,  85),
    Mood("romantic",         "an intimate candlelit evening, tender and loving",           0.70, 0.40, 0.50, 0.55,  90),
    Mood("focus_study",      "deep concentration and productivity, minimal and clean",     0.45, 0.40, 0.35, 0.50, 110),
    Mood("angry_intense",    "raw aggression and frustration, loud and confrontational",   0.20, 0.95, 0.60, 0.05, 160),
]
