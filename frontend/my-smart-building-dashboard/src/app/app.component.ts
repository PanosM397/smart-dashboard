import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'my-smart-building-dashboard';

  constructor(
    private primengConfig: PrimeNGConfig,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
