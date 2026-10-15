<div align="center">

# 🎙️ PodBay

### Explainable Podcast Studio Recommendation Engine

**Transparent, multi-factor studio↔creator matching — no black-box APIs, no vector databases, no external calls.**

![PodBay Hero Preview](PodcastStudio_Background.png)

<br/>

![Python](https://img.shields.io/badge/python-3.10%2B-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.143-009688?style=flat-square&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker&logoColor=white)
![Tests](https://img.shields.io/badge/tests-23%20passed-2ea44f?style=flat-square)
![License](https://img.shields.io/badge/status-production%20ready-8b5cf6?style=flat-square)

</div>

---

## ✨ Why PodBay?

Every recommendation comes with **the exact math behind it**. PodBay scores each studio on a transparent 0–100 scale and shows you *precisely* why a venue ranked where it did — grounded, human-readable reasons instead of an opaque number.

| 🎯 Feature | 💡 What it means for you |
|---|---|
| **Multi-Signal Ranking** | Weighs location, format history, wishlist intent, studio hardware, ratings & review volume |
| **Explainable Scoring** | Every recommendation exposes the exact point contribution of each factor |
| **Cold-Start Handling** | New creators (`U-003`, `U-016`) get honest, popularity-based fallbacks — clearly labeled |
| **Strict Active Filtering** | Inactive studios are *guaranteed* never to appear in results |
| **Multi-City Resolution** | Divergent histories (`U-010`) resolve to the latest active city with a confidence score |
| **Cinematic Dark UI** | Glassmorphism dashboard with Recharts analytics and a immersive studio hero |
| **Zero External Dependencies** | Fully offline-capable, deterministic, sub-millisecond scoring |

---

## 🧱 Tech Stack

<table>
<tr>
<td width="50%">

### ⚙️ Backend
- **Python 3.10+ / FastAPI** — async REST API
- **Pydantic v2** — validation & settings
- **Uvicorn** — ASGI server
- **Pandas** — in-memory dataset processing
- **pytest + HTTPX** — 23-test verification suite

</td>
<td width="50%">

### 🎨 Frontend
- **React 19 + TypeScript** — typed components
- **Vite 8** — lightning-fast build & HMR
- **Tailwind CSS 3.4** — utility styling
- **React Router 7** — SPA navigation
- **Recharts** — responsive analytics charts
- **Axios + Lucide** — HTTP client & icons

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Option A — One command with Docker (recommended)

```bash
# Clone the repo
git clone https://github.com/navin-oss/podbay-recommendation-engine.git
cd podbay-recommendation-engine

# Build & run (serves frontend + API together on port 8000)
docker compose up --build -d
```

➡️ Open **http://localhost:8000** — full app live, API docs at **/docs**.

<details>
<summary>🐳 <b>Manual Docker (without compose)</b></summary>

```bash
docker build -t podbay .
docker run -d -p 8000:8000 --name podbay podbay
```
</details>

### Option B — Run locally for development

**Terminal 1 — Backend:**
```bash
python -m pip install -r backend/requirements.txt
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev          # http://127.0.0.1:5173
```

---

## 🧠 How the Recommendation Engine Works

The engine runs a **two-phase pipeline**: a deterministic filter gate, then a transparent scoring model.

```
[ 60 Candidate Studios ]
          │
          ▼
┌─────────────────────────────┐
│  Hard Constraint Filter Gate │  • studio must be ACTIVE
└─────────────────────────────┘  • user query filters (city, price, etc.)
          │
     [ ≤ 54 Active Candidates ]
          │
     ┌────┴─────────────────────┐
     ▼                          ▼
[ Has History ]          [ Cold Start / Zero History ]
 Personalized Scoring     Popularity + City Scoring
 (labeled & explained)    ("Not personalized" banner)
     └────┬─────────────────────┘
          ▼
   Rank → Explain → Confidence
```

### 📊 Scoring Formula (0–100 points)

\[
\text{Total} = \min\!\big(100,\; S_{city} + S_{genre} + S_{saved} + S_{amenities} + S_{rating} + S_{reviews}\big)
\]

| Pillar | Max pts | Allocation logic |
|---|:---:|---|
| 📍 **City Alignment** | 25 | +25 for `last_active_city`, +12 for a previously-booked city |
| 🎭 **Genre Compatibility** | 30 | Weighted overlap of booking frequency + explicit preferences |
| ⭐ **Saved Wishlist Intent** | 20 | +20 if the studio is in the creator's wishlist |
| 🎛️ **Amenities & Hardware** | 10 | +5 acoustic treatment, +5 video recording |
| 🏆 **Community Rating** | 10 | `(rating / 5.0) × 10` |
| 💬 **Review Social Proof** | 5 | `min(reviews, 150) / 150 × 5` |

> 🥶 **Cold-start** profiles get a redistributed weighting (City 35 · Genre 25 · Rating 25 · Reviews 15) and are always flagged `is_cold_start: true` with `confidence: "Low"`.

---

## 🔌 API Endpoints

Base path `/api` · Interactive docs at **/docs** · All responses are typed JSON.

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System health & dataset counts |
| `GET` | `/api/dashboard/stats` | Catalog-wide KPIs & distributions |
| `GET` | `/api/users` | List/search creators (`search`, `city`, `cold_start_only`) |
| `GET` | `/api/users/{user_id}` | Single creator profile (404 on unknown) |
| `GET` | `/api/users/{user_id}/history` | Enriched booking history & wishlist |
| `GET` | `/api/studios` | Filterable, sortable, paginated studio catalog |
| `GET` | `/api/studios/{studio_id}` | Detailed studio listing |
| `GET` | `/api/recommendations/{user_id}` | Ranked, explainable recommendations |
| `GET` | `/api/evaluation/summary` | Full audit across all 20 profiles |

<details>
<summary>📄 <b>Sample recommendation response</b> — <code>GET /api/recommendations/U-001?limit=1</code></summary>

```json
{
  "user_id": "U-001",
  "last_active_city": "Mumbai",
  "is_cold_start": false,
  "explanation_summary": "Personalized ranking generated from 2 past booking(s) and 2 saved venue(s).",
  "recommendations": [
    {
      "rank": 1,
      "studio": { "studio_id": "S009", "name": "Bandra Voice Room", "city": "Mumbai", "rating": 4.8 },
      "score": 78.7,
      "score_breakdown": {
        "city_match": 25.0, "genre_match": 25.0, "saved_studio": 0.0,
        "amenities": 10.0, "quality_rating": 9.6, "popularity_reviews": 3.1, "total": 78.7
      },
      "reasons": [
        "Located in Mumbai, your recent active city",
        "matches your frequent formats: interview",
        "features professional acoustic treatment and video recording",
        "rated 4.8/5.0 (92 reviews)"
      ],
      "confidence": "High",
      "confidence_score": 0.9
    }
  ]
}
```
</details>

---

## 🗂️ Project Structure

```text
podbay/
├── backend/          # FastAPI REST API
│   ├── app/
│   │   ├── api/routes.py        # Endpoints + filters + 404s
│   │   ├── services/recommender.py  # Explainable scoring engine
│   │   ├── services/evaluation.py   # Benchmark audits
│   │   └── schemas/             # Pydantic models
│   └── tests/                   # 23 unit + integration tests
├── frontend/         # React 19 + Vite + Tailwind
│   └── src/
│       ├── pages/               # Dashboard, Recommendations, Studios, Users, Evaluation
│       ├── components/          # Navbar, StudioModal, ScoreBreakdownCard
│       └── services/api.ts      # Centralized Axios client
├── data/             # 60 studios + 20 creators (synthetic demo set)
├── reports/          # Per-creator audit log
├── Dockerfile        # Multi-stage build (frontend → single image)
└── docker-compose.yml
```

---

## 🧪 Testing

```bash
python -m pytest backend/tests -v
```

```text
collected 23 items
backend/tests/test_api.py ............                             [ 52%]
backend/tests/test_recommender.py ...........                      [100%]

============================= 23 passed in 0.38s ==============================
```

**Integrity gates:** 100% inactive-exclusion compliance · 100% cold-start fallback accuracy · all scores bounded `0.0 ≤ score ≤ 100.0` · `<1ms` per request. Full audit in [`reports/test_log.md`](reports/test_log.md).

---

## 📦 Dataset Provenance

All records are **synthetic demo data** for benchmarking — 60 studios across 13 Indian cities (54 active, 6 intentionally inactive) and 20 creator profiles with verified foreign-key integrity. Prices in **INR ₹**. See [`data/DATA_DICTIONARY.md`](data/DATA_DICTIONARY.md).

| Persona | Edge case |
|---|---|
| `U-003`, `U-016` | Cold start (0 bookings) |
| `U-004`, `U-009`, `U-014` | Sparse history (1 booking) |
| `U-010` | Contradictory multi-city history |
| `S013`, `S019`, `S026`, `S033`, `S051`, `S056` | Inactive — must never be recommended |

---

## 📈 Scaling Roadmap

From in-memory linear scan to production scale (100k users / 50k studios):

1. **Two-stage retrieval** — Redis Geo + inverted tag indexes narrow 50k → 200 candidates in `<5ms`
2. **Vector re-ranking** — SentenceTransformer embeddings + ANN (FAISS/HNSW) for semantic gear/show matching
3. **Contextual bandits** — LinUCB balances exploiting top venues vs. exploring new listings
4. **Event-driven feedback** — Kafka streams booking/interaction events to refresh affinity vectors & caches

---

## 🐋 Deployment

The `Dockerfile` is a **multi-stage build**: it compiles the React frontend, then copies the static bundle into the Python image so FastAPI serves the UI **and** API from a single container on port `8000`. Deploy anywhere Docker runs — Render, Railway, Fly.io, AWS App Runner, or Google Cloud Run — with zero extra config.

---

<div align="center">

Built with ❤️ for transparent, explainable recommendations.

[⬆ Back to top](#-podbay)

</div>
