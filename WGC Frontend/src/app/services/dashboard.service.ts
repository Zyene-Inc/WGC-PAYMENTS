import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface DashboardStats {
  status: string;
  data: {
    totalVolume: number;
    donationCount: number;
    averageDonation: number;
    recentDonations: Array<{
      id: string;
      donor: string;
      amount: number;
      fund: string;
      date: string;
    }>;
    volumeByFund: Array<{
      name: string;
      amount: number;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  refresh$ = new Subject<void>();

  getStats(): Observable<any> {
    return this.http.get<any>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.dashboard.summary}`);
  }

  getMerchants(): Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.dashboard.merchants}`);
  }

  getMerchantDetail(id: string): Observable<any> {
    return this.http.get<any>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.dashboard.merchantDetail(id)}`);
  }

  getPayments(filters: any = {}): Observable<any[]> {
    let params = {};
    if (filters.status) params = { ...params, status: filters.status };
    if (filters.type) params = { ...params, type: filters.type };
    if (filters.isRecurring !== undefined) params = { ...params, isRecurring: filters.isRecurring };

    return this.http.get<any[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.dashboard.payments}`, { params });
  }

  getRecurringDonations(): Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.dashboard.recurring}`);
  }

  getPayouts(): Observable<any[]> {
    return this.http.get<any[]>(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.dashboard.payouts}`);
  }

  // ──── MERCHANT CRUD ────
  createMerchant(data: any): Observable<any> {
    return this.http.post(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.dashboard.merchants}`, data);
  }

  updateMerchant(id: string, data: any): Observable<any> {
    return this.http.put(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.dashboard.merchantDetail(id)}`, data);
  }

  updateMerchantStatus(id: string, status: string): Observable<any> {
    return this.http.patch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.dashboard.merchantDetail(id)}/status`, { status });
  }

  // ──── TEAM / SETTINGS ────
  updateProfile(data: any): Observable<any> {
    // Assuming a profile endpoint
    return this.http.put(`${API_CONFIG.baseUrl}/auth/profile`, data);
  }
}
