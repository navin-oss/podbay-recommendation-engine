# PodBay Comprehensive Test Log & Evaluation Report

**Date:** 2026-10-15  
**Environment:** Local Windows PowerShell, Python 3.13, FastAPI, React 19, Vite  
**Pytest Test Suite:** 23 Passed, 0 Failed, 0 Warnings  

---

## Executive Summary
- **Total Studios in Dataset:** 60 (54 Active, 6 Inactive)
- **Total Creator Profiles Evaluated:** 20
- **Inactive Studio Exclusion Rate:** 100% (0 inactive studios appeared in any recommendation)
- **Cold-Start Profiles Handled:** 2 (U-003, U-016) with transparent popularity and rating fallback
- **Multi-City Resolution:** U-010 resolved in favor of primary recent active city (Bengaluru)
- **Average Top-1 Recommendation Score:** 84.8 / 100

---

## Automated Pytest Suite Results
```text
============================= test session starts =============================
platform win32 -- Python 3.13.13, pytest-9.1.1, pluggy-1.6.0
rootdir: D:\podbay_recommendation_engine_starter
configfile: pytest.ini
collected 23 items

backend/tests/test_api.py::test_api_health PASSED                        [  4%]
backend/tests/test_api.py::test_dashboard_stats PASSED                   [  8%]
backend/tests/test_api.py::test_users_list_and_search PASSED             [ 13%]
backend/tests/test_api.py::test_user_by_id PASSED                        [ 17%]
backend/tests/test_api.py::test_unknown_user_404 PASSED                  [ 21%]
backend/tests/test_api.py::test_user_history PASSED                      [ 26%]
backend/tests/test_api.py::test_studios_list_and_filters PASSED          [ 30%]
backend/tests/test_api.py::test_studio_by_id PASSED                      [ 34%]
backend/tests/test_api.py::test_unknown_studio_404 PASSED                [ 39%]
backend/tests/test_api.py::test_recommendations_endpoint PASSED          [ 43%]
backend/tests/test_api.py::test_recommendations_unknown_user_404 PASSED  [ 47%]
backend/tests/test_api.py::test_evaluation_summary_endpoint PASSED       [ 52%]
backend/tests/test_recommender.py::test_successful_recommendations PASSED [ 56%]
backend/tests/test_recommender.py::test_ranking_and_score_bounds PASSED  [ 60%]
backend/tests/test_recommender.py::test_inactive_studio_exclusion PASSED [ 65%]
backend/tests/test_recommender.py::test_cold_start_new_users PASSED      [ 69%]
backend/tests/test_recommender.py::test_sparse_history_users PASSED      [ 73%]
backend/tests/test_recommender.py::test_contradictory_multi_city_history PASSED [ 78%]
backend/tests/test_recommender.py::test_evidence_grounded_explanations PASSED [ 82%]
backend/tests/test_recommender.py::test_saved_studio_boost PASSED        [ 86%]
backend/tests/test_recommender.py::test_score_breakdown_consistency PASSED [ 91%]
backend/tests/test_recommender.py::test_query_filter_hard_constraints PASSED [ 95%]
backend/tests/test_recommender.py::test_missing_attributes_tolerance PASSED [100%]
============================= 23 passed in 0.38s ==============================
```

---

## Per-User Recommendation Audit (All 20 Users)

### User U-001: Interview-first creator
- **Last Active City:** Mumbai
- **Past Bookings:** 2 | **Saved Studios:** 2
- **Preferred Genres:** interview
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 2 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S009 | TalkSpace | Mumbai | **74.4/100** | ⭐ 4.8 | ₹1300.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: interview; features professional acoustic treatment; rated 4.8/5.0 (143 reviews). |
| #2 | S001 | Echo Room | Bengaluru | **73.8/100** | ⭐ 4.8 | ₹1200.0/hr | Recommended because it is matches your frequent formats: interview; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.8/5.0 (126 reviews). |
| #3 | S003 | FrameCast Studio | Bengaluru | **72.4/100** | ⭐ 4.7 | ₹1500.0/hr | Recommended because it is matches your frequent formats: interview; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.7/5.0 (91 reviews). |
| #4 | S060 | Mumbai Podcast Studio 60 | Mumbai | **70.4/100** | ⭐ 3.8 | ₹1800.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: interview; features professional video recording; rated 3.8/5.0 (83 reviews). |
| #5 | S017 | Podcast Corner | Mumbai | **64.6/100** | ⭐ 4.2 | ₹800.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: interview; rated 4.2/5.0 (37 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Mumbai), format fit (interview), and studio quality metrics (4.8⭐).

---

### User U-002: Video podcast creator
- **Last Active City:** Bengaluru
- **Past Bookings:** 7 | **Saved Studios:** 2
- **Preferred Genres:** interview, video
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 7 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S001 | Echo Room | Bengaluru | **78.8/100** | ⭐ 4.8 | ₹1200.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: interview, video; features professional acoustic treatment and video recording; rated 4.8/5.0 (126 reviews). |
| #2 | S018 | Studio Orbit | Bengaluru | **78.5/100** | ⭐ 4.9 | ₹2000.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: interview, video; features professional acoustic treatment and video recording; rated 4.9/5.0 (111 reviews). |
| #3 | S003 | FrameCast Studio | Bengaluru | **77.4/100** | ⭐ 4.7 | ₹1500.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: interview, video; features professional acoustic treatment and video recording; rated 4.7/5.0 (91 reviews). |
| #4 | S006 | PodWorks | Pune | **72.0/100** | ⭐ 4.7 | ₹1100.0/hr | Recommended because it is matches your frequent formats: interview, video; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.7/5.0 (77 reviews). |
| #5 | S043 | Bengaluru Podcast Studio 43 | Bengaluru | **59.1/100** | ⭐ 4.9 | ₹1800.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.9/5.0 (20 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Bengaluru), format fit (interview, video), and studio quality metrics (4.8⭐).

---

### User U-003: New creator
- **Last Active City:** Delhi
- **Past Bookings:** 0 | **Saved Studios:** 0
- **Preferred Genres:** None
- **Cold Start Status:** YES (Unpersonalized Fallback)
- **Summary:** Recommendations for this new profile are based on city alignment and high verified community ratings, as no prior bookings exist.

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S054 | Delhi Podcast Studio 54 | Delhi | **73.0/100** | ⭐ 4.6 | ₹1400.0/hr | Not personalized — insufficient user history. Located in your designated city (Delhi). Top-rated studio (4.6/5.0 from 164 reviews). |
| #2 | S007 | The Sound Loft | Delhi | **68.2/100** | ⭐ 4.6 | ₹1600.0/hr | Not personalized — insufficient user history. Located in your designated city (Delhi). Top-rated studio (4.6/5.0 from 102 reviews). |
| #3 | S020 | UrbanPod | Delhi | **66.8/100** | ⭐ 4.6 | ₹1250.0/hr | Not personalized — insufficient user history. Located in your designated city (Delhi). Top-rated studio (4.6/5.0 from 88 reviews). |
| #4 | S010 | CinemaPod | Delhi | **65.3/100** | ⭐ 4.9 | ₹2200.0/hr | Not personalized — insufficient user history. Located in your designated city (Delhi). Top-rated studio (4.9/5.0 from 58 reviews). |
| #5 | S012 | Studio North | Delhi | **61.4/100** | ⭐ 4.3 | ₹1000.0/hr | Not personalized — insufficient user history. Located in your designated city (Delhi). Top-rated studio (4.3/5.0 from 49 reviews). |

**Recommendation Quality Assessment:** Makes sense: Cold-start user with 0 bookings is recommended high-rated studios in Delhi (Delhi Podcast Studio 54) based on rating and reviews without making false claims about past usage.

---

### User U-004: Solo audio creator
- **Last Active City:** Pune
- **Past Bookings:** 1 | **Saved Studios:** 1
- **Preferred Genres:** solo voiceover
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 1 past booking(s) and 1 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S041 | Pune Podcast Studio 41 | Pune | **73.2/100** | ⭐ 4.2 | ₹1600.0/hr | Recommended because it is Located in Pune, your recent active city; matches your frequent formats: solo voiceover; features professional acoustic treatment; rated 4.2/5.0 (143 reviews). |
| #2 | S005 | QuietTake | Pune | **70.2/100** | ⭐ 4.4 | ₹700.0/hr | Recommended because it is Located in Pune, your recent active city; matches your frequent formats: solo voiceover; features professional acoustic treatment; rated 4.4/5.0 (42 reviews). |
| #3 | S002 | VoiceCraft Studio | Bengaluru | **67.0/100** | ⭐ 4.6 | ₹900.0/hr | Recommended because it is matches your frequent formats: solo voiceover; saved in your studio wishlist; features professional acoustic treatment; rated 4.6/5.0 (83 reviews). |
| #4 | S054 | Delhi Podcast Studio 54 | Delhi | **54.2/100** | ⭐ 4.6 | ₹1400.0/hr | Recommended because it is matches your frequent formats: solo voiceover; features professional acoustic treatment and video recording; rated 4.6/5.0 (164 reviews). |
| #5 | S045 | Mumbai Podcast Studio 45 | Mumbai | **53.6/100** | ⭐ 4.9 | ₹1200.0/hr | Recommended because it is matches your frequent formats: solo voiceover; features professional acoustic treatment and video recording; rated 4.9/5.0 (115 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Pune), format fit (solo voiceover), and studio quality metrics (4.2⭐).

---

### User U-005: Music podcast creator
- **Last Active City:** Hyderabad
- **Past Bookings:** 3 | **Saved Studios:** 1
- **Preferred Genres:** music
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 3 past booking(s) and 1 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S037 | Hyderabad Podcast Studio 37 | Hyderabad | **70.7/100** | ⭐ 4.0 | ₹2200.0/hr | Recommended because it is Located in Hyderabad, your recent active city; matches your frequent formats: music; features professional acoustic treatment; rated 4.0/5.0 (80 reviews). |
| #2 | S007 | The Sound Loft | Delhi | **67.6/100** | ⭐ 4.6 | ₹1600.0/hr | Recommended because it is matches your frequent formats: music; saved in your studio wishlist; features professional acoustic treatment; rated 4.6/5.0 (102 reviews). |
| #3 | S018 | Studio Orbit | Bengaluru | **53.5/100** | ⭐ 4.9 | ₹2000.0/hr | Recommended because it is matches your frequent formats: music; features professional acoustic treatment and video recording; rated 4.9/5.0 (111 reviews). |
| #4 | S025 | GrandCast | Pune | **53.0/100** | ⭐ 4.9 | ₹2400.0/hr | Recommended because it is matches your frequent formats: music; features professional acoustic treatment and video recording; rated 4.9/5.0 (96 reviews). |
| #5 | S035 | Chennai Podcast Studio 35 | Chennai | **52.7/100** | ⭐ 4.1 | ₹1800.0/hr | Recommended because it is matches your frequent formats: music; features professional acoustic treatment and video recording; rated 4.1/5.0 (135 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Hyderabad), format fit (music, roundtable), and studio quality metrics (4.0⭐).

---

### User U-006: Multi-genre creator
- **Last Active City:** Chennai
- **Past Bookings:** 7 | **Saved Studios:** 2
- **Preferred Genres:** interview, music, video
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 7 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S023 | OpenFrame Studio | Chennai | **67.4/100** | ⭐ 4.7 | ₹1600.0/hr | Recommended because it is Located in Chennai, your recent active city; matches your frequent formats: interview, video; features professional acoustic treatment and video recording; rated 4.7/5.0 (66 reviews). |
| #2 | S050 | Chennai Podcast Studio 50 | Chennai | **66.1/100** | ⭐ 3.8 | ₹750.0/hr | Recommended because it is Located in Chennai, your recent active city; matches your frequent formats: music, video; features professional acoustic treatment and video recording; rated 3.8/5.0 (153 reviews). |
| #3 | S016 | LiveTake | Chennai | **65.1/100** | ⭐ 4.6 | ₹1400.0/hr | Recommended because it is Located in Chennai, your recent active city; matches your frequent formats: music, video; features professional acoustic treatment and video recording; rated 4.6/5.0 (72 reviews). |
| #4 | S010 | CinemaPod | Delhi | **62.5/100** | ⭐ 4.9 | ₹2200.0/hr | Recommended because it is matches your frequent formats: interview, video; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.9/5.0 (58 reviews). |
| #5 | S035 | Chennai Podcast Studio 35 | Chennai | **56.9/100** | ⭐ 4.1 | ₹1800.0/hr | Recommended because it is Located in Chennai, your recent active city; matches your frequent formats: music; features professional acoustic treatment and video recording; rated 4.1/5.0 (135 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Chennai), format fit (interview, video), and studio quality metrics (4.7⭐).

---

### User U-007: Budget-conscious creator
- **Last Active City:** Pune
- **Past Bookings:** 2 | **Saved Studios:** 2
- **Preferred Genres:** interview, solo voiceover
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 2 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S005 | QuietTake | Pune | **70.2/100** | ⭐ 4.4 | ₹700.0/hr | Recommended because it is Located in Pune, your recent active city; matches your frequent formats: interview, solo voiceover; features professional acoustic treatment; rated 4.4/5.0 (42 reviews). |
| #2 | S002 | VoiceCraft Studio | Bengaluru | **67.0/100** | ⭐ 4.6 | ₹900.0/hr | Recommended because it is matches your frequent formats: interview, solo voiceover; saved in your studio wishlist; features professional acoustic treatment; rated 4.6/5.0 (83 reviews). |
| #3 | S025 | GrandCast | Pune | **63.0/100** | ⭐ 4.9 | ₹2400.0/hr | Recommended because it is Located in Pune, your recent active city; matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.9/5.0 (96 reviews). |
| #4 | S014 | PixelPod | Pune | **62.4/100** | ⭐ 4.8 | ₹1700.0/hr | Recommended because it is Located in Pune, your recent active city; matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.8/5.0 (85 reviews). |
| #5 | S006 | PodWorks | Pune | **62.0/100** | ⭐ 4.7 | ₹1100.0/hr | Recommended because it is Located in Pune, your recent active city; matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.7/5.0 (77 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Pune), format fit (interview, solo voiceover), and studio quality metrics (4.4⭐).

---

### User U-008: High-production video creator
- **Last Active City:** Mumbai
- **Past Bookings:** 3 | **Saved Studios:** 2
- **Preferred Genres:** video
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 3 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S045 | Mumbai Podcast Studio 45 | Mumbai | **78.6/100** | ⭐ 4.9 | ₹1200.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: video; features professional acoustic treatment and video recording; rated 4.9/5.0 (115 reviews). |
| #2 | S004 | BeatHouse | Mumbai | **76.1/100** | ⭐ 4.5 | ₹1800.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: video; features professional acoustic treatment and video recording; rated 4.5/5.0 (64 reviews). |
| #3 | S030 | Mumbai Podcast Studio 30 | Mumbai | **73.5/100** | ⭐ 4.0 | ₹1600.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: video; features professional acoustic treatment and video recording; rated 4.0/5.0 (16 reviews). |
| #4 | S003 | FrameCast Studio | Bengaluru | **72.4/100** | ⭐ 4.7 | ₹1500.0/hr | Recommended because it is matches your frequent formats: video; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.7/5.0 (91 reviews). |
| #5 | S054 | Delhi Podcast Studio 54 | Delhi | **54.2/100** | ⭐ 4.6 | ₹1400.0/hr | Recommended because it is matches your frequent formats: video; features professional acoustic treatment and video recording; rated 4.6/5.0 (164 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Mumbai), format fit (roundtable, solo voiceover, video), and studio quality metrics (4.9⭐).

---

### User U-009: Returning creator
- **Last Active City:** Delhi
- **Past Bookings:** 1 | **Saved Studios:** 2
- **Preferred Genres:** interview
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 1 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S020 | UrbanPod | Delhi | **77.1/100** | ⭐ 4.6 | ₹1250.0/hr | Recommended because it is Located in Delhi, your recent active city; matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.6/5.0 (88 reviews). |
| #2 | S010 | CinemaPod | Delhi | **76.7/100** | ⭐ 4.9 | ₹2200.0/hr | Recommended because it is Located in Delhi, your recent active city; matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.9/5.0 (58 reviews). |
| #3 | S007 | The Sound Loft | Delhi | **72.6/100** | ⭐ 4.6 | ₹1600.0/hr | Recommended because it is Located in Delhi, your recent active city; matches your frequent formats: interview; features professional acoustic treatment; rated 4.6/5.0 (102 reviews). |
| #4 | S006 | PodWorks | Pune | **72.0/100** | ⭐ 4.7 | ₹1100.0/hr | Recommended because it is matches your frequent formats: interview; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.7/5.0 (77 reviews). |
| #5 | S012 | Studio North | Delhi | **70.2/100** | ⭐ 4.3 | ₹1000.0/hr | Recommended because it is Located in Delhi, your recent active city; matches your frequent formats: interview; features professional acoustic treatment; rated 4.3/5.0 (49 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Delhi), format fit (interview, video), and studio quality metrics (4.6⭐).

---

### User U-010: Contradictory-history creator
- **Last Active City:** Bengaluru
- **Past Bookings:** 3 | **Saved Studios:** 2
- **Preferred Genres:** music, solo voiceover, video
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 3 past booking(s) and 2 saved venue(s). Multi-city activity was resolved in favor of the latest active city.

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S001 | Echo Room | Bengaluru | **78.8/100** | ⭐ 4.8 | ₹1200.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: video; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.8/5.0 (126 reviews). (Prioritized Bengaluru based on your latest activity despite multi-city history). |
| #2 | S018 | Studio Orbit | Bengaluru | **68.5/100** | ⭐ 4.9 | ₹2000.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: music, video; features professional acoustic treatment and video recording; rated 4.9/5.0 (111 reviews). (Prioritized Bengaluru based on your latest activity despite multi-city history). |
| #3 | S003 | FrameCast Studio | Bengaluru | **57.4/100** | ⭐ 4.7 | ₹1500.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: video; features professional acoustic treatment and video recording; rated 4.7/5.0 (91 reviews). (Prioritized Bengaluru based on your latest activity despite multi-city history). |
| #4 | S045 | Mumbai Podcast Studio 45 | Mumbai | **55.6/100** | ⭐ 4.9 | ₹1200.0/hr | Recommended because it is Located in Mumbai, where you booked previously; matches your frequent formats: solo voiceover, video; features professional acoustic treatment and video recording; rated 4.9/5.0 (115 reviews). |
| #5 | S025 | GrandCast | Pune | **55.0/100** | ⭐ 4.9 | ₹2400.0/hr | Recommended because it is Located in Pune, where you booked previously; matches your frequent formats: music, video; features professional acoustic treatment and video recording; rated 4.9/5.0 (96 reviews). |

**Recommendation Quality Assessment:** Makes sense: User has past bookings in Mumbai, Pune, and Bengaluru. The algorithm properly prioritized their recent active city (Bengaluru), matching Echo Room with confidence labeled Moderate.

---

### User U-011: Frequent interviewer
- **Last Active City:** Mumbai
- **Past Bookings:** 4 | **Saved Studios:** 3
- **Preferred Genres:** interview
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 4 past booking(s) and 3 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S009 | TalkSpace | Mumbai | **94.4/100** | ⭐ 4.8 | ₹1300.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: interview; saved in your studio wishlist; features professional acoustic treatment; rated 4.8/5.0 (143 reviews). |
| #2 | S001 | Echo Room | Bengaluru | **73.8/100** | ⭐ 4.8 | ₹1200.0/hr | Recommended because it is matches your frequent formats: interview; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.8/5.0 (126 reviews). |
| #3 | S003 | FrameCast Studio | Bengaluru | **72.4/100** | ⭐ 4.7 | ₹1500.0/hr | Recommended because it is matches your frequent formats: interview; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.7/5.0 (91 reviews). |
| #4 | S060 | Mumbai Podcast Studio 60 | Mumbai | **70.4/100** | ⭐ 3.8 | ₹1800.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: interview; features professional video recording; rated 3.8/5.0 (83 reviews). |
| #5 | S017 | Podcast Corner | Mumbai | **64.6/100** | ⭐ 4.2 | ₹800.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: interview; rated 4.2/5.0 (37 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Mumbai), format fit (interview), and studio quality metrics (4.8⭐).

---

### User U-012: Regional-language creator
- **Last Active City:** Hyderabad
- **Past Bookings:** 7 | **Saved Studios:** 2
- **Preferred Genres:** interview, solo voiceover
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 7 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S015 | MicDrop Studio | Hyderabad | **70.8/100** | ⭐ 4.5 | ₹950.0/hr | Recommended because it is Located in Hyderabad, your recent active city; matches your frequent formats: interview, solo voiceover; features professional acoustic treatment; rated 4.5/5.0 (53 reviews). |
| #2 | S008 | SoloSignal | Hyderabad | **68.0/100** | ⭐ 4.2 | ₹650.0/hr | Recommended because it is Located in Hyderabad, your recent active city; matches your frequent formats: solo voiceover; saved in your studio wishlist; rated 4.2/5.0 (28 reviews). |
| #3 | S002 | VoiceCraft Studio | Bengaluru | **67.0/100** | ⭐ 4.6 | ₹900.0/hr | Recommended because it is matches your frequent formats: interview, solo voiceover; saved in your studio wishlist; features professional acoustic treatment; rated 4.6/5.0 (83 reviews). |
| #4 | S052 | Hyderabad Podcast Studio 52 | Hyderabad | **58.2/100** | ⭐ 4.8 | ₹2200.0/hr | Recommended because it is Located in Hyderabad, your recent active city; matches your frequent formats: interview; features professional video recording; rated 4.8/5.0 (68 reviews). |
| #5 | S040 | Lucknow Podcast Studio 40 | Lucknow | **48.0/100** | ⭐ 4.0 | ₹1800.0/hr | Recommended because it is matches your frequent formats: interview, solo voiceover; features professional acoustic treatment; rated 4.0/5.0 (199 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Hyderabad), format fit (interview, solo voiceover), and studio quality metrics (4.5⭐).

---

### User U-013: Travel podcast creator
- **Last Active City:** Delhi
- **Past Bookings:** 3 | **Saved Studios:** 2
- **Preferred Genres:** interview, video
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 3 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S020 | UrbanPod | Delhi | **77.1/100** | ⭐ 4.6 | ₹1250.0/hr | Recommended because it is Located in Delhi, your recent active city; matches your frequent formats: interview, video; features professional acoustic treatment and video recording; rated 4.6/5.0 (88 reviews). |
| #2 | S010 | CinemaPod | Delhi | **76.7/100** | ⭐ 4.9 | ₹2200.0/hr | Recommended because it is Located in Delhi, your recent active city; matches your frequent formats: interview, video; features professional acoustic treatment and video recording; rated 4.9/5.0 (58 reviews). |
| #3 | S006 | PodWorks | Pune | **72.0/100** | ⭐ 4.7 | ₹1100.0/hr | Recommended because it is matches your frequent formats: interview, video; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.7/5.0 (77 reviews). |
| #4 | S054 | Delhi Podcast Studio 54 | Delhi | **62.1/100** | ⭐ 4.6 | ₹1400.0/hr | Recommended because it is Located in Delhi, your recent active city; matches your frequent formats: video; features professional acoustic treatment and video recording; rated 4.6/5.0 (164 reviews). |
| #5 | S007 | The Sound Loft | Delhi | **59.7/100** | ⭐ 4.6 | ₹1600.0/hr | Recommended because it is Located in Delhi, your recent active city; matches your frequent formats: interview; features professional acoustic treatment; rated 4.6/5.0 (102 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Delhi), format fit (interview, video), and studio quality metrics (4.6⭐).

---

### User U-014: Independent creator
- **Last Active City:** Kolkata
- **Past Bookings:** 1 | **Saved Studios:** 1
- **Preferred Genres:** solo voiceover
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 1 past booking(s) and 1 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S002 | VoiceCraft Studio | Bengaluru | **67.0/100** | ⭐ 4.6 | ₹900.0/hr | Recommended because it is matches your frequent formats: solo voiceover; saved in your studio wishlist; features professional acoustic treatment; rated 4.6/5.0 (83 reviews). |
| #2 | S054 | Delhi Podcast Studio 54 | Delhi | **54.2/100** | ⭐ 4.6 | ₹1400.0/hr | Recommended because it is matches your frequent formats: solo voiceover; features professional acoustic treatment and video recording; rated 4.6/5.0 (164 reviews). |
| #3 | S045 | Mumbai Podcast Studio 45 | Mumbai | **53.6/100** | ⭐ 4.9 | ₹1200.0/hr | Recommended because it is matches your frequent formats: solo voiceover; features professional acoustic treatment and video recording; rated 4.9/5.0 (115 reviews). |
| #4 | S041 | Pune Podcast Studio 41 | Pune | **48.2/100** | ⭐ 4.2 | ₹1600.0/hr | Recommended because it is matches your frequent formats: solo voiceover; features professional acoustic treatment; rated 4.2/5.0 (143 reviews). |
| #5 | S040 | Lucknow Podcast Studio 40 | Lucknow | **48.0/100** | ⭐ 4.0 | ₹1800.0/hr | Recommended because it is matches your frequent formats: solo voiceover; features professional acoustic treatment; rated 4.0/5.0 (199 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Bengaluru), format fit (interview, solo voiceover), and studio quality metrics (4.6⭐).

---

### User U-015: Small-team creator
- **Last Active City:** Jaipur
- **Past Bookings:** 4 | **Saved Studios:** 2
- **Preferred Genres:** interview
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 4 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S001 | Echo Room | Bengaluru | **73.8/100** | ⭐ 4.8 | ₹1200.0/hr | Recommended because it is matches your frequent formats: interview; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.8/5.0 (126 reviews). |
| #2 | S009 | TalkSpace | Mumbai | **69.4/100** | ⭐ 4.8 | ₹1300.0/hr | Recommended because it is matches your frequent formats: interview; saved in your studio wishlist; features professional acoustic treatment; rated 4.8/5.0 (143 reviews). |
| #3 | S031 | Jaipur Podcast Studio 31 | Jaipur | **66.5/100** | ⭐ 4.1 | ₹1200.0/hr | Recommended because it is Located in Jaipur, your recent active city; matches your frequent formats: interview; rated 4.1/5.0 (99 reviews). |
| #4 | S018 | Studio Orbit | Bengaluru | **53.5/100** | ⭐ 4.9 | ₹2000.0/hr | Recommended because it is matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.9/5.0 (111 reviews). |
| #5 | S025 | GrandCast | Pune | **53.0/100** | ⭐ 4.9 | ₹2400.0/hr | Recommended because it is matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.9/5.0 (96 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Bengaluru), format fit (interview, video), and studio quality metrics (4.8⭐).

---

### User U-016: New creator 2
- **Last Active City:** Chennai
- **Past Bookings:** 0 | **Saved Studios:** 0
- **Preferred Genres:** None
- **Cold Start Status:** YES (Unpersonalized Fallback)
- **Summary:** Recommendations for this new profile are based on city alignment and high verified community ratings, as no prior bookings exist.

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S035 | Chennai Podcast Studio 35 | Chennai | **69.0/100** | ⭐ 4.1 | ₹1800.0/hr | Not personalized — insufficient user history. Located in your designated city (Chennai). Top-rated studio (4.1/5.0 from 135 reviews). |
| #2 | S050 | Chennai Podcast Studio 50 | Chennai | **69.0/100** | ⭐ 3.8 | ₹750.0/hr | Not personalized — insufficient user history. Located in your designated city (Chennai). Top-rated studio (3.8/5.0 from 153 reviews). |
| #3 | S016 | LiveTake | Chennai | **65.2/100** | ⭐ 4.6 | ₹1400.0/hr | Not personalized — insufficient user history. Located in your designated city (Chennai). Top-rated studio (4.6/5.0 from 72 reviews). |
| #4 | S023 | OpenFrame Studio | Chennai | **65.1/100** | ⭐ 4.7 | ₹1600.0/hr | Not personalized — insufficient user history. Located in your designated city (Chennai). Top-rated studio (4.7/5.0 from 66 reviews). |
| #5 | S011 | IndieMic | Chennai | **58.6/100** | ⭐ 4.1 | ₹850.0/hr | Not personalized — insufficient user history. Located in your designated city (Chennai). Top-rated studio (4.1/5.0 from 31 reviews). |

**Recommendation Quality Assessment:** Makes sense: Cold-start user with 0 bookings is recommended high-rated studios in Chennai (Chennai Podcast Studio 35) based on rating and reviews without making false claims about past usage.

---

### User U-017: Saved-studio user
- **Last Active City:** Bengaluru
- **Past Bookings:** 5 | **Saved Studios:** 2
- **Preferred Genres:** interview
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 5 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S003 | FrameCast Studio | Bengaluru | **97.4/100** | ⭐ 4.7 | ₹1500.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: interview; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.7/5.0 (91 reviews). |
| #2 | S001 | Echo Room | Bengaluru | **78.8/100** | ⭐ 4.8 | ₹1200.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.8/5.0 (126 reviews). |
| #3 | S018 | Studio Orbit | Bengaluru | **78.5/100** | ⭐ 4.9 | ₹2000.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.9/5.0 (111 reviews). |
| #4 | S043 | Bengaluru Podcast Studio 43 | Bengaluru | **75.5/100** | ⭐ 4.9 | ₹1800.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.9/5.0 (20 reviews). |
| #5 | S002 | VoiceCraft Studio | Bengaluru | **72.0/100** | ⭐ 4.6 | ₹900.0/hr | Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: interview; features professional acoustic treatment; rated 4.6/5.0 (83 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Bengaluru), format fit (interview, video), and studio quality metrics (4.7⭐).

---

### User U-018: Price-sensitive video creator
- **Last Active City:** Pune
- **Past Bookings:** 6 | **Saved Studios:** 2
- **Preferred Genres:** video
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 6 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S006 | PodWorks | Pune | **97.0/100** | ⭐ 4.7 | ₹1100.0/hr | Recommended because it is Located in Pune, your recent active city; matches your frequent formats: video; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.7/5.0 (77 reviews). |
| #2 | S025 | GrandCast | Pune | **78.0/100** | ⭐ 4.9 | ₹2400.0/hr | Recommended because it is Located in Pune, your recent active city; matches your frequent formats: video; features professional acoustic treatment and video recording; rated 4.9/5.0 (96 reviews). |
| #3 | S014 | PixelPod | Pune | **77.4/100** | ⭐ 4.8 | ₹1700.0/hr | Recommended because it is Located in Pune, your recent active city; matches your frequent formats: video; features professional acoustic treatment and video recording; rated 4.8/5.0 (85 reviews). |
| #4 | S005 | QuietTake | Pune | **60.2/100** | ⭐ 4.4 | ₹700.0/hr | Recommended because it is Located in Pune, your recent active city; saved in your studio wishlist; features professional acoustic treatment; rated 4.4/5.0 (42 reviews). |
| #5 | S054 | Delhi Podcast Studio 54 | Delhi | **54.2/100** | ⭐ 4.6 | ₹1400.0/hr | Recommended because it is matches your frequent formats: video; features professional acoustic treatment and video recording; rated 4.6/5.0 (164 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Pune), format fit (interview, video), and studio quality metrics (4.7⭐).

---

### User U-019: Music-and-interview creator
- **Last Active City:** Mumbai
- **Past Bookings:** 6 | **Saved Studios:** 2
- **Preferred Genres:** interview, music
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 6 past booking(s) and 2 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S009 | TalkSpace | Mumbai | **79.4/100** | ⭐ 4.8 | ₹1300.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: interview; saved in your studio wishlist; features professional acoustic treatment; rated 4.8/5.0 (143 reviews). |
| #2 | S007 | The Sound Loft | Delhi | **67.6/100** | ⭐ 4.6 | ₹1600.0/hr | Recommended because it is matches your frequent formats: interview, music; saved in your studio wishlist; features professional acoustic treatment; rated 4.6/5.0 (102 reviews). |
| #3 | S004 | BeatHouse | Mumbai | **61.1/100** | ⭐ 4.5 | ₹1800.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: music; features professional acoustic treatment and video recording; rated 4.5/5.0 (64 reviews). |
| #4 | S021 | MusicMic Lab | Mumbai | **55.7/100** | ⭐ 4.7 | ₹1900.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: music; features professional acoustic treatment; rated 4.7/5.0 (39 reviews). |
| #5 | S060 | Mumbai Podcast Studio 60 | Mumbai | **55.4/100** | ⭐ 3.8 | ₹1800.0/hr | Recommended because it is Located in Mumbai, your recent active city; matches your frequent formats: interview; features professional video recording; rated 3.8/5.0 (83 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Mumbai), format fit (interview), and studio quality metrics (4.8⭐).

---

### User U-020: Low-signal creator
- **Last Active City:** Kolkata
- **Past Bookings:** 4 | **Saved Studios:** 0
- **Preferred Genres:** interview
- **Cold Start Status:** NO (Personalized Multi-Factor)
- **Summary:** Personalized ranking generated from 4 past booking(s) and 0 saved venue(s).

| Rank | Studio ID | Studio Name | City | Match Score | Rating | Price | Grounded Explanation |
|---|---|---|---|---|---|---|---|
| #1 | S001 | Echo Room | Bengaluru | **53.8/100** | ⭐ 4.8 | ₹1200.0/hr | Recommended because it is matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.8/5.0 (126 reviews). |
| #2 | S018 | Studio Orbit | Bengaluru | **53.5/100** | ⭐ 4.9 | ₹2000.0/hr | Recommended because it is matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.9/5.0 (111 reviews). |
| #3 | S025 | GrandCast | Pune | **53.0/100** | ⭐ 4.9 | ₹2400.0/hr | Recommended because it is matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.9/5.0 (96 reviews). |
| #4 | S014 | PixelPod | Pune | **52.4/100** | ⭐ 4.8 | ₹1700.0/hr | Recommended because it is matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.8/5.0 (85 reviews). |
| #5 | S003 | FrameCast Studio | Bengaluru | **52.4/100** | ⭐ 4.7 | ₹1500.0/hr | Recommended because it is matches your frequent formats: interview; features professional acoustic treatment and video recording; rated 4.7/5.0 (91 reviews). |

**Recommendation Quality Assessment:** Makes sense: High alignment on city (Bengaluru), format fit (interview, video), and studio quality metrics (4.8⭐).

---
