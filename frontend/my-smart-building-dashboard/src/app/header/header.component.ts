import { Component, EventEmitter, Output, ViewEncapsulation } from '@angular/core';


interface MenuItem {
  label: string;
  icon: string;
  routerLink: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  items: any[];

  // settings: SelectItem[]; // For settings dropdown

  constructor() {
    // Settings dropdown options
    // this.settings = [
    //   { label: 'Option 1', value: 'option1' },
    //   { label: 'Option 2', value: 'option2' },
    //   // More options
    // ];

    this.items = [
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-home',
        routerLink: '/'
      },
      {
        label: 'Floor Management',
        icon: 'pi pi-fw pi-building',
        routerLink: '/plan'
      },
      {
        label: 'Solar Monitoring',
        icon: 'pi pi-fw pi-sun',
        routerLink: '/solar'
      },
    ];
  }
}
