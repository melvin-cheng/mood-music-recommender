import io
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from pydantic import BaseModel
from .recommender import MusicMoodRecommender
from .mood_anchors import MOODS

DATASET_PATH = os.environ.get(
    "DATASET_PATH",
    os.path.join(os.path.dirname(__file__), "..", "data", "tracks_cleaned.csv"),
)

recommender: MusicMoodRecommender


@asynccontextmanager
async def lifespan(app: FastAPI):
    global recommender
    recommender = MusicMoodRecommender(dataset_path=DATASET_PATH)
    yield


app = FastAPI(title="Mood Music Recommender", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class MoodScore(BaseModel):
    name: str
    score: float


class Track(BaseModel):
    rank: int
    track_id: str
    name: str
    artist: str
    album: str
    genre: str
    distance: float


class RecommendResponse(BaseModel):
    moods: list[MoodScore]
    recommendations: list[Track]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/recommend", response_model=RecommendResponse)
async def recommend(
    image: UploadFile | None = File(default=None),
    caption: str | None = Form(default=None),
    k: int = Form(default=10),
):
    if image is None and not caption:
        raise HTTPException(status_code=422, detail="Provide at least one of: image, caption.")

    pil_image = None
    if image is not None:
        raw = await image.read()
        try:
            pil_image = Image.open(io.BytesIO(raw)).convert("RGB")
        except Exception:
            raise HTTPException(status_code=422, detail="Could not decode image.")

    embedding = recommender._encoder.encode(pil_image, caption, recommender.image_weight)
    scores = recommender._mood_scores(embedding)
    recs = recommender.recommend(image=pil_image, caption=caption, k=k)

    return RecommendResponse(
        moods=sorted(
            [MoodScore(name=m.name, score=float(s)) for m, s in zip(MOODS, scores)],
            key=lambda x: -x.score,
        ),
        recommendations=[
            Track(
                rank=i + 1,
                track_id=r.track_id,
                name=r.name,
                artist=r.artist_name,
                album=r.album_name,
                genre=r.genre,
                distance=r.score,
            )
            for i, r in enumerate(recs)
        ],
    )
