from collections import Counter
from typing import List, Optional, Dict, Any, Tuple
from backend.app.schemas.studio import Studio
from backend.app.schemas.user import UserProfile
from backend.app.schemas.recommendation import (
    ScoreBreakdown,
    RecommendationItem,
    RecommendationResponse,
)

class RecommendationEngine:
    def __init__(self):
        pass

    def recommend_for_user(
        self,
        user: UserProfile,
        studios: List[Studio],
        limit: int = 5,
        filter_city: Optional[str] = None,
        filter_max_price: Optional[float] = None,
        filter_min_capacity: Optional[int] = None,
        filter_genre: Optional[str] = None,
        filter_video_recording: Optional[bool] = None,
        filter_acoustic_treatment: Optional[bool] = None,
        sort_by: Optional[str] = None,  # "score", "price_asc", "price_desc", "rating"
    ) -> RecommendationResponse:
        """
        Generate explainable, grounded recommendations for a user.
        Excludes inactive studios and enforces hard constraints before scoring.
        """
        # Hard constraint 1: Strictly active studios only
        active_studios = [s for s in studios if s.active]

        # Apply user query filters
        candidates = active_studios
        if filter_city:
            candidates = [s for s in candidates if s.city.lower() == filter_city.lower()]
        if filter_max_price is not None:
            candidates = [s for s in candidates if s.price_per_hour <= filter_max_price]
        if filter_min_capacity is not None:
            candidates = [s for s in candidates if s.capacity >= filter_min_capacity]
        if filter_genre:
            candidates = [
                s for s in candidates
                if any(filter_genre.lower() in g.lower() for g in s.genre_fit)
            ]
        if filter_video_recording is not None and filter_video_recording:
            candidates = [s for s in candidates if s.video_recording]
        if filter_acoustic_treatment is not None and filter_acoustic_treatment:
            candidates = [s for s in candidates if s.acoustic_treatment]

        # Check cold-start condition
        bookings = user.past_bookings
        saved_ids = set(user.saved_studios)
        has_history = len(bookings) > 0 or len(saved_ids) > 0

        if not has_history:
            return self._handle_cold_start(user, candidates, limit, sort_by)

        return self._handle_personalized(user, candidates, limit, sort_by)

    def _handle_cold_start(
        self,
        user: UserProfile,
        candidates: List[Studio],
        limit: int,
        sort_by: Optional[str],
    ) -> RecommendationResponse:
        preferred_city = user.last_active_city or user.profile_city
        preferred_genres = set(user.preferred_genres or [])

        scored_items: List[RecommendationItem] = []

        for studio in candidates:
            city_score = 0.0
            if preferred_city and studio.city.lower() == preferred_city.lower():
                city_score = 35.0

            genre_score = 0.0
            overlap_genres = []
            if preferred_genres:
                overlap = preferred_genres.intersection(set(studio.genre_fit))
                if overlap:
                    genre_score = 25.0 * (len(overlap) / len(preferred_genres))
                    overlap_genres = sorted(list(overlap))

            # Quality and popularity signals
            quality_score = (studio.rating / 5.0) * 25.0
            popularity_score = (min(studio.review_count, 150) / 150.0) * 15.0

            total_score = round(min(100.0, city_score + genre_score + quality_score + popularity_score), 1)

            breakdown = ScoreBreakdown(
                city_match=round(city_score, 1),
                genre_match=round(genre_score, 1),
                saved_studio=0.0,
                amenities=0.0,
                quality_rating=round(quality_score, 1),
                popularity_reviews=round(popularity_score, 1),
                total=total_score,
            )

            reasons = ["Not personalized — insufficient user history."]
            if city_score > 0:
                reasons.append(f"Located in your designated city ({studio.city}).")
            if overlap_genres:
                reasons.append(f"Supports preferred genre(s): {', '.join(overlap_genres)}.")
            reasons.append(f"Top-rated studio ({studio.rating}/5.0 from {studio.review_count} reviews).")

            explanation = " ".join(reasons)

            scored_items.append(
                RecommendationItem(
                    rank=0,
                    studio=studio,
                    score=total_score,
                    score_breakdown=breakdown,
                    explanation=explanation,
                    reasons=reasons,
                    is_saved=False,
                    confidence="Low",
                    confidence_score=0.40,
                )
            )

        # Sort
        scored_items = self._apply_sorting(scored_items, sort_by)

        for idx, item in enumerate(scored_items[:limit], 1):
            item.rank = idx

        return RecommendationResponse(
            user_id=user.user_id,
            user_display_name=user.display_name,
            last_active_city=preferred_city,
            is_cold_start=True,
            explanation_summary="Recommendations for this new profile are based on city alignment and high verified community ratings, as no prior bookings exist.",
            total_candidates=len(candidates),
            recommendations=scored_items[:limit],
        )

    def _handle_personalized(
        self,
        user: UserProfile,
        candidates: List[Studio],
        limit: int,
        sort_by: Optional[str],
    ) -> RecommendationResponse:
        bookings = user.past_bookings
        saved_set = set(user.saved_studios)
        preferred_city = user.last_active_city or user.profile_city

        # Analyze booking distribution
        booking_genres = Counter(b.genre for b in bookings if b.genre)
        total_booking_genres = sum(booking_genres.values())

        # Check explicit preferred genres
        explicit_genres = Counter({g: 2 for g in user.preferred_genres})
        combined_genres = booking_genres + explicit_genres
        total_genre_weight = max(1, sum(combined_genres.values()))

        # Check multi-city booking history
        past_booked_cities = Counter()
        for b in bookings:
            if b.studio_city:
                past_booked_cities[b.studio_city] += 1

        is_multi_city = len(past_booked_cities) > 1
        is_sparse = len(bookings) == 1

        # Calculate confidence
        confidence_label = "High"
        confidence_val = 0.90
        if is_multi_city or len(booking_genres) >= 3:
            confidence_label = "Moderate"
            confidence_val = 0.75
        if is_sparse and not saved_set:
            confidence_label = "Moderate"
            confidence_val = 0.65

        scored_items: List[RecommendationItem] = []

        for studio in candidates:
            reasons = []
            
            # 1. City Proximity (Max 25 pts)
            city_score = 0.0
            if preferred_city and studio.city.lower() == preferred_city.lower():
                city_score = 25.0
                reasons.append(f"Located in {studio.city}, your recent active city")
            elif studio.city in past_booked_cities:
                city_score = 12.0
                reasons.append(f"Located in {studio.city}, where you booked previously")

            # 2. Genre Alignment (Max 30 pts)
            genre_score = 0.0
            matched_genres = []
            studio_genres = set(studio.genre_fit)
            overlap = studio_genres.intersection(set(combined_genres.keys()))
            if overlap:
                overlap_weight = sum(combined_genres[g] for g in overlap)
                genre_score = 30.0 * (overlap_weight / total_genre_weight)
                matched_genres = sorted(list(overlap))
                reasons.append(f"matches your frequent formats: {', '.join(matched_genres)}")

            # 3. Saved Studio Intent (Max 20 pts)
            saved_score = 0.0
            is_saved = studio.studio_id in saved_set
            if is_saved:
                saved_score = 20.0
                reasons.append("saved in your studio wishlist")

            # 4. Amenities & Production Fit (Max 10 pts)
            amenities_score = 0.0
            amenities_notes = []
            if studio.acoustic_treatment:
                amenities_score += 5.0
                amenities_notes.append("acoustic treatment")
            if studio.video_recording:
                amenities_score += 5.0
                amenities_notes.append("video recording")
            if amenities_notes:
                reasons.append(f"features professional {' and '.join(amenities_notes)}")

            # 5. Quality Rating (Max 10 pts)
            rating_score = (studio.rating / 5.0) * 10.0

            # 6. Popularity & Reviews (Max 5 pts)
            popularity_score = (min(studio.review_count, 150) / 150.0) * 5.0
            reasons.append(f"rated {studio.rating}/5.0 ({studio.review_count} reviews)")

            total_score = round(
                min(
                    100.0,
                    city_score + genre_score + saved_score + amenities_score + rating_score + popularity_score,
                ),
                1,
            )

            breakdown = ScoreBreakdown(
                city_match=round(city_score, 1),
                genre_match=round(genre_score, 1),
                saved_studio=round(saved_score, 1),
                amenities=round(amenities_score, 1),
                quality_rating=round(rating_score, 1),
                popularity_reviews=round(popularity_score, 1),
                total=total_score,
            )

            explanation = "Recommended because it is " + "; ".join(reasons) + "."
            if is_multi_city and city_score == 25.0:
                explanation += f" (Prioritized {preferred_city} based on your latest activity despite multi-city history)."

            scored_items.append(
                RecommendationItem(
                    rank=0,
                    studio=studio,
                    score=total_score,
                    score_breakdown=breakdown,
                    explanation=explanation,
                    reasons=reasons,
                    is_saved=is_saved,
                    confidence=confidence_label,
                    confidence_score=confidence_val,
                )
            )

        # Apply sorting
        scored_items = self._apply_sorting(scored_items, sort_by)

        for idx, item in enumerate(scored_items[:limit], 1):
            item.rank = idx

        summary = f"Personalized ranking generated from {len(bookings)} past booking(s) and {len(saved_set)} saved venue(s)."
        if is_multi_city:
            summary += " Multi-city activity was resolved in favor of the latest active city."

        return RecommendationResponse(
            user_id=user.user_id,
            user_display_name=user.display_name,
            last_active_city=preferred_city,
            is_cold_start=False,
            explanation_summary=summary,
            total_candidates=len(candidates),
            recommendations=scored_items[:limit],
        )

    def _apply_sorting(
        self, items: List[RecommendationItem], sort_by: Optional[str]
    ) -> List[RecommendationItem]:
        if sort_by == "price_asc":
            return sorted(items, key=lambda x: (x.studio.price_per_hour, -x.score))
        elif sort_by == "price_desc":
            return sorted(items, key=lambda x: (-x.studio.price_per_hour, -x.score))
        elif sort_by == "rating":
            return sorted(items, key=lambda x: (-x.studio.rating, -x.studio.review_count, -x.score))
        else:
            # Default: by score descending, then rating descending, then reviews descending
            return sorted(items, key=lambda x: (-x.score, -x.studio.rating, -x.studio.review_count))


# Provide singleton helper and backward-compatible function
engine = RecommendationEngine()

def get_recommendations_for_user(
    user: UserProfile,
    studios: List[Studio],
    limit: int = 5,
    **kwargs,
) -> RecommendationResponse:
    return engine.recommend_for_user(user, studios, limit=limit, **kwargs)

def recommend(user: dict, studios: list, top_n: int = 5) -> list:
    """
    Backward-compatible function matching starter signature:
    recommend(user: dict, studios: list, top_n=5) -> list of dicts:
    [{"studio": s, "score": 92.5, "explanation": "..."}]
    """
    from backend.app.schemas.user import UserProfile, BookingRecord
    from backend.app.schemas.studio import Studio

    parsed_studios = [Studio(**s) if isinstance(s, dict) else s for s in studios]
    studio_dict = {s.studio_id: s for s in parsed_studios}

    bookings = []
    for b in user.get("past_bookings", []):
        st = studio_dict.get(b.get("studio_id"))
        bookings.append(
            BookingRecord(
                studio_id=b["studio_id"],
                date=b["date"],
                genre=b["genre"],
                studio_name=st.name if st else None,
                studio_city=st.city if st else None,
                studio_price=st.price_per_hour if st else None,
            )
        )

    u_profile = UserProfile(
        user_id=user.get("user_id", "unknown"),
        display_name=user.get("display_name", user.get("name", "User")),
        profile_city=user.get("profile_city"),
        last_active_city=user.get("last_active_city"),
        past_bookings=bookings,
        saved_studios=user.get("saved_studios", []),
        preferred_genres=user.get("preferred_genres", []),
        is_cold_start=len(bookings) == 0,
        booking_count=len(bookings),
        saved_count=len(user.get("saved_studios", [])),
    )

    resp = engine.recommend_for_user(u_profile, parsed_studios, limit=top_n)
    return [
        {
            "studio": item.studio.model_dump(),
            "score": item.score,
            "explanation": item.explanation,
            "breakdown": item.score_breakdown.model_dump(),
        }
        for item in resp.recommendations
    ]
