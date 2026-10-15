import json
from pathlib import Path
import streamlit as st
from src.recommender import recommend

ROOT = Path(__file__).parent
studios = json.loads((ROOT / "data/studios.json").read_text(encoding="utf-8"))
users = json.loads((ROOT / "data/users.json").read_text(encoding="utf-8"))

st.set_page_config(page_title="PodBay Recommendations", page_icon="🎙️", layout="wide")
st.title("PodBay — Podcast Studio Recommendations")
st.caption("Demo dataset only. Studios, prices, and user histories are fictional.")
user_map = {f"{u['user_id']} — {u.get('display_name', u.get('name', 'Creator'))}": u for u in users}
selected = st.selectbox("Choose a user", list(user_map.keys()))
user = user_map[selected]
st.write(f"**Recent activity city:** {user.get('last_active_city', 'Unknown')}  |  **Past bookings:** {len(user.get('past_bookings', []))}")
if not user.get("past_bookings"):
    st.info("Cold-start user: results are popular/high-rated suggestions, not personalized.")
for i, item in enumerate(recommend(user, studios), 1):
    s = item["studio"]
    with st.container(border=True):
        c1, c2 = st.columns([3, 1])
        with c1:
            st.subheader(f"{i}. {s['name']}")
            st.write(f"{s['city']} · ₹{s['price_per_hour']}/hour · Capacity {s['capacity']}")
            st.write("Genres: " + ", ".join(s["genre_fit"]))
            st.write("Equipment: " + ", ".join(s["equipment"]))
            st.write(item["explanation"])
        with c2:
            st.metric("Match score", f"{item['score']}/100")
            st.write(f"⭐ {s['rating']} ({s['review_count']} reviews)")
            st.write("Video: " + ("Yes" if s["video_recording"] else "No"))
