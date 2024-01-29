import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DeviceService } from 'src/shared/device.service';

export interface Device {
  _id: number;
  name: string;
  status: 'On' | 'Off';
  type: string;
  location?: string;
}

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  pages = [
    { title: 'Energy Data', url: '/dashboard/energy-data', icon: 'flash' },
    {
      title: 'Device Control',
      url: '/dashboard/device-control',
      icon: 'construct',
    },
  ];

  // items!: MenuItem[];

  // New properties for IoT devices
  devices!: Device[];

  displayDialog: boolean = false;
  selectedDevice!: Device;
  deviceUsageData: any;

  constructor(
    private http: HttpClient,
    private deviceService: DeviceService,
  ) {
    this.fetchDevices();
  }

  ngOnInit(): void {
    console.log(this.devices);
  }

  fetchDevices() {
    this.deviceService.getDevices().subscribe(
      (data) => (this.devices = data),
      (error) => console.error(error),
    );
    console.log(this.devices);
  }

  toggleDevice(device: Device) {
    console.log('Toggling device:', device, 'with ID:', device._id);

    if (device && device._id != null) {
      this.deviceService.toggleDevice(device._id).subscribe(
        (data) => {
          // Handle response and update UI accordingly
          const index = this.devices.findIndex((d) => d._id === device._id);
          if (index !== -1) {
            this.devices[index].status =
              this.devices[index].status === 'On' ? 'Off' : 'On';
          }
          // this.messageService.add({
          //   severity: 'success',
          //   summary: 'Device Toggled',
          //   detail: `The device ${device.name} has been turned ${device.status}.`
          // });
        },
        (error) => console.error('Error toggling device:', error),
      );
    } else {
      console.error('Device ID is undefined:', device);
    }
  }

  inspectDevice(device: Device): void {
    this.selectedDevice = device;
    this.displayDialog = true;
  }

  closeDialog(): void {
    this.displayDialog = false;
  }

  getBadgeSeverity(
    status: string,
  ): 'success' | 'info' | 'warning' | 'danger' | undefined {
    switch (status) {
      case 'On':
        return 'success';
      case 'Off':
        return 'danger';
      case 'Alert':
        return 'warning';
      default:
        return 'info'; // Or undefined if no match
    }
  }

  getBadgeStyleClass(status: string): string {
    return `device-status-${status.toLowerCase()}`;
  }

  // getBadgeStyleClass(status: string): string {
  //   return `device-status-badge status-${status.toLowerCase()}`;
  // }
}
