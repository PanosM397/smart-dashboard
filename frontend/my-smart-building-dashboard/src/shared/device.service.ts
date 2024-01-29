import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../models/device.model'; // Import your Device model

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  private apiUrl = 'http://localhost:3000/api/devices'; // Your backend API URL

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
