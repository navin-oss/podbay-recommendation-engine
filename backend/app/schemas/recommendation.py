from typing import List, Optional, Dict
from pydantic import BaseModel, Field
from backend.app.schemas.studio import Studio

class ScoreBreakdown(BaseModel):
    city_match: float = Field(..., description="Proximity / alignment to user's active city (max 25)")
    genre_match: float = Field(..., description="Format compatibility with booking history & preferences (max 30)")
    saved_studio: float = Field(..., description="Explicit user wishlist / saved intent (max 20)")
    amenities: float = Field(..., description="Studio production gear, acoustic treatment & video fit (max 10)")
    quality_rating: float = Field(..., description="Rating on 5-star scale (max 10)")
    popularity_reviews: float = Field(..., description="Review volume / established social proof (max 5)")
    total: float = Field(..., description="Normalized composite match score (0-100)")

class RecommendationItem(BaseModel):
    rank: int
    studio: Studio
    score: float
    score_breakdown: ScoreBreakdown
    explanation: str
    reasons: List[str]
    is_saved: bool
    confidence: str
    confidence_score: float

class RecommendationResponse(BaseModel):
    user_id: str
    user_display_name: str
    last_active_city: Optional[str] = None
    is_cold_start: bool
    explanation_summary: str
    total_candidates: int
    recommendations: List[RecommendationItem]
