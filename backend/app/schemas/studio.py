from typing import List, Optional
from pydantic import BaseModel, Field

class Studio(BaseModel):
    studio_id: str
    name: str
    city: str
    price_per_hour: float
    capacity: int
    genre_fit: List[str] = Field(default_factory=list)
    equipment: List[str] = Field(default_factory=list)
    acoustic_treatment: bool
    video_recording: bool
    rating: float
    review_count: int
    active: bool
    currency: str = "INR"
    source_type: Optional[str] = None
    source_note: Optional[str] = None
    availability_note: Optional[str] = None

class StudioListResponse(BaseModel):
    total: int
    active_count: int
    inactive_count: int
    page: int
    page_size: int
    total_pages: int
    items: List[Studio]
