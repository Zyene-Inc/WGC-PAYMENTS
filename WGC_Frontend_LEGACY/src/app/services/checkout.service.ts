import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private http = inject(HttpClient);
  private base = API_CONFIG.baseUrl;
  private ep = API_CONFIG.endpoints.checkout;

  getChurchInfo(slug: string): Observable<any> {
    return this.http.get<any>(`${this.base}${this.ep.info(slug)}`);
  }

  processDonation(slug: string, donationData: any): Observable<any> {
    return this.http.post<any>(`${this.base}${this.ep.donate(slug)}`, donationData);
  }
}
