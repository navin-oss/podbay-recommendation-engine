export interface Studio {
  studio_id: string;
  name: string;
  city: string;
  price_per_hour: number;
  capacity: number;
  genre_fit: string[];
  equipment: string[];
  acoustic_treatment: boolean;
  video_recording: boolean;
  rating: number;
  review_count: number;
  active: boolean;
  currency: string;
  source_type?: string;
  source_note?: string;
  availability_note?: string;
}

export interface StudioListResponse {
  total: number;
  active_count: number;
  inactive_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  items: Studio[];
}

export interface BookingRecord {
  studio_id: string;
  date: string;
  genre: string;
  studio_name?: string | null;
  studio_city?: string | null;
  studio_price?: number | null;
}

export interface UserProfile {
  user_id: string;
  display_name: string;
  profile_city?: string | null;
  last_active_city?: string | null;
  past_bookings: BookingRecord[];
  saved_studios: string[];
  preferred_genres: string[];
  data_status?: string | null;
  notes?: string | null;
  is_cold_start: boolean;
  booking_count: number;
  saved_count: number;
}

export interface UserListResponse {
  total: number;
  cold_start_count: number;
  items: UserProfile[];
}

export interface UserHistoryResponse {
  user_id: string;
  display_name: string;
  last_active_city?: string | null;
  booking_count: number;
  saved_count: number;
  bookings: BookingRecord[];
  saved_studios: Studio[];
}

export interface ScoreBreakdown {
  city_match: number;
  genre_match: number;
  saved_studio: number;
  amenities: number;
  quality_rating: number;
  popularity_reviews: number;
  total: number;
}

export interface RecommendationItem {
  rank: number;
  studio: Studio;
  score: number;
  score_breakdown: ScoreBreakdown;
  explanation: string;
  reasons: string[];
  is_saved: boolean;
  confidence: 'High' | 'Moderate' | 'Low';
  confidence_score: number;
}

export interface RecommendationResponse {
  user_id: string;
  user_display_name: string;
  last_active_city?: string | null;
  is_cold_start: boolean;
  explanation_summary: string;
  total_candidates: number;
  recommendations: RecommendationItem[];
}

export interface DashboardStats {
  total_studios: number;
  active_studios: number;
  inactive_studios: number;
  total_users: number;
  users_with_bookings: number;
  users_cold_start: number;
  users_with_saved: number;
  studios_by_city: Record<string, number>;
  studios_by_genre: Record<string, number>;
  average_price_per_hour: number;
  average_rating: number;
  price_range: {
    min: number;
    max: number;
    median: number;
  };
  engine_overview: {
    version: string;
    scoring_formula: string;
    max_possible_score: number;
    weights: Record<string, { weight: number; desc: string }>;
    cold_start_strategy: string;
    hard_constraints: string[];
  };
}

export interface EvaluationSummary {
  total_users_evaluated: number;
  total_studios: number;
  active_studios: number;
  inactive_studios_tested: number;
  inactive_in_recommendations: number;
  cold_start_users_count: number;
  average_top1_score: number;
  score_distribution: Record<string, number>;
  user_benchmarks: {
    user_id: string;
    display_name: string;
    city: string;
    bookings_count: number;
    is_cold_start: boolean;
    top_recommended_studio: string;
    top_studio_city: string;
    top_score: number;
    confidence: string;
    explanation_excerpt: string;
  }[];
  integrity_checks: {
    all_inactive_studios_excluded: boolean;
    cold_start_properly_handled: boolean;
    all_scores_within_0_100_range: boolean;
    evidence_grounded_explanations: boolean;
    zero_hallucinated_fields: boolean;
  };
  system_limitations: string[];
  algorithm_design_notes: string[];
}
