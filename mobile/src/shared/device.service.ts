import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Device {
  _id: number;
  name: string;
  status: 'On' | 'Off';
  type: string;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:3000/api/devices';
  // private apiUrl = 'https://192.168.2.8:3000/api/devices';

  constructor(private http: HttpClient) { }

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl);
  }

  toggleDevice(deviceId: number): Observable<any> {
    // API call to toggle the device on/off
    const url = `${this.apiUrl}/${deviceId}/toggle`;
    return this.http.post(url, { });
  }
}
