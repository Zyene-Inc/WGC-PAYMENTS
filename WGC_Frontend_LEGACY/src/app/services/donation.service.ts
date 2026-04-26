import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

export interface DonationData {
  donorName: string;
  donorEmail: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  amount: number;
  fund: string;
  coverFee: boolean;
  isRecurring: boolean;
}

export interface DonationResponse {
  status: string;
  data: {
    transferId: string;
    state: string;
    amount: number;
    donorName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DonationService {
  private http = inject(HttpClient);
  private apiUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.donate}`;

  processDonation(data: DonationData): Observable<DonationResponse> {
    return this.http.post<DonationResponse>(this.apiUrl, data);
  }
}
