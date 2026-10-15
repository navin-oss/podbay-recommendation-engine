import json
from pathlib import Path
from typing import List, Optional, Dict
from backend.app.core.config import settings
from backend.app.schemas.studio import Studio
from backend.app.schemas.user import UserProfile, BookingRecord

class DataLoader:
    _instance = None

    def __init__(self):
        self._studios: List[Studio] = []
        self._users: List[UserProfile] = []
        self._studios_dict: Dict[str, Studio] = {}
        self._users_dict: Dict[str, UserProfile] = {}
        self.load_data()

    @classmethod
    def get_instance(cls) -> "DataLoader":
        if cls._instance is None:
            cls._instance = DataLoader()
        return cls._instance

    def load_data(self):
        studios_path = settings.STUDIOS_FILE
        users_path = settings.USERS_FILE

        if not studios_path.exists():
            # Fallback path if running from different cwd
            studios_path = Path("data/studios.json")
        if not users_path.exists():
            users_path = Path("data/users.json")

        if not studios_path.exists() or not users_path.exists():
            raise FileNotFoundError(f"Datasets not found at {studios_path} or {users_path}")

        raw_studios = json.loads(studios_path.read_text(encoding="utf-8"))
        raw_users = json.loads(users_path.read_text(encoding="utf-8"))

        self._studios = [Studio(**s) for s in raw_studios]
        self._studios_dict = {s.studio_id: s for s in self._studios}

        parsed_users = []
        for u in raw_users:
            bookings = []
            for b in u.get("past_bookings", []):
                studio = self._studios_dict.get(b.get("studio_id"))
                bookings.append(
                    BookingRecord(
                        studio_id=b["studio_id"],
                        date=b["date"],
                        genre=b["genre"],
                        studio_name=studio.name if studio else None,
                        studio_city=studio.city if studio else None,
                        studio_price=studio.price_per_hour if studio else None,
                    )
                )

            is_cold = len(bookings) == 0 and len(u.get("saved_studios", [])) == 0 and len(u.get("preferred_genres", [])) == 0
            if len(bookings) == 0:
                is_cold = True

            profile = UserProfile(
                user_id=u["user_id"],
                display_name=u.get("display_name", u.get("name", "Creator")),
                profile_city=u.get("profile_city"),
                last_active_city=u.get("last_active_city"),
                past_bookings=bookings,
                saved_studios=u.get("saved_studios", []),
                preferred_genres=u.get("preferred_genres", []),
                data_status=u.get("data_status"),
                notes=u.get("notes"),
                is_cold_start=is_cold,
                booking_count=len(bookings),
                saved_count=len(u.get("saved_studios", [])),
            )
            parsed_users.append(profile)

        self._users = parsed_users
        self._users_dict = {u.user_id: u for u in self._users}

    def get_studios(self) -> List[Studio]:
        return self._studios

    def get_active_studios(self) -> List[Studio]:
        return [s for s in self._studios if s.active]

    def get_studio_by_id(self, studio_id: str) -> Optional[Studio]:
        return self._studios_dict.get(studio_id)

    def get_users(self) -> List[UserProfile]:
        return self._users

    def get_user_by_id(self, user_id: str) -> Optional[UserProfile]:
        return self._users_dict.get(user_id)

    def get_user_history(self, user_id: str) -> Optional[dict]:
        user = self.get_user_by_id(user_id)
        if not user:
            return None
        saved_details = []
        for sid in user.saved_studios:
            s = self.get_studio_by_id(sid)
            if s:
                saved_details.append(s.model_dump())
        return {
            "user_id": user.user_id,
            "display_name": user.display_name,
            "last_active_city": user.last_active_city,
            "booking_count": user.booking_count,
            "saved_count": user.saved_count,
            "bookings": [b.model_dump() for b in user.past_bookings],
            "saved_studios": saved_details,
        }
