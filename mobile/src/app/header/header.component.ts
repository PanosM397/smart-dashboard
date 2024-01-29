import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  items: any[];

  constructor() {
    this.items = [
      { title: 'Dashboard', url: '/', icon: 'home' },
      { title: 'Floor Management', url: '/plan', icon: 'business' },
      { title: 'Solar Monitoring', url: '/solar', icon: 'sunny' },
    ];
  }
}
