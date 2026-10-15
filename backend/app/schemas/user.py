from typing import List, Optional
from pydantic import BaseModel, Field

class BookingRecord(BaseModel):
    studio_id: str
    date: str
    genre: str
    studio_name: Optional[str] = None
    studio_city: Optional[str] = None
    studio_price: Optional[float] = None

class UserProfile(BaseModel):
    user_id: str
    display_name: str
    profile_city: Optional[str] = None
    last_active_city: Optional[str] = None
    past_bookings: List[BookingRecord] = Field(default_factory=list)
    saved_studios: List[str] = Field(default_factory=list)
    preferred_genres: List[str] = Field(default_factory=list)
    data_status: Optional[str] = None
    notes: Optional[str] = None
    is_cold_start: bool = False
    booking_count: int = 0
    saved_count: int = 0

class UserListResponse(BaseModel):
    total: int
    cold_start_count: int
    items: List[UserProfile]

class UserHistoryResponse(BaseModel):
    user_id: str
    display_name: str
    last_active_city: Optional[str] = None
    booking_count: int
    saved_count: int
    bookings: List[BookingRecord]
    saved_studios: List[dict]
