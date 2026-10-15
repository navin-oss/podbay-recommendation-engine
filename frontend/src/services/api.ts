import axios from 'axios';
import {
  Studio,
  StudioListResponse,
  UserProfile,
  UserListResponse,
  UserHistoryResponse,
  RecommendationResponse,
  DashboardStats,
  EvaluationSummary,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  async getHealth(): Promise<{ status: string; studios_count: number; users_count: number }> {
    const res = await apiClient.get('/health');
    return res.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const res = await apiClient.get<DashboardStats>('/dashboard/stats');
    return res.data;
  },

  async getUsers(params?: { search?: string; city?: string; cold_start_only?: boolean }): Promise<UserListResponse> {
    const res = await apiClient.get<UserListResponse>('/users', { params });
    return res.data;
  },

  async getUserById(userId: string): Promise<UserProfile> {
    const res = await apiClient.get<UserProfile>(`/users/${userId}`);
    return res.data;
  },

  async getUserHistory(userId: string): Promise<UserHistoryResponse> {
    const res = await apiClient.get<UserHistoryResponse>(`/users/${userId}/history`);
    return res.data;
  },

  async getStudios(params?: {
    search?: string;
    city?: string;
    min_price?: number;
    max_price?: number;
    capacity?: number;
    genre?: string;
    video_recording?: boolean;
    acoustic_treatment?: boolean;
    active_only?: boolean;
    sort_by?: string;
    page?: number;
    page_size?: number;
  }): Promise<StudioListResponse> {
    const res = await apiClient.get<StudioListResponse>('/studios', { params });
    return res.data;
  },

  async getStudioById(studioId: string): Promise<Studio> {
    const res = await apiClient.get<Studio>(`/studios/${studioId}`);
    return res.data;
  },

  async getRecommendations(
    userId: string,
    params?: {
      limit?: number;
      city?: string;
      max_price?: number;
      min_capacity?: number;
      genre?: string;
      video_recording?: boolean;
      acoustic_treatment?: boolean;
      sort_by?: string;
    }
  ): Promise<RecommendationResponse> {
    const res = await apiClient.get<RecommendationResponse>(`/recommendations/${userId}`, { params });
    return res.data;
  },

  async getEvaluationSummary(): Promise<EvaluationSummary> {
    const res = await apiClient.get<EvaluationSummary>('/evaluation/summary');
    return res.data;
  },
};
