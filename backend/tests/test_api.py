import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

@pytest.fixture
def client():
    return TestClient(app)

def test_api_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "ok"
    assert data["studios_count"] == 60
    assert data["users_count"] == 20

def test_dashboard_stats(client):
    res = client.get("/api/dashboard/stats")
    assert res.status_code == 200
    data = res.json()
    assert data["total_studios"] == 60
    assert data["active_studios"] == 54
    assert data["inactive_studios"] == 6
    assert data["total_users"] == 20
    assert data["users_cold_start"] == 2
    assert "engine_overview" in data
    assert data["engine_overview"]["max_possible_score"] == 100.0

def test_users_list_and_search(client):
    res = client.get("/api/users")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 20
    assert len(data["items"]) == 20

    # Search by display name
    res_search = client.get("/api/users?search=Interview")
    assert res_search.status_code == 200
    data_search = res_search.json()
    assert data_search["total"] > 0
    assert any("interview" in u["display_name"].lower() for u in data_search["items"])

def test_user_by_id(client):
    res = client.get("/api/users/U-001")
    assert res.status_code == 200
    data = res.json()
    assert data["user_id"] == "U-001"
    assert data["display_name"] == "Interview-first creator"

def test_unknown_user_404(client):
    res = client.get("/api/users/U-DOESNOTEXIST")
    assert res.status_code == 404
    assert "not found" in res.json()["detail"].lower()

def test_user_history(client):
    res = client.get("/api/users/U-001/history")
    assert res.status_code == 200
    data = res.json()
    assert data["user_id"] == "U-001"
    assert len(data["bookings"]) > 0
    assert len(data["saved_studios"]) > 0

def test_studios_list_and_filters(client):
    res = client.get("/api/studios?page_size=10")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 60
    assert len(data["items"]) == 10
    assert data["total_pages"] == 6

    # Filter by city
    res_city = client.get("/api/studios?city=Mumbai")
    assert res_city.status_code == 200
    assert all(st["city"] == "Mumbai" for st in res_city.json()["items"])

    # Filter active only
    res_active = client.get("/api/studios?active_only=true")
    assert res_active.status_code == 200
    assert all(st["active"] is True for st in res_active.json()["items"])

def test_studio_by_id(client):
    res = client.get("/api/studios/S001")
    assert res.status_code == 200
    data = res.json()
    assert data["studio_id"] == "S001"
    assert data["name"] == "Echo Room"

def test_unknown_studio_404(client):
    res = client.get("/api/studios/S9999")
    assert res.status_code == 404

def test_recommendations_endpoint(client):
    res = client.get("/api/recommendations/U-001?limit=5")
    assert res.status_code == 200
    data = res.json()
    assert data["user_id"] == "U-001"
    assert len(data["recommendations"]) == 5
    assert data["is_cold_start"] is False

    top = data["recommendations"][0]
    assert 0 <= top["score"] <= 100
    assert "score_breakdown" in top
    assert top["rank"] == 1

def test_recommendations_unknown_user_404(client):
    res = client.get("/api/recommendations/U-UNKNOWN")
    assert res.status_code == 404

def test_evaluation_summary_endpoint(client):
    res = client.get("/api/evaluation/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_users_evaluated"] == 20
    assert data["inactive_in_recommendations"] == 0
    assert data["integrity_checks"]["all_inactive_studios_excluded"] is True
    assert data["integrity_checks"]["cold_start_properly_handled"] is True
    assert len(data["user_benchmarks"]) == 20
