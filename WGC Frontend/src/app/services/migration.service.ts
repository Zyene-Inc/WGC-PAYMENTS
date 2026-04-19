import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class MigrationService {
  private http = inject(HttpClient);
  private base = API_CONFIG.baseUrl;
  private ep = API_CONFIG.endpoints.migrationCenter;

  getSummary(): Observable<any> {
    return this.http.get<any>(`${this.base}${this.ep.summary}`);
  }

  listJobs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}${this.ep.jobs}`);
  }

  createJob(type: string, fileName: string, rows: any[]): Observable<any> {
    return this.http.post<any>(`${this.base}${this.ep.jobs}`, { type, fileName, rows });
  }

  getJobDetail(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}${this.ep.jobDetail(id)}`);
  }

  validateJob(id: string): Observable<any> {
    return this.http.post<any>(`${this.base}${this.ep.validate(id)}`, {});
  }

  updateMapping(id: string, mapping: any): Observable<any> {
    return this.http.put<any>(`${this.base}${this.ep.mapping(id)}`, { mapping });
  }

  getPreview(id: string): Observable<any> {
    return this.http.get<any>(`${this.base}${this.ep.preview(id)}`);
  }

  confirmImport(id: string): Observable<any> {
    return this.http.post<any>(`${this.base}${this.ep.confirm(id)}`, {});
  }
}
