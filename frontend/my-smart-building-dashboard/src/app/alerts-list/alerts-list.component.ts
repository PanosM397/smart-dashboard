import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../shared/alert.service';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-alerts-list',
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.scss']
})
export class AlertsListComponent implements OnInit {
  alerts: any[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertService.getActiveAlerts().subscribe(
      data => {
        this.alerts = data;
      },
      error => {
        console.error('Error fetching alerts:', error);
      }
    );
  }

  acknowledgeAlert(id: string): void {
    this.alertService.acknowledgeAlert(id).subscribe(() => {
      // Reload the alerts list to reflect the change
      this.loadAlerts();
    });
  }

  deleteAlert(id: string): void {
    this.alertService.deleteAlert(id).subscribe(() => {
      // Reload the alerts list to reflect the change
      this.loadAlerts();
    });
  }
}
