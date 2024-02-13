import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '.././environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class EnergyDataService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRealTimeData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/realtime`);
  }

  getHistoricalData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/historical`);
  }

  getSolarData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/solar-data`);
  }

  getLatestSolarData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/solar-data/latest`);
  }

  getLimitedSolarData(limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/solar-data?limit=${limit}`);
  }

  postSolarData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/solar-data`, data);
  }

  updateSolarData(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/solar-data/${id}`, data);
  }
}
