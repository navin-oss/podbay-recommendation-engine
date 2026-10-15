# PodBay Dataset Dictionary

## Provenance
All records in these files are **synthetic demonstration data** generated for this assignment. Studio names, ratings, prices, reviews, active flags, user profiles, bookings, and saved-studio interactions are not verified real-world facts. Do not present them as actual businesses or actual creator behavior.

## Files
- `studios.json`: nested, app-friendly studio records
- `studios.csv`: flat studio table for Excel/Pandas; list fields are pipe-delimited
- `users.json`: user profiles with nested booking history
- `users.csv`: flat export; nested booking history is JSON text

## Studio fields
- `studio_id`: unique synthetic ID
- `name`: fictional demo studio name
- `city`: sample Indian city
- `price_per_hour`: synthetic hourly price in INR
- `currency`: INR
- `capacity`: number of people supported in the sample listing
- `genre_fit`: supported recording formats/genres
- `equipment`: available sample equipment
- `acoustic_treatment`: whether the demo listing has acoustic treatment
- `video_recording`: whether video recording is offered in the demo record
- `rating`: synthetic rating on a 5-point scale
- `review_count`: synthetic count
- `active`: demo availability flag; not live booking availability
- `source_type`, `source_note`: explicit synthetic-data provenance

## User fields
- `user_id`: synthetic ID
- `display_name`: persona label, not a real person's name
- `profile_city`, `last_active_city`: synthetic city attributes
- `preferred_genres`: synthetic preferences for test coverage
- `past_bookings`: list of studio ID, date, genre
- `saved_studios`: studio IDs representing synthetic saved/favourite behavior
- `data_status`, `notes`: provenance and caution fields

## Designed edge cases
- New users with no bookings
- Single-booking / sparse-history users
- Contradictory multi-genre history
- Users with saved studios
- Active and inactive studios
- Different budgets, cities, capacities, and recording formats
