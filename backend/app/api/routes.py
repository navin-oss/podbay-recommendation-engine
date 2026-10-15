from typing import List, Optional
import math
from fastapi import APIRouter, HTTPException, Query
from backend.app.services.data_loader import DataLoader
from backend.app.services.recommender import engine
from backend.app.services.evaluation import EvaluationService
from backend.app.schemas.studio import Studio, StudioListResponse
from backend.app.schemas.user import UserProfile, UserListResponse, UserHistoryResponse
from backend.app.schemas.recommendation import RecommendationResponse
from backend.app.schemas.dashboard import DashboardStats
from backend.app.schemas.evaluation import EvaluationSummary

router = APIRouter()
loader = DataLoader.get_instance()
eval_service = EvaluationService(loader)

@router.get("/health")
def get_health():
    studios = loader.get_studios()
    users = loader.get_users()
    return {
        "status": "ok",
        "service": "PodBay Recommendation Engine API",
        "version": "1.0.0",
        "studios_count": len(studios),
        "users_count": len(users),
        "environment": "local_demo",
    }

@router.get("/dashboard/stats", response_model=DashboardStats)
def get_dashboard_stats():
    return eval_service.get_dashboard_stats()

@router.get("/users", response_model=UserListResponse)
def get_users(
    search: Optional[str] = Query(None, description="Search by ID or name"),
    city: Optional[str] = Query(None, description="Filter by active city"),
    cold_start_only: Optional[bool] = Query(None, description="Filter cold-start users only"),
):
    users = loader.get_users()
    filtered = users

    if search:
        s = search.lower().strip()
        filtered = [
            u for u in filtered
            if s in u.user_id.lower() or s in u.display_name.lower()
        ]
    if city:
        c = city.lower().strip()
        filtered = [
            u for u in filtered
            if (u.last_active_city and c in u.last_active_city.lower()) or
               (u.profile_city and c in u.profile_city.lower())
        ]
    if cold_start_only is not None and cold_start_only:
        filtered = [u for u in filtered if u.is_cold_start]

    cold_count = sum(1 for u in users if u.is_cold_start)
    return UserListResponse(
        total=len(filtered),
        cold_start_count=cold_count,
        items=filtered,
    )

@router.get("/users/{user_id}", response_model=UserProfile)
def get_user_by_id(user_id: str):
    user = loader.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found in PodBay dataset.")
    return user

@router.get("/users/{user_id}/history", response_model=UserHistoryResponse)
def get_user_history(user_id: str):
    history = loader.get_user_history(user_id)
    if not history:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found in PodBay dataset.")
    return UserHistoryResponse(**history)

@router.get("/studios", response_model=StudioListResponse)
def get_studios(
    search: Optional[str] = Query(None, description="Search in name, city, equipment"),
    city: Optional[str] = Query(None, description="Filter by city"),
    min_price: Optional[float] = Query(None, description="Min hourly price"),
    max_price: Optional[float] = Query(None, description="Max hourly price"),
    capacity: Optional[int] = Query(None, description="Minimum seating capacity"),
    genre: Optional[str] = Query(None, description="Supported genre"),
    video_recording: Optional[bool] = Query(None, description="Has video recording"),
    acoustic_treatment: Optional[bool] = Query(None, description="Has acoustic treatment"),
    active_only: Optional[bool] = Query(None, description="Filter only active listings"),
    sort_by: Optional[str] = Query("name", description="Sort option: name, price_asc, price_desc, rating_desc, capacity"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(12, ge=1, le=100, description="Items per page"),
):
    studios = loader.get_studios()
    filtered = studios

    if search:
        s = search.lower().strip()
        filtered = [
            st for st in filtered
            if s in st.name.lower() or
               s in st.city.lower() or
               any(s in g.lower() for g in st.genre_fit) or
               any(s in eq.lower() for eq in st.equipment)
        ]

    if city:
        filtered = [st for st in filtered if st.city.lower() == city.lower().strip()]

    if min_price is not None:
        filtered = [st for st in filtered if st.price_per_hour >= min_price]

    if max_price is not None:
        filtered = [st for st in filtered if st.price_per_hour <= max_price]

    if capacity is not None:
        filtered = [st for st in filtered if st.capacity >= capacity]

    if genre:
        g_term = genre.lower().strip()
        filtered = [
            st for st in filtered
            if any(g_term in g.lower() for g in st.genre_fit)
        ]

    if video_recording is not None:
        filtered = [st for st in filtered if st.video_recording == video_recording]

    if acoustic_treatment is not None:
        filtered = [st for st in filtered if st.acoustic_treatment == acoustic_treatment]

    if active_only is not None:
        filtered = [st for st in filtered if st.active == active_only]

    # Sort
    if sort_by == "price_asc":
        filtered.sort(key=lambda st: st.price_per_hour)
    elif sort_by == "price_desc":
        filtered.sort(key=lambda st: -st.price_per_hour)
    elif sort_by == "rating_desc":
        filtered.sort(key=lambda st: (-st.rating, -st.review_count))
    elif sort_by == "capacity":
        filtered.sort(key=lambda st: -st.capacity)
    else:
        filtered.sort(key=lambda st: st.name)

    total = len(filtered)
    active_cnt = sum(1 for st in filtered if st.active)
    inactive_cnt = total - active_cnt
    total_pages = max(1, math.ceil(total / page_size))

    start = (page - 1) * page_size
    end = start + page_size
    items = filtered[start:end]

    return StudioListResponse(
        total=total,
        active_count=active_cnt,
        inactive_count=inactive_cnt,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        items=items,
    )

@router.get("/studios/{studio_id}", response_model=Studio)
def get_studio_by_id(studio_id: str):
    studio = loader.get_studio_by_id(studio_id)
    if not studio:
        raise HTTPException(status_code=404, detail=f"Studio '{studio_id}' not found in PodBay dataset.")
    return studio

@router.get("/recommendations/{user_id}", response_model=RecommendationResponse)
def get_recommendations(
    user_id: str,
    limit: int = Query(5, ge=1, le=20, description="Top N recommendations"),
    city: Optional[str] = Query(None, description="Optional city filter constraint"),
    max_price: Optional[float] = Query(None, description="Optional maximum hourly price constraint"),
    min_capacity: Optional[int] = Query(None, description="Optional minimum capacity constraint"),
    genre: Optional[str] = Query(None, description="Optional genre constraint"),
    video_recording: Optional[bool] = Query(None, description="Require video recording"),
    acoustic_treatment: Optional[bool] = Query(None, description="Require acoustic treatment"),
    sort_by: Optional[str] = Query(None, description="Score (default), price_asc, price_desc, rating"),
):
    user = loader.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User '{user_id}' not found. Cannot generate recommendations.")

    studios = loader.get_studios()
    return engine.recommend_for_user(
        user=user,
        studios=studios,
        limit=limit,
        filter_city=city,
        filter_max_price=max_price,
        filter_min_capacity=min_capacity,
        filter_genre=genre,
        filter_video_recording=video_recording,
        filter_acoustic_treatment=acoustic_treatment,
        sort_by=sort_by,
    )

@router.get("/evaluation/summary", response_model=EvaluationSummary)
def get_evaluation_summary():
    return eval_service.get_evaluation_summary()
