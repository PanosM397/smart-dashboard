import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MenuItem } from 'primeng/api';
import { Device } from '../../models/device.model';
import { DeviceService } from 'src/shared/device.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  items!: MenuItem[];

  // New properties for IoT devices
  devices!: Device[];

  displayDialog: boolean = false;
  selectedDevice!: Device;
deviceUsageData: any;

  constructor(private http: HttpClient, private deviceService: DeviceService, private messageService: MessageService) {
    this.fetchDevices();
  }

  ngOnInit(): void {}

  fetchDevices() {
    // Implement fetchDevices to retrieve device data from your backend
    this.deviceService.getDevices().subscribe(
      (data) => (this.devices = data),
      (error) => console.error(error)
    );
    console.log(this.devices);
  }

  toggleDevice(device: Device) {
    console.log("Toggling device:", device, "with ID:", device._id);

    if (device && device._id != null) {
      this.deviceService.toggleDevice(device._id).subscribe(
        (data) => {
          // Handle response and update UI accordingly
          const index = this.devices.findIndex(d => d._id === device._id);
          if (index !== -1) {
            this.devices[index].status = this.devices[index].status === 'On' ? 'Off' : 'On';
          }
          this.messageService.add({
            severity: 'success',
            summary: 'Device Toggled',
            detail: `The device ${device.name} has been turned ${device.status}.`
          });
        },
        (error) => console.error("Error toggling device:", error)
      );
    } else {
      console.error("Device ID is undefined:", device);
    }
  }

  inspectDevice(device: Device): void {
    this.selectedDevice = device;
    this.displayDialog = true; // Opens the dialog
  }

  closeDialog(): void {
    this.displayDialog = false;
  }

  getBadgeSeverity(status: string): "success" | "info" | "warning" | "danger" | undefined {
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
    return `device-status-badge status-${status.toLowerCase()}`;
  }

  // filterCriteria = {
  //   room: '',
  //   timeOfDay: '',
  //   roomTemperature: '',
  //   humidity: '',
  //   occupancy: ''
  // };
  // dates!: Date[]; // To hold the date range
  // rooms: any[] | undefined;
  // timesOfDay: any[] | undefined;

  // public energyData: any;

  // this.rooms = [
  //   { label: 'Room 1', value: 'room1' },
  //   { label: 'Room 2', value: 'room2' },
  //   // ... other rooms
  // ];

  // Method to apply filters
  // applyFilters() {
  //   const startDate = this.dates[0];
  //   const endDate = this.dates[1];
  //   const { roomTemperature, humidity, occupancy } = this.filterCriteria;

  //   this.http
  //     .get('http://localhost:3000/api/filtered-data', {
  //       params: {
  //         startDate: startDate.toISOString(),
  //         endDate: endDate.toISOString(),
  //         roomTemperature, // ensure these match the expected query params
  //         humidity,
  //         occupancy,
  //       },
  //     })
  //     .subscribe(
  //       (data) => {
  //         // Update your charts or tables with this filtered data
  //         this.energyData = data;
  //       },
  //       (error) => {
  //         console.error('Error fetching filtered data:', error);
  //       }
  //     );
  // }
}
