# PodBay — System Architecture, Recommendation Engine & Technical Specification

> **Comprehensive Technical Guide, Algorithm Mathematical Formulation, Tech Stack Breakdown, and Enterprise Scaling Architecture for the PodBay Recommendation Engine.**

---

## 1. Executive Summary & Project Purpose

**PodBay** is a full-stack, transparent, and explainable AI recommendation engine engineered for matching podcast creators with professional recording studios across India. 

Unlike black-box recommendation models that emit opaque scores without context, PodBay utilizes an **evidence-grounded, multi-factor scoring algorithm** with mathematical transparency. For every recommended venue, the engine outputs exact numerical contributions for each factor (geographic proximity, format frequency, saved intent, studio equipment capabilities, quality ratings, and community reviews), accompanied by verifiable natural-language rationales.

The system handles real-world recommender challenges:
- **Cold-Start Creator Detection**: Automatically identifies creators with zero booking history (e.g., `U-003`, `U-016`) and falls back to a location-aware, rating-grounded popularity model with an explicit `"Not personalized — insufficient user history"` disclosure.
- **Strict Inactive Exclusion**: Enforces deterministic filtering so non-operational studios (`active == False`) are strictly barred from appearing in recommendations.
- **Multi-City & Contradictory History Resolution**: Intelligently detects creators with conflicting booking histories across different cities (e.g., `U-010`), prioritizing the latest verified active city while computing a calibrated confidence indicator (`High`, `Moderate`, `Low`).
- **Zero External API Dependencies**: Completely offline-capable, deterministic, fast (sub-millisecond evaluation), and benchmarked on 60 studios and 20 creator profiles.

---

## 2. Complete Technology Stack

| Layer | Technology | Version | Purpose & Rationale |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | **Python** / **FastAPI** | Python 3.13+ / FastAPI 0.143 | High-performance asynchronous REST API framework with native OpenAPI/Swagger generation and asynchronous task handling. |
| **Data Validation** | **Pydantic v2** & **Pydantic-Settings** | v2.10+ | Strict type validation, automatic serialization, query coercion, and centralized configuration loading. |
| **ASGI Server** | **Uvicorn** | v0.41+ | Blazing fast lightning ASGI web server implementation. |
| **Dataset Processing** | **Pandas** & **Standard Library** | Pandas 2.2+, Collections, Math | Efficient in-memory caching, record parsing, Counter-based frequency distributions, and synthetic data ingestion. |
| **Test Automation** | **pytest** & **HTTPX** | pytest 9.1+, httpx 0.28+ | Comprehensive 23-test suite verifying algorithm scoring math, edge cases, HTTP status codes, and API contracts. |
| **Frontend Framework** | **React** (with **TypeScript**) | React 19.2+, TypeScript 6.0 | Modern component-driven UI with strong compile-time type safety mirroring backend Pydantic models. |
| **Build & Dev Tool** | **Vite** | Vite 8.3+ | Ultra-fast Hot Module Replacement (HMR), tree-shaking, and optimized production bundle generator (`npm run build`). |
| **Styling & Theme** | **Tailwind CSS** + Vanilla CSS | Tailwind CSS 3.4+ | Utility-first styling coupled with custom CSS design tokens for dark-mode glassmorphism (`backdrop-filter: blur(16px)`). |
| **Client Routing** | **React Router DOM** | React Router v7.18 | Single Page Application (SPA) client-side routing across 5 distinct views with query parameter synchronization. |
| **Data Visualization** | **Recharts** | Recharts 3.10+ | Responsive SVG analytics charts for city distribution, format breakdown, and score bin histograms. |
| **Iconography** | **Lucide React** | Lucide 1.57+ | Clean, consistent UI icons for studio hardware, location, audio equipment, ratings, and filters. |
| **HTTP Client** | **Axios** | Axios 1.20+ | Typed asynchronous API client with centralized baseURL handling and error management. |
| **Visual Assets** | **Custom Hero Asset** | 1.78 MB PNG | `PodcastStudio_Background.png` integrated into `frontend/public/` with layered radial/linear dark gradient overlays. |

---

## 3. Recommendation Engine: Algorithms, Formulas & Math

The recommendation engine follows a **two-phase pipeline**:
1. **Hard Constraint Filtering Gate** (deterministic boolean exclusion)
2. **Multi-Factor Scoring Pipeline** (0.0 to 100.0 continuous scale with explainability breakdowns)

```
                            [ Candidate Studios (60 total) ]
                                          │
                                          ▼
                         ┌──────────────────────────────────┐
                         │  Hard Constraint Filter Gate     │
                         │  • Studio must be ACTIVE         │
                         │  • User Query Filters (City,     │
                         │    Price, Capacity, Amenities)   │
                         └──────────────────────────────────┘
                                          │
                               [ Active Candidates (N ≤ 54) ]
                                          │
                   ┌──────────────────────┴──────────────────────┐
                   ▼                                             ▼
       [ Has Past Bookings / Wishlist ]              [ Zero History / Cold Start ]
                   │                                             │
      ┌──────────────────────────────┐              ┌──────────────────────────────┐
      │ Personalized Scoring Pipeline│              │ Cold-Start Scoring Pipeline  │
      │ • City Proximity (25 pts)    │              │ • Designated City (35 pts)   │
      │ • Genre Compatibility(30 pts)│              │ • Explicit Genres (25 pts)   │
      │ • Wishlist Intent (20 pts)   │              │ • Community Rating (25 pts)  │
      │ • Amenities & Video (10 pts) │              │ • Review Volume (15 pts)     │
      │ • Community Rating (10 pts)  │              │ Total: 0–100 pts             │
      │ • Review Volume (5 pts)      │              │ Label: "Not personalized"    │
      │ Total: 0–100 pts             │              └──────────────────────────────┘
      └──────────────────────────────┘                             │
                   │                                               │
                   └──────────────────────┬────────────────────────┘
                                          │
                                          ▼
                         ┌──────────────────────────────────┐
                         │ Ranking & Sorting Stage          │
                         │ • Sort by Score (Desc)           │
                         │ • Secondary: Rating & Reviews    │
                         │ • Custom: Price Asc/Desc, Rating │
                         └──────────────────────────────────┘
                                          │
                                          ▼
                         ┌──────────────────────────────────┐
                         │ Explainability Generation        │
                         │ • Grounded Reason Tokens         │
                         │ • Confidence Score (0.40 - 0.90) │
                         │ • Detailed Score Breakdown JSON  │
                         └──────────────────────────────────┘
```

---

### 3.1 Hard Constraint Filtering Gate

Before scoring, candidate studios are filtered through strict boolean conditions:
1. **Inactive Studio Exclusion**: Any studio where $\text{active} == \text{False}$ is **immediately dropped**. Out of 60 synthetic studios, 6 are inactive (`S013`, `S019`, `S026`, `S033`, `S051`, `S056`) and are guaranteed never to appear in recommendation outputs.
2. **User Query Constraints**:
   - $\text{City Match}: \text{studio.city} = \text{filter\_city}$
   - $\text{Max Hourly Price}: \text{studio.price\_per\_hour} \le \text{filter\_max\_price}$
   - $\text{Min Capacity}: \text{studio.capacity} \ge \text{filter\_min\_capacity}$
   - $\text{Genre Inclusion}: \text{filter\_genre} \in \text{studio.genre\_fit}$
   - $\text{Acoustic Treatment Gate}: \text{studio.acoustic\_treatment} == \text{True}$ (if requested)
   - $\text{Video Recording Gate}: \text{studio.video\_recording} == \text{True}$ (if requested)

---

### 3.2 Personalized Multi-Factor Scoring Formula

For established creators with at least one historical booking or saved studio:

$$\text{Total Score} = \min\left(100.0, S_{\text{city}} + S_{\text{genre}} + S_{\text{saved}} + S_{\text{amenities}} + S_{\text{rating}} + S_{\text{reviews}}\right)$$

#### Factor 1: Geographic Proximity ($S_{\text{city}}$, Max 25 Points)
- **Primary Match (25.0 pts)**: If the studio's city matches the creator's designated `last_active_city` (or fallback `profile_city`).
- **Historical City Match (12.0 pts)**: If the studio is located in a city where the creator booked previously, but is not their primary current active city.
- **Formula**:
  $$S_{\text{city}} = \begin{cases} 25.0 & \text{if } \text{studio.city} = \text{user.last\_active\_city} \\ 12.0 & \text{else if } \text{studio.city} \in \text{user.past\_booked\_cities} \\ 0.0 & \text{otherwise} \end{cases}$$

#### Factor 2: Genre Compatibility & Format Affinity ($S_{\text{genre}}$, Max 30 Points)
- Derives a weighted frequency distribution from the creator's past recorded bookings ($W_{\text{booking}} = 1$ per booking) combined with explicit profile genres ($W_{\text{explicit}} = 2$ boost).
- Let $G_u$ be the multiset of creator format weights, and $G_s$ be the set of formats supported by the studio.
- **Formula**:
  $$S_{\text{genre}} = 30.0 \times \left( \frac{\sum_{g \in (G_u \cap G_s)} \text{weight}(g)}{\sum_{g \in G_u} \text{weight}(g)} \right)$$

#### Factor 3: Saved Studio Wishlist Boost ($S_{\text{saved}}$, Max 20 Points)
- Direct signal of high creator intent and brand recall.
- **Formula**:
  $$S_{\text{saved}} = \begin{cases} 20.0 & \text{if } \text{studio.studio\_id} \in \text{user.saved\_studios} \\ 0.0 & \text{otherwise} \end{cases}$$

#### Factor 4: Technical Amenities & Production Capabilities ($S_{\text{amenities}}$, Max 10 Points)
- Evaluates acoustic dampening/isolation and multi-camera video podcasting readiness.
- **Formula**:
  $$S_{\text{amenities}} = S_{\text{acoustic}} + S_{\text{video}}$$
  where:
  - $S_{\text{acoustic}} = 5.0 \text{ if studio.acoustic\_treatment else } 0.0$
  - $S_{\text{video}} = 5.0 \text{ if studio.video\_recording else } 0.0$

#### Factor 5: Studio Quality Rating ($S_{\text{rating}}$, Max 10 Points)
- Linear scaling of verified community star rating (normalized against a 5.0 scale).
- **Formula**:
  $$S_{\text{rating}} = \left( \frac{\text{studio.rating}}{5.0} \right) \times 10.0$$

#### Factor 6: Review Volume & Social Proof ($S_{\text{reviews}}$, Max 5 Points)
- Logarithmic-style capped volume metric. 150+ reviews awards full credibility points without allowing older high-volume studios to permanently dominate newer venues.
- **Formula**:
  $$S_{\text{reviews}} = \left( \frac{\min(\text{studio.review\_count}, 150)}{150.0} \right) \times 5.0$$

---

### 3.3 Cold-Start Creator Scoring Formula

When a creator has **0 past bookings and 0 saved studios** (e.g., `U-003`, `U-016`), the engine switches to a specialized cold-start formulation:

$$\text{Total Score}_{\text{cold}} = \min\left(100.0, S_{\text{city\_cold}} + S_{\text{genre\_cold}} + S_{\text{rating\_cold}} + S_{\text{reviews\_cold}}\right)$$

| Component | Max Points | Formulation | Rationale |
| :--- | :--- | :--- | :--- |
| **City Match** | **35.0 pts** | $35.0$ if $\text{studio.city} = \text{user.designated\_city}$ else $0.0$ | Primary constraint for new creators seeking local studio access. |
| **Genre Overlap** | **25.0 pts** | $25.0 \times \left( \frac{\|G_{\text{pref}} \cap G_{\text{studio}}\|}{\|G_{\text{pref}}\|} \right)$ | Matches explicit genres declared during user profile creation. |
| **Quality Rating** | **25.0 pts** | $\left( \frac{\text{studio.rating}}{5.0} \right) \times 25.0$ | High community rating builds initial trust for new users. |
| **Review Volume** | **15.0 pts** | $\left( \frac{\min(\text{reviews}, 150)}{150.0} \right) \times 15.0$ | Verified track record ensures reliability. |
| **Saved Studio** | **0.0 pts** | Fixed at 0.0 | No historical wishlist exists. |
| **Amenities** | **0.0 pts** | Fixed at 0.0 | Avoids assuming unstated technical requirements. |

**Mandatory Cold-Start Disclosure**: Cold-start recommendations always return `is_cold_start: true`, `confidence: "Low"`, `confidence_score: 0.40`, and prepend the explanation with:
> `"Not personalized — insufficient user history."`

---

### 3.4 Contradictory & Multi-City Resolution

Creators like `U-010` exhibit divergent historical behavior (past bookings recorded in Mumbai, Pune, and Bengaluru; current active city set to Bengaluru).

**Resolution Logic**:
1. **Primary City Preference**: The engine explicitly prioritizes `user.last_active_city` (`Bengaluru`), awarding the full 25.0 city proximity points.
2. **Secondary City Acknowledgement**: Studios in historical cities (`Mumbai`, `Pune`) receive partial proximity credit (12.0 pts).
3. **Confidence Degradation**: Because historical signals are split across multiple markets, the confidence level is down-calibrated:
   - Single-city, 2+ bookings $\to$ **High** ($0.90$)
   - Multi-city or $\ge 3$ distinct genres $\to$ **Moderate** ($0.75$)
   - Sparse history (1 booking) $\to$ **Moderate** ($0.65$)
   - Cold-start (0 bookings) $\to$ **Low** ($0.40$)
4. **Transparent Explanation**: Explanations explicitly note:
   > `"Recommended because it is Located in Bengaluru, your recent active city... (Prioritized Bengaluru based on your latest activity despite multi-city history)."`

---

## 4. Current System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER / WEB BROWSER                              │
│                                                                        │
│   • Dashboard (Hero, Metrics, Recharts Analytics)                      │
│   • Recommendations (Interactive User Dropdown, Live Scoring Cards)   │
│   • Studio Explorer (Search, Multi-Filter, Grid/Table, Pagination)     │
│   • User Profiles (Directory, Enriched Past Sessions, Wishlist)        │
│   • System Evaluation (Audit Distribution, Quality Integrity Gates)    │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │
                                  ▼ HTTP (JSON / REST API)
┌────────────────────────────────────────────────────────────────────────┐
│                 FASTAPI ASGI BACKEND (Port 8000)                       │
│                                                                        │
│  ├── CORS Middleware (Cross-Origin Resource Sharing)                   │
│  ├── Static Files SPA Fallback Handler (Serves frontend/dist)          │
│  │                                                                     │
│  ├── REST API Router (/api)                                            │
│  │   ├── GET /api/health                                               │
│  │   ├── GET /api/dashboard/stats                                      │
│  │   ├── GET /api/users                                                │
│  │   ├── GET /api/users/{user_id}                                      │
│  │   ├── GET /api/users/{user_id}/history                              │
│  │   ├── GET /api/studios                                              │
│  │   ├── GET /api/studios/{studio_id}                                  │
│  │   ├── GET /api/recommendations/{user_id}                            │
│  │   └── GET /api/evaluation/summary                                   │
│  │                                                                     │
│  ├── Core Services                                                     │
│  │   ├── DataLoader (In-Memory Dataset Cache & Validation)             │
│  │   ├── RecommendationEngine (Hard Filters, Scoring, Explanations)    │
│  │   └── EvaluationService (Quality Audits, Score Binning)             │
│  │                                                                     │
│  └── Pydantic Schema Models (Studio, User, Recommendation, Breakdown)  │
└─────────────────────────────────┬──────────────────────────────────────┘
                                  │
                                  ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        SYNTHETIC DATA LAYER                            │
│                                                                        │
│  ├── data/studios.json (60 Synthetic Studio Listings)                  │
│  ├── data/studios.csv  (Flat CSV Representation)                       │
│  ├── data/users.json   (20 Synthetic Creator Benchmark Personas)       │
│  └── data/users.csv    (Flat CSV Representation)                       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Scalable Enterprise Architecture (100,000+ Users & 50,000+ Studios)

To scale PodBay from a local benchmark application into a high-concurrency production platform serving over **100,000 active creators** and **50,000 studios**, the architecture transitions from an in-memory linear scan into a **distributed, two-stage retrieval and ranking architecture**.

```
[ Clients / Mobile Apps / Web CDN ]
                │
                ▼ (HTTPS / TLS Termination)
      [ Cloudflare / CDN Edge ]
                │
                ▼
      [ API Gateway / Envoy Proxy ]
      (Rate Limiting, Auth, Load Balancing)
                │
                ▼
┌────────────────────────────────────────────────────────────────────────────────┐
│                        KUBERNETES MICROSERVICES PODS                           │
│                                                                                │
│  ┌───────────────────────────┐         ┌────────────────────────────────────┐  │
│  │ Candidate Retrieval       │         │ Re-Ranking & Scoring Service       │  │
│  │ Service (Stage 1)         │ ──────> │ (Stage 2)                          │  │
│  │ • Redis Geospatial 25km   │         │ • Multi-factor Mathematical Engine │  │
│  │ • OpenSearch / Elastic    │         │ • FAISS Dense Vector Embeddings    │  │
│  │   Filtered Candidate Pool │         │ • Contextual Bandits (LinUCB)      │  │
│  │   (50,000 ➔ 200 items)    │         │ • Final Top-K Ranker (200 ➔ 10)    │  │
│  └─────────────┬─────────────┘         └──────────────────┬─────────────────┘  │
└────────────────┼──────────────────────────────────────────┼────────────────────┘
                 │                                          │
                 ▼                                          ▼
┌─────────────────────────────────┐        ┌─────────────────────────────────────┐
│ Fast In-Memory State & Caches   │        │ Primary Distributed Database        │
│ • Redis Cluster (User Sessions, │        │ • PostgreSQL (Aurora / Supabase)    │
│   Geo indexes, Real-time status)│        │   (Studios, Bookings, User History) │
│ • Vector DB (pgvector / Qdrant) │        │ • Read Replicas for Analytics       │
└─────────────────────────────────┘        └──────────────────┬──────────────────┘
                                                              │
                                                              ▼ (Change Data Capture)
                                           ┌─────────────────────────────────────┐
                                           │ Async Event Streaming (Apache Kafka)│
                                           │ • Booking Completed Events          │
                                           │ • Studio Wishlisted Events          │
                                           │ • User Interaction Logs             │
                                           └─────────────────────────────────────┘
```

### Stage 1: Candidate Generation (Filtering 50,000 down to 200 in $<5\text{ms}$)
- **Redis Geospatial Indexing**: Studios are indexed using Redis Geo sets (`GEOADD studios:geo <longitude> <latitude> <studio_id>`). When a user requests recommendations, a `GEOSEARCH` query instantly retrieves all active studios within a $25\text{km}$ radius.
- **Inverted Tag Indexes**: Using OpenSearch or Postgres GIN indexes on the `genre_fit` array to filter studios supporting the user's primary formats.
- **Result**: Drastically narrows the search space from 50,000 venues to the top 200 plausible candidates in under 5 milliseconds.

### Stage 2: Heavy Re-Ranking & Vector Embeddings
- **Dense Vector Search (Hybrid Retrieval)**:
  - Microphones, audio interfaces, room acoustics, and podcast show notes are vectorized into 384-dimensional dense vectors using a lightweight model like `all-MiniLM-L6-v2`.
  - Stored in a vector database (`pgvector`, `Milvus`, or `Qdrant`) with HNSW (Hierarchical Navigable Small World) indexing.
  - Cosine similarity between the creator's semantic show profile and studio gear descriptions provides deep semantic matching beyond keyword tags.
- **Mathematical Multi-Factor Weighting**: The existing PodBay multi-factor formula (City, Genre, Wishlist, Amenities, Rating, Reviews) is evaluated across the 200 candidates.

### Stage 3: Contextual Bandits for Exploration vs. Exploitation
- New studios listed on the platform suffer from their own cold-start problem (zero reviews, low visibility).
- **LinUCB (Linear Upper Confidence Bound)** algorithm balances:
  - **Exploitation**: Recommending known 5.0-star studios with 100+ reviews.
  - **Exploration**: Injecting newly vetted active studios into top-5 slots with an uncertainty exploration bonus to measure creator click-through and booking conversion.

### Stage 4: Event-Driven Feedback Loop (Apache Kafka)
- Every user interaction (`search_performed`, `studio_viewed`, `studio_saved`, `booking_confirmed`, `review_submitted`) is streamed via **Apache Kafka**.
- Asynchronous consumers update creator format affinity vectors, compute refreshed studio rating averages, and invalidate Redis recommendation cache keys.

---

## 6. Complete API Endpoint Specification

All endpoints are hosted under `/api` and return standardized JSON responses.

### 1. `GET /api/health`
- **Description**: Returns live system health, API version, and loaded dataset entity counts.
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "PodBay Recommendation Engine API",
    "version": "1.0.0",
    "studios_count": 60,
    "users_count": 20,
    "environment": "local_demo"
  }
  ```

### 2. `GET /api/dashboard/stats`
- **Description**: Aggregates catalog-wide KPIs for the Dashboard page.
- **Response Keys**:
  - `total_studios`: Total studio count (60)
  - `active_studios`: Operational studios (54)
  - `inactive_studios`: Excluded non-operational studios (6)
  - `total_users`: Total creator profiles (20)
  - `total_bookings`: Total historical booking sessions recorded (38)
  - `average_studio_rating`: Average rating across all studios (4.72)
  - `city_distribution`: Studio counts per city (`{"Bengaluru": 8, "Mumbai": 8, ...}`)
  - `genre_distribution`: Studio counts per genre format (`{"interview": 38, ...}`)
  - `price_summary`: Object with `min`, `max`, and `avg` hourly rates in INR

### 3. `GET /api/users`
- **Query Parameters**:
  - `search` *(str, optional)*: Filter by user ID (`U-001`) or display name.
  - `city` *(str, optional)*: Filter by creator active city.
  - `cold_start_only` *(bool, optional)*: Filter creators with zero past bookings.
- **Response**: `UserListResponse` with `total`, `cold_start_count`, and array of `UserProfile`.

### 4. `GET /api/users/{user_id}`
- **Description**: Returns the comprehensive profile for a single creator.
- **Error**: Returns `HTTP 404` if `user_id` does not exist.

### 5. `GET /api/users/{user_id}/history`
- **Description**: Returns a creator's enriched historical timeline, including hydrated studio details for every past booking and saved wishlist venue.

### 6. `GET /api/studios`
- **Query Parameters**:
  - `search` *(str, optional)*: Free-text search across studio name, city, and equipment.
  - `city` *(str, optional)*: Filter by specific Indian city.
  - `min_price` / `max_price` *(float, optional)*: Hourly rate bounds in INR.
  - `capacity` *(int, optional)*: Minimum guest/creator capacity.
  - `genre` *(str, optional)*: Specific format compatibility.
  - `video_recording` *(bool, optional)*: Require multi-cam video support.
  - `acoustic_treatment` *(bool, optional)*: Require acoustic isolation.
  - `active_only` *(bool, optional)*: Exclude inactive listings.
  - `sort_by` *(str, default "name")*: Sorting strategy (`price_asc`, `price_desc`, `rating_desc`, `capacity`).
  - `page` *(int, default 1)* / `page_size` *(int, default 12)*: Pagination parameters.
- **Response**: `StudioListResponse` containing paginated items, `total`, `page`, `page_size`, and `total_pages`.

### 7. `GET /api/studios/{studio_id}`
- **Description**: Returns complete hardware, pricing, and availability metadata for a specific studio.
- **Error**: Returns `HTTP 404` if `studio_id` is unknown.

### 8. `GET /api/recommendations/{user_id}`
- **Description**: Generates ranked, evidence-grounded recommendations for the specified creator.
- **Query Parameters**:
  - `limit` *(int, default 5)*: Number of top recommendations to return.
  - `city`, `max_price`, `min_capacity`, `genre`, `video_recording`, `acoustic_treatment`: Optional hard constraint filters.
  - `sort_by` *(str, optional)*: `score` (default), `price_asc`, `price_desc`, `rating`.
- **Response**:
  ```json
  {
    "user_id": "U-001",
    "user_display_name": "Aarav Sharma",
    "last_active_city": "Bengaluru",
    "is_cold_start": false,
    "explanation_summary": "Personalized ranking generated from 2 past booking(s) and 2 saved venue(s).",
    "total_candidates": 54,
    "recommendations": [
      {
        "rank": 1,
        "studio": {
          "studio_id": "S001",
          "name": "SoundWave Studios Indiranagar",
          "city": "Bengaluru",
          "price_per_hour": 1500,
          "capacity": 4,
          "rating": 4.9,
          "review_count": 128,
          "genre_fit": ["interview", "solo voiceover", "video"],
          "acoustic_treatment": true,
          "video_recording": true,
          "active": true
        },
        "score": 98.6,
        "score_breakdown": {
          "city_match": 25.0,
          "genre_match": 29.4,
          "saved_studio": 20.0,
          "amenities": 10.0,
          "quality_rating": 9.8,
          "popularity_reviews": 4.4,
          "total": 98.6
        },
        "explanation": "Recommended because it is Located in Bengaluru, your recent active city; matches your frequent formats: interview, solo voiceover, video; saved in your studio wishlist; features professional acoustic treatment and video recording; rated 4.9/5.0 (128 reviews).",
        "is_saved": true,
        "confidence": "High",
        "confidence_score": 0.90
      }
    ]
  }
  ```

### 9. `GET /api/evaluation/summary`
- **Description**: Runs an end-to-end evaluation audit across all 20 creator profiles, computing score distribution histograms, inactive exclusion compliance, cold-start fallback integrity, and latency benchmarks.

---

## 7. Synthetic Dataset Provenance & Integrity

All records in `data/studios.json` and `data/users.json` are **synthetic demo records** designed specifically for algorithm benchmarking:
- **60 Total Studios**: Distributed across 13 major Indian cities (Bengaluru, Mumbai, Delhi, Pune, Hyderabad, Chennai, Kolkata, Jaipur, Noida, Indore, Ahmedabad, Kochi, Chandigarh).
  - 54 Active studios
  - 6 Inactive studios (`S013`, `S019`, `S026`, `S033`, `S051`, `S056`)
- **20 Creator Profiles**:
  - `U-001` through `U-020`
  - Synthetic booking history records with dates, genres, and studio references.
  - Foreign key integrity is 100% verified (every referenced studio exists in the studio dataset).
  - Currency representation is strictly in **Indian Rupees (INR ₹)**.

---

## 8. Verification & Test Suite Summary

The automated test suite in `backend/tests/` provides **23 comprehensive tests** covering unit logic and integration endpoints:

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

============================= 23 passed in 0.70s ==============================
```

### Key Integrity Audit Metrics:
- **Inactive Exclusion Compliance**: 100% (0 inactive studios recommended across all 20 profiles).
- **Cold-Start Fallback Rate**: 100% (both `U-003` and `U-016` correctly identified and labeled).
- **Mathematical Score Bounds**: All scores strictly bounded between $0.0 \le \text{Score} \le 100.0$.
- **Latency**: $<1\text{ms}$ execution latency per recommendation request.
- **Full Audit Log**: Documented per-creator in [`reports/test_log.md`](reports/test_log.md).
