from typing import Dict, Any, List
from pydantic import BaseModel

class EvaluationSummary(BaseModel):
    total_users_evaluated: int
    total_studios: int
    active_studios: int
    inactive_studios_tested: int
    inactive_in_recommendations: int
    cold_start_users_count: int
    average_top1_score: float
    score_distribution: Dict[str, int]
    user_benchmarks: List[Dict[str, Any]]
    integrity_checks: Dict[str, bool]
    system_limitations: List[str]
    algorithm_design_notes: List[str]
