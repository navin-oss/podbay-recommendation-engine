import pytest
from backend.app.services.data_loader import DataLoader
from backend.app.services.recommender import RecommendationEngine
from backend.app.schemas.studio import Studio
from backend.app.schemas.user import UserProfile, BookingRecord

@pytest.fixture
def loader():
    return DataLoader.get_instance()

@pytest.fixture
def engine():
    return RecommendationEngine()

def test_successful_recommendations(loader, engine):
    user = loader.get_user_by_id("U-001")
    studios = loader.get_studios()
    res = engine.recommend_for_user(user, studios, limit=5)

    assert res.user_id == "U-001"
    assert len(res.recommendations) == 5
    assert res.is_cold_start is False
    assert res.recommendations[0].rank == 1
    assert res.recommendations[0].score > 0

def test_ranking_and_score_bounds(loader, engine):
    studios = loader.get_studios()
    for user in loader.get_users():
        res = engine.recommend_for_user(user, studios, limit=5)
        prev_score = 100.0
        for item in res.recommendations:
            assert 0.0 <= item.score <= 100.0, f"Score {item.score} out of bounds for user {user.user_id}"
            assert item.score <= prev_score + 1e-5, "Recommendations must be sorted descending by score"
            prev_score = item.score

def test_inactive_studio_exclusion(loader, engine):
    studios = loader.get_studios()
    inactive_ids = {s.studio_id for s in studios if not s.active}
    assert len(inactive_ids) == 6, f"Expected 6 inactive studios, found {len(inactive_ids)}"

    for user in loader.get_users():
        res = engine.recommend_for_user(user, studios, limit=10)
        for item in res.recommendations:
            assert item.studio.active is True
            assert item.studio.studio_id not in inactive_ids, (
                f"Inactive studio {item.studio.studio_id} was returned for user {user.user_id}!"
            )

def test_cold_start_new_users(loader, engine):
    # U-003 and U-016 have zero past bookings
    for cold_user_id in ["U-003", "U-016"]:
        user = loader.get_user_by_id(cold_user_id)
        assert len(user.past_bookings) == 0
        res = engine.recommend_for_user(user, loader.get_studios(), limit=5)
        
        assert res.is_cold_start is True
        for item in res.recommendations:
            assert "Not personalized" in item.explanation or "Not personalized" in item.reasons[0]
            assert item.confidence == "Low"

def test_sparse_history_users(loader, engine):
    # U-004 has 1 booking
    user = loader.get_user_by_id("U-004")
    assert len(user.past_bookings) == 1
    res = engine.recommend_for_user(user, loader.get_studios(), limit=5)
    
    assert res.is_cold_start is False
    assert len(res.recommendations) == 5
    assert res.recommendations[0].score > 50

def test_contradictory_multi_city_history(loader, engine):
    # U-010 has bookings in Bengaluru, Pune, Mumbai
    user = loader.get_user_by_id("U-010")
    booked_cities = {b.studio_city for b in user.past_bookings if b.studio_city}
    assert len(booked_cities) > 1, f"Expected multiple cities, got {booked_cities}"
    assert user.last_active_city == "Bengaluru"

    res = engine.recommend_for_user(user, loader.get_studios(), limit=5)
    assert res.recommendations[0].studio.city == "Bengaluru"
    assert "Prioritized Bengaluru" in res.recommendations[0].explanation

def test_evidence_grounded_explanations(loader, engine):
    user = loader.get_user_by_id("U-001")
    res = engine.recommend_for_user(user, loader.get_studios(), limit=5)
    
    for item in res.recommendations:
        s = item.studio
        exp = item.explanation
        # If city mentioned, it must be the studio's actual city
        if "Located in" in exp:
            assert s.city in exp
        # If rating mentioned, it must match
        assert str(s.rating) in exp

def test_saved_studio_boost(loader, engine):
    user = loader.get_user_by_id("U-001")
    saved_ids = user.saved_studios
    res = engine.recommend_for_user(user, loader.get_studios(), limit=15)
    
    saved_in_results = [r for r in res.recommendations if r.studio.studio_id in saved_ids]
    for r in saved_in_results:
        assert r.score_breakdown.saved_studio == 20.0
        assert r.is_saved is True
        assert any("saved in your studio wishlist" in reason for reason in r.reasons)

def test_score_breakdown_consistency(loader, engine):
    user = loader.get_user_by_id("U-002")
    res = engine.recommend_for_user(user, loader.get_studios(), limit=5)
    
    for r in res.recommendations:
        bd = r.score_breakdown
        summed = round(
            bd.city_match + bd.genre_match + bd.saved_studio + 
            bd.amenities + bd.quality_rating + bd.popularity_reviews,
            1
        )
        assert abs(min(100.0, summed) - r.score) < 0.2

def test_query_filter_hard_constraints(loader, engine):
    user = loader.get_user_by_id("U-001")
    studios = loader.get_studios()
    
    # Filter by city
    res_delhi = engine.recommend_for_user(user, studios, limit=5, filter_city="Delhi")
    for r in res_delhi.recommendations:
        assert r.studio.city == "Delhi"

    # Filter by max price
    res_price = engine.recommend_for_user(user, studios, limit=5, filter_max_price=1000.0)
    for r in res_price.recommendations:
        assert r.studio.price_per_hour <= 1000.0

    # Filter by video recording
    res_video = engine.recommend_for_user(user, studios, limit=5, filter_video_recording=True)
    for r in res_video.recommendations:
        assert r.studio.video_recording is True

def test_missing_attributes_tolerance(engine):
    # Test tolerance for studio or user with missing non-essential fields
    sparse_studio = Studio(
        studio_id="TEST01",
        name="Minimal Studio",
        city="Mumbai",
        price_per_hour=800,
        capacity=2,
        genre_fit=[],
        equipment=[],
        acoustic_treatment=False,
        video_recording=False,
        rating=4.0,
        review_count=10,
        active=True,
    )
    sparse_user = UserProfile(
        user_id="U-TEST",
        display_name="Minimal User",
        profile_city=None,
        last_active_city=None,
        past_bookings=[],
        saved_studios=[],
        preferred_genres=[],
        is_cold_start=True,
    )
    res = engine.recommend_for_user(sparse_user, [sparse_studio], limit=1)
    assert len(res.recommendations) == 1
    assert res.recommendations[0].score >= 0.0
    assert res.is_cold_start is True
