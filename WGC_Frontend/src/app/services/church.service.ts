import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, Subject } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class ChurchService {
  private http = inject(HttpClient);
  private base = API_CONFIG.baseUrl;
  private ep = API_CONFIG.endpoints.church;

  refresh$ = new Subject<void>();

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.base}${this.ep.summary}`);
  }

  getDonations(filters: any = {}): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}${this.ep.donations}`, { params: filters });
  }

  getDonors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}${this.ep.donors}`);
  }

  getDonorDetail(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}${this.ep.donorDetail(id)}`);
  }

  getRecurring(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}${this.ep.recurring}`);
  }

  getPayouts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}${this.ep.payouts}`);
  }

  private configSignal = signal<any>(null);
  readonly config = this.configSignal.asReadonly();

  getSettings(): Observable<any> {
    return this.http.get<any>(`${this.base}${this.ep.settings}`).pipe(
      tap(res => {
        if (res && res.config) {
          this.configSignal.set(res.config);
        }
      })
    );
  }

  getTransactions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}${this.ep.transactions}`);
  }

  getCampaignsList(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}${this.ep.campaigns}`);
  }

  getCampaigns(): Observable<any[]> {
    return this.getCampaignsList();
  }

  getReports(): Observable<any> {
    return this.http.get<any>(`${this.base}${this.ep.reports}`);
  }

  getSupport(): Observable<any> {
    return this.http.get<any>(`${this.base}${this.ep.support}`);
  }

  // ──── DONOR CRUD ────
  createDonor(data: any): Observable<any> {
    return this.http.post(`${this.base}${this.ep.donors}`, data);
  }

  updateDonor(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}${this.ep.donorDetail(id)}`, data);
  }

  deleteDonor(id: string): Observable<any> {
    return this.http.delete(`${this.base}${this.ep.donorDetail(id)}`);
  }

  // ──── DONATION ACTIONS ────
  createDonation(data: any): Observable<any> {
    return this.http.post(`${this.base}${this.ep.donations}`, data);
  }

  // ──── RECURRING ACTIONS ────
  updateRecurring(id: string, data: any): Observable<any> {
    // Assuming a generic update endpoint for recurring plans
    return this.http.put(`${this.base}${this.ep.recurring}/${id}`, data);
  }

  // ──── CAMPAIGN CRUD ────
  createCampaign(data: any): Observable<any> {
    return this.http.post(`${this.base}${this.ep.campaigns}`, data);
  }

  updateCampaign(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}${this.ep.campaigns}/${id}`, data);
  }

  deleteCampaign(id: string): Observable<any> {
    return this.http.delete(`${this.base}${this.ep.campaigns}/${id}`);
  }

  // ──── SETTINGS ACTIONS ────
  updateSettings(data: any): Observable<any> {
    return this.http.put(`${this.base}${this.ep.settings}`, data);
  }
}
