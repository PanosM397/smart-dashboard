import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Alert } from '../models/alert.model'; // Adjust the import path as necessary

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private apiUrl = 'http://localhost:3000/api/alerts'; // Adjust the URL to match your API

  constructor(private http: HttpClient) {}

  getActiveAlerts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  deleteAlert(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  acknowledgeAlert(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/acknowledge`, {});
  }
}
