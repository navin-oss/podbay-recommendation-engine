from typing import Dict, Any, List
from pydantic import BaseModel

class DashboardStats(BaseModel):
    total_studios: int
    active_studios: int
    inactive_studios: int
    total_users: int
    users_with_bookings: int
    users_cold_start: int
    users_with_saved: int
    studios_by_city: Dict[str, int]
    studios_by_genre: Dict[str, int]
    average_price_per_hour: float
    average_rating: float
    price_range: Dict[str, float]
    engine_overview: Dict[str, Any]
