import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Device } from '../models/device.model';
import { environment } from '.././environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  private apiUrl = environment.apiUrl + '/devices';

  constructor(private http: HttpClient) {}

  getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(this.apiUrl);
  }

  toggleDevice(deviceId: number): Observable<any> {
    // API call to toggle the device on/off
    const url = `${this.apiUrl}/${deviceId}/toggle`;
    return this.http.post(url, {});
  }
}
